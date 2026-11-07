import type { NextConfig } from "next";

// Rutas privadas: noindex aunque alguien enlace a ellas (robots.txt solo evita el rastreo).
const privateRoutes = ["/account", "/login", "/register", "/forgot-password/:path*", "/reset-password/:path*", "/confirm-account/:path*", "/auth-redirect", "/activate-premium", "/unlimited-access"];

const nextConfig: NextConfig = {
  compress: true,
  async headers() {
    return privateRoutes.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
};

export default nextConfig;
