const prisma = require('../utils/prismaClient');

// POST /api/ratings/:storeId  { value }
// Creates a new rating if the user hasn't rated this store yet, otherwise updates it.
// This single endpoint backs both "submit a rating" and "modify submitted rating".
async function upsertRating(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);
    const { value, comment } = req.body;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Normalize empty string to null so the DB stores "no comment" consistently.
    const normalizedComment = comment && comment.trim() ? comment.trim() : null;

    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      update: { value, comment: normalizedComment },
      create: { value, comment: normalizedComment, userId: req.user.id, storeId },
    });

    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/ratings/:storeId  (optional: allow a user to remove their rating)
async function deleteRating(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);

    await prisma.rating.delete({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });

    res.json({ message: 'Rating removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = { upsertRating, deleteRating };
