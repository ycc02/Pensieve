/**
 * Check if the user has been authenticated.
 *
 * @param req
 * @param res
 * @param next
 */
function isAuthenticated(req, res, next) {
  if (req['extra'] && req['extra']['tokenUserId']) {
    next();
  } else {
    const resData = {
      error: 1,
      message: 'Forbidden',
    };
    res.status(403).json(resData);
  }
}

module.exports = {
  isAuthenticated,
};
