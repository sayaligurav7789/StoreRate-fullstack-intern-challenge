/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function hash(pw) {
  return bcrypt.hash(pw, SALT_ROUNDS);
}

async function main() {
  console.log('Seeding database...');

  // Clean slate (order matters because of FK constraints)
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  // --- System Administrator ---
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@storerating.com',
      address: '1 Admin Plaza, Springfield, IL, USA',
      password: await hash('Admin@1234'),
      role: 'SYSTEM_ADMIN',
    },
  });

  // --- Store Owners ---
  const owner1 = await prisma.user.create({
    data: {
      name: 'Jonathan Alexander Whitmore',
      email: 'owner1@storerating.com',
      address: '221B Baker Street, London, UK',
      password: await hash('Owner@1234'),
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Margaret Elizabeth Thompson',
      email: 'owner2@storerating.com',
      address: '42 Wallaby Way, Sydney, Australia',
      password: await hash('Owner@1234'),
      role: 'STORE_OWNER',
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Rajendra Prasad Venkataraman',
      email: 'owner3@storerating.com',
      address: '18 MG Road, Pune, Maharashtra, India',
      password: await hash('Owner@1234'),
      role: 'STORE_OWNER',
    },
  });

  // --- Normal Users ---
  const userSeeds = [
    ['Alexander Benjamin Fitzgerald', 'alex.fitzgerald@example.com', '10 Downing Street, London, UK'],
    ['Priyanka Chandrashekar Iyer', 'priyanka.iyer@example.com', '55 Marine Drive, Mumbai, India'],
    ['Christopher Michael Anderson', 'chris.anderson@example.com', '900 5th Avenue, New York, NY, USA'],
    ['Samantha Elizabeth Rodriguez', 'samantha.rodriguez@example.com', '77 Sunset Blvd, Los Angeles, CA, USA'],
    ['Mohammed Abdullah Al-Farsi', 'mohammed.alfarsi@example.com', '12 Sheikh Zayed Road, Dubai, UAE'],
  ];

  const users = [];
  for (const [name, email, address] of userSeeds) {
    const u = await prisma.user.create({
      data: { name, email, address, password: await hash('User@1234'), role: 'NORMAL_USER' },
    });
    users.push(u);
  }

  // --- Stores ---
  const store1 = await prisma.store.create({
    data: {
      name: 'The Golden Spoon Restaurant',
      email: 'contact@goldenspoon.com',
      address: '15 Culinary Lane, Springfield, IL, USA',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Harborview Electronics Store',
      email: 'support@harborview-electronics.com',
      address: '88 Harbor Street, Sydney, Australia',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Bloom & Petal Flower Boutique',
      email: 'hello@bloompetal.com',
      address: '3 Garden Terrace, Pune, Maharashtra, India',
      ownerId: owner3.id,
    },
  });

  const store4 = await prisma.store.create({
    data: {
      name: 'Summit Peak Outdoor Gear',
      email: 'info@summitpeakgear.com',
      address: '200 Trailhead Road, Denver, CO, USA',
      // No owner assigned yet
    },
  });

  // --- Ratings ---
  const ratingsData = [
    [users[0].id, store1.id, 5],
    [users[1].id, store1.id, 4],
    [users[2].id, store1.id, 4],
    [users[3].id, store2.id, 3],
    [users[4].id, store2.id, 5],
    [users[0].id, store2.id, 4],
    [users[1].id, store3.id, 5],
    [users[2].id, store3.id, 5],
    [users[3].id, store3.id, 4],
    [users[4].id, store4.id, 2],
    [users[0].id, store4.id, 3],
  ];

  for (const [userId, storeId, value] of ratingsData) {
    await prisma.rating.create({ data: { userId, storeId, value } });
  }

  console.log('Seeding complete.');
  console.log('---------------------------------------------');
  console.log('Login credentials:');
  console.log('  Admin:       admin@storerating.com / Admin@1234');
  console.log('  Store Owner: owner1@storerating.com / Owner@1234');
  console.log('  Normal User: alex.fitzgerald@example.com / User@1234');
  console.log('---------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
