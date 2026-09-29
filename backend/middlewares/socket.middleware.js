const socketAuthMiddleware = (socket, next) => {
  try {
    const session = socket.request.session;  
    if (!session?.userId) {
      return next(new Error("Unauthorized"));
    }

    session.touch();

    socket.user = {
      id: session.userId,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export default socketAuthMiddleware;