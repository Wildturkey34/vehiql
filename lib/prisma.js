import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

//globalThis.prisma: this global variable ensures that the prisma client instance is reused across hot reloads during development. Without this, each time our application reloads, a new instance of the Prisma client would be created, leading to potential connection issues with the database. By assigning the Prisma client instance to globalThis.prisma, we ensure that the same instance is used throughout the application lifecycle in development mode. This is a common pattern in Next.js applications to manage database connections efficiently.