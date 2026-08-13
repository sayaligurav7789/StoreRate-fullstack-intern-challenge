const bcrypt = require('bcryptjs');
const prisma = require('../utils/prismaClient');

const SALT_ROUNDS = 10;

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// GET /api/admin/dashboard
async function getDashboard(req, res, next) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users  (Admin creates Normal User or Admin user; can also create Store Owner)
async function createUser(req, res, next) {
  try {
    const { name, email, address, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, address, password: hashed, role: role || 'NORMAL_USER' },
    });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&sortOrder=
async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
      ...(address && { address: { contains: address, mode: 'insensitive' } }),
      ...(role && { role }),
    };

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: { store: { include: { ratings: true } } },
    });

    const shaped = users.map((u) => {
      const base = sanitizeUser(u);
      if (u.role === 'STORE_OWNER' && u.store) {
        const ratings = u.store.ratings;
        const avg = ratings.length
          ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
          : null;
        base.rating = avg !== null ? Number(avg.toFixed(2)) : null;
      }
      delete base.store;
      return base;
    });

    res.json({ users: shaped });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id
async function getUserDetail(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { store: { include: { ratings: true } } },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const shaped = sanitizeUser(user);
    if (user.role === 'STORE_OWNER' && user.store) {
      const ratings = user.store.ratings;
      const avg = ratings.length
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
        : null;
      shaped.rating = avg !== null ? Number(avg.toFixed(2)) : null;
    }
    delete shaped.store;

    res.json({ user: shaped });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/stores  (Admin adds a new store, optionally assigning an existing STORE_OWNER user)
async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    const existing = await prisma.store.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A store with this email already exists' });
    }

    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: Number(ownerId) } });
      if (!owner) return res.status(404).json({ message: 'Owner user not found' });
      if (owner.role !== 'STORE_OWNER') {
        return res.status(400).json({ message: 'Assigned owner must have the STORE_OWNER role' });
      }
      const alreadyOwns = await prisma.store.findUnique({ where: { ownerId: owner.id } });
      if (alreadyOwns) {
        return res.status(409).json({ message: 'This owner already has a store assigned' });
      }
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ...(ownerId && { ownerId: Number(ownerId) }),
      },
    });

    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores?name=&email=&address=&sortBy=&sortOrder=
async function listStores(req, res, next) {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(email && { email: { contains: email, mode: 'insensitive' } }),
      ...(address && { address: { contains: address, mode: 'insensitive' } }),
    };

    const sortableFields = ['name', 'email', 'address', 'createdAt'];
    const orderBy = sortableFields.includes(sortBy) ? { [sortBy]: sortOrder } : { name: 'asc' };

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: { ratings: true },
    });

    const shaped = stores.map((s) => {
      const avg = s.ratings.length
        ? s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length
        : null;
      const { ratings, ...rest } = s;
      return { ...rest, rating: avg !== null ? Number(avg.toFixed(2)) : null, totalRatings: ratings.length };
    });

    if (sortBy === 'rating') {
      shaped.sort((a, b) => {
        const diff = (a.rating || 0) - (b.rating || 0);
        return sortOrder === 'desc' ? -diff : diff;
      });
    }

    res.json({ stores: shaped });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
};
