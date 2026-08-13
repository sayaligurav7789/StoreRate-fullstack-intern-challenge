const prisma = require('../utils/prismaClient');

function computeAverage(ratings) {
  if (!ratings.length) return null;
  const sum = ratings.reduce((acc, r) => acc + r.value, 0);
  return Number((sum / ratings.length).toFixed(2));
}

// GET /api/stores?name=&address=&sortBy=&sortOrder=
// Available to any authenticated Normal User. Includes the caller's own submitted rating.
async function listStoresForUser(req, res, next) {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(address && { address: { contains: address, mode: 'insensitive' } }),
    };

    const sortableFields = ['name', 'address', 'createdAt'];
    const orderBy = sortableFields.includes(sortBy) ? { [sortBy]: sortOrder } : { name: 'asc' };

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: { ratings: true },
    });

    let shaped = stores.map((s) => {
      const userRating = s.ratings.find((r) => r.userId === req.user.id);
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        overallRating: computeAverage(s.ratings),
        totalRatings: s.ratings.length,
        userSubmittedRating: userRating ? userRating.value : null,
      };
    });

    if (sortBy === 'rating') {
      shaped.sort((a, b) => {
        const diff = (a.overallRating || 0) - (b.overallRating || 0);
        return sortOrder === 'desc' ? -diff : diff;
      });
    }

    res.json({ stores: shaped });
  } catch (err) {
    next(err);
  }
}

// GET /api/store-owner/dashboard
// Available to the logged-in Store Owner: list of raters + average rating for their store.
async function getStoreOwnerDashboard(req, res, next) {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: { user: { select: { id: true, name: true, email: true, address: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: 'No store is currently assigned to your account' });
    }

    const averageRating = computeAverage(store.ratings);

    const raters = store.ratings.map((r) => ({
      ratingId: r.id,
      value: r.value,
      submittedAt: r.createdAt,
      user: r.user,
    }));

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      totalRatings: store.ratings.length,
      raters,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStoresForUser, getStoreOwnerDashboard };
