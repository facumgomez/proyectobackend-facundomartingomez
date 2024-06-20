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