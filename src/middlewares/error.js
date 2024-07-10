export default function errorHandler(error, res) {
  logger.error(error.message);
  if (error.cause)
    logger.error(error.cause);
  return res.status(400).json({ status: 'error', error: error.name });
}