const jwt = require('jsonwebtoken');

const createJWT = ({payload}) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME}
    );

}
const isTokenValid = ({token}) => { //this returns the payload
    return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({payload: user})
    const oneDay = 1000 * 3600 * 24
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production', //true is we're in the production
        signed: true
    })
}

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
}