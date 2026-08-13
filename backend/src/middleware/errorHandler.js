// Catches Prisma known errors and anything thrown/next(err)'d from controllers.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const fields = (err.meta && err.meta.target) || [];
    return res.status(409).json({ message: `A record with this ${fields.join(', ')} already exists` });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

module.exports = errorHandler;
