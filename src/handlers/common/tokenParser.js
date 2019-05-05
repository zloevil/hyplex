export default (req, res, next) => {
  const token = req.headers && req.headers.authorization && req.headers.authorization
    .replace('Bearer ', '')
  req.token = token
  next()
}
