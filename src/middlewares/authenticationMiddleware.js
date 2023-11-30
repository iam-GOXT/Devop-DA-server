const { verifyToken, decodeToken } = require('../utils/jwtUtils')

exports.isAuth = async(req, res, next) => {
    let token = req.params.token;
    try{
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
            return res.status(403).json({message: 'Invalid token, unauthorized user'})
        }

        token = req.headers.authorization.split(' ')[1]

        const { expired } = verifyToken(token);

        if(expired) {
            return res.status(403).json({message: "Expired token, unauthorized user"})
        }
        req.user = decodeToken(token)

        next()
    } catch(err) {
        return res.status(403).json({
            success: false,
            message: err
        })
    }
}