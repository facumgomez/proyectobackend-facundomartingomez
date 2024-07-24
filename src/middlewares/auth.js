export const isAdmin = async (req, res, next) => {
  try {
    const userRole = req.user?.role;
    if (userRole == 'admin')
      return next();
    return res.status(401).render('error', { error: 'Acceso solo permitido para administradores.' });
  } catch (error) {
    console.log(error);
  };
};

export const isUser = async (req, res, next) => {
  try {
    const userRole = req.user?.role;
    console.log(userRole);
    if (userRole == 'user') 
      return next();
    return res.status(401).render('error', { error: 'Acceso solo permitido para usuarios.' });
  } catch (error) {
    console.log(error);
  };
};

export const isPremium = async (req, res, next) => {
  try {
    const userRole = req.user?.role
    if(userRole == 'premium' || userRole == 'admin') 
      return next();
    return res.status(401).render('error', {
      error: 'Solo los administradores o usuarios premium pueden acceder a esta ruta.'     
    });
  } catch (error) {
    console.log(error);
  };
};