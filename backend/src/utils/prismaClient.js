const { PrismaClient } = require('@prisma/client');

// Reuse a single PrismaClient instance across the app (best practice for
// connection pooling, especially important with serverless/hot-reload dev servers).
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
