export default function errorHandler(error, res) {
  console.log(error.message);
  if (error.cause)
    console.log(error.cause);
  return res.status(400).json({ status: 'error', error: error.name });
}