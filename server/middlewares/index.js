const jwt = require('jsonwebtoken');

const validationToken = (req, res, next) => {
    let token = req.get('Authorization');
    if(!token){
        return res.status(401).json({ ok: false, err:{ message: 'Token required' }});
    }

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({ ok: false, err: { message: 'Invalid Token' } })
        }
        // Add the requesting user to the request
        req.user = decoded.user;
        next();
    })
}

const adminValidator = (req, res, next) => {
    if(req.user.role !== 'ADMIN'){
        return res.status(401).json({ ok: false, err: { message: 'Insufficient permissions' }})
    }
    next();
}

module.exports = {
    validationToken,
    adminValidator
}