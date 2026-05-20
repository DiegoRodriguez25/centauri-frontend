const isNetworkError = (err) =>
  err.code === 'ENETUNREACH' ||
  err.code === 'P1001' ||
  err.code === 'P1008' ||
  err.message?.includes("Can't reach database")

export const errorHandler = (err, req, res, next) => {
  if (isNetworkError(err)) {
    return res.status(503).json({ mensaje: 'Base de datos no disponible, intente de nuevo.' })
  }

  const status = err.statusCode ?? 500;
  const mensaje = err.statusCode ? err.message : 'Error interno del servidor';
  
  if (!err.statusCode) console.error(err);
  
  res.status(status).json({ mensaje });
};

export default errorHandler;