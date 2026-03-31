import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" },
        recaptchaToken: { label: "Recaptcha", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.recaptchaToken) {
          throw new Error("Credenciales inválidas");
        }

        // Verificar reCAPTCHA
        try {
          const recaptchaRes = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`,
            { method: "POST" }
          );
          const recaptchaData = await recaptchaRes.json();
          if (!recaptchaData.success) {
            console.error("NextAuth Security: FALLO verificación reCAPTCHA para:", credentials.email);
            throw new Error("Bot detectado");
          }
        } catch (e) {
          console.error("NextAuth Security Error reCAPTCHA:", e);
          throw new Error("Error en verificación de seguridad");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            subscription: true
          }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Credenciales inválidas");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Credenciales inválidas");
        }

        const isSubActive = user.subscription?.status === 1 && 
          (user.subscription.expiresAt ? user.subscription.expiresAt > new Date() : false);

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          isConfirmed: !!user.isConfirmed,
          subscriptionActive: isSubActive,
          canceled: !!(user.subscription as any)?.canceled,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        const googleId = account.providerAccountId;

        if (!existingUser) {
          // Create user if it doesn't exist, Google users are auto-confirmed
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              googleId: googleId,
              avatarUrl: user.image || "",
              isConfirmed: true,
            }
          });
        } else if (!existingUser.googleId) {
          // Link Google ID if not already linked and mark as confirmed if it wasn't
          await prisma.user.update({
            where: { email: user.email },
            data: { 
              googleId: googleId,
              avatarUrl: existingUser.avatarUrl || user.image || "",
              isConfirmed: true,
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Al iniciar sesión por primera vez
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email as string },
            include: { subscription: true }
          });
          if (dbUser) {
            token.id = dbUser.id.toString();
            token.isConfirmed = !!dbUser.isConfirmed;
            if (dbUser.subscription) {
              const sub = dbUser.subscription;
              token.subscriptionActive = sub.status === 1 && (sub.expiresAt ? sub.expiresAt > new Date() : false);
              token.expiresAt = sub.expiresAt?.toISOString() || null;
              token.customerId = sub.customerId || null;
              token.subscriptionId = sub.subscriptionId || null;
              token.canceled = !!sub.canceled;
            }
          }
        } else {
          const u = user as any;
          token.id = u.id;
          token.isConfirmed = !!u.isConfirmed;
          token.subscriptionActive = !!u.subscriptionActive;
          // Para credenciales, necesitamos buscar el resto de datos de sub
          const sub = await prisma.subscription.findUnique({ where: { userId: parseInt(u.id) } });
          if (sub) {
            token.expiresAt = sub.expiresAt?.toISOString();
            token.customerId = sub.customerId;
            token.subscriptionId = sub.subscriptionId;
            token.canceled = sub.canceled;
          }
        }
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      } else if (token.id) {
        // En siguientes llamadas, refrescamos datos
        const id = parseInt(token.id as string);
        if (!isNaN(id)) {
          const userInDb = await prisma.user.findUnique({
            where: { id: id },
            include: { subscription: true }
          });
          if (userInDb) {
            token.isConfirmed = !!userInDb.isConfirmed;
            if (userInDb.subscription) {
              const subId = userInDb.id;
              // Consulta directa para evitar caché de Prisma
              const subs: any[] = await prisma.$queryRaw`SELECT * FROM subscriptions WHERE user_id = ${subId}`;
              const subFromDb = subs.length > 0 ? subs[0] : null;

              if (subFromDb) {
                const expiresAt = subFromDb.expires_at || subFromDb.expiresAt;
                token.subscriptionActive = subFromDb.status === 1 && (expiresAt ? new Date(expiresAt) > new Date() : false);
                token.expiresAt = expiresAt ? new Date(expiresAt).toISOString() : null;
                token.customerId = subFromDb.customer_id || subFromDb.customerId;
                token.subscriptionId = subFromDb.subscription_id || subFromDb.subscriptionId;
                token.canceled = subFromDb.canceled === true || subFromDb.canceled === 't' || subFromDb.canceled === 1;
              } else {
                token.subscriptionActive = false;
                token.expiresAt = null;
                token.canceled = false;
              }
            } else {
              token.subscriptionActive = false;
              token.expiresAt = null;
              token.canceled = false;
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.isConfirmed = token.isConfirmed as boolean;
        session.user.subscriptionActive = token.subscriptionActive as boolean;
        session.user.expiresAt = token.expiresAt as string;
        session.user.customerId = token.customerId as string;
        session.user.subscriptionId = token.subscriptionId as string;
        session.user.canceled = token.canceled as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hora de sesión (se logout tras 1 hora de inactividad)
    updateAge: 5 * 60,   // Refrescar el token cada 5 minutos de actividad
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
