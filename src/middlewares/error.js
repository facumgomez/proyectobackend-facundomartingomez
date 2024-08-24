import logger from '../helpers/logger.js';
import EErrors from '../services/errors/enums.js';

export default (error, req, res, next) => {
  logger.error(error.message);
  if (error.name == 'CastError') {
    error.code = EErrors.BAD_REQUEST;
    error.message = 'Identificación no valida';
  };
  switch (error.code) {
    case EErrors.BAD_REQUEST:
      res.status(error.code).json({ status: 'error', error: error.name, message: error.message });
      break; 

    case EErrors.INTERNAL_SERVER_ERROR:
      res.status(error.code).json({ status: 'error', error: error.name, message: error.message });
      break; 

    case EErrors.UNAUTHORIZED:
      res.status(error.code).json({ status: 'error', error: error.name, message: error.message });
      break; 

    case EErrors.CONFLICT:
      res.status(error.code).json({ status: 'error', error: error.name, message: error.message });
      break; 

    default:
      res.status(500).json({ status: 'error', error: error.name });
      break;
  };
}