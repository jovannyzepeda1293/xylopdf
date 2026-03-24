import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
dotenv.config({ override: true });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);

export const prisma =
  globalForPrisma.prisma ||
  (new PrismaClient({
    adapter: adapter as any,
    log: ['query'],
  }) as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
