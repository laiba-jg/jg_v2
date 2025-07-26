export const authenticate = (req, res, next) => {
    // mock user id for demonstration purposes
    req.userId = "6883ab74ee0a2f039637141f";
    next();
}