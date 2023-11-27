const jwt = require('jsonwebtoken');

const createJWT = ({payload}) => {
    return jwt.sign(payload, process.env.JWT_SECRET);

}

module.exports = {
    createJWT,
}