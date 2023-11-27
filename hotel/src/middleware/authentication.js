const CustomError = require('../errors')
const {isTokenValid} = require('../utils')
const admin = require('../configs/firebase-config');
const {StatusCodes} = require("http-status-codes");


const decodeToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    // throw new CustomError.UnauthenticatedError('Authentication Invalid')
    //console.log('Token : '+token)
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (decodeValue) {
            //console.log(decodeValue)
            const userId= decodeValue.uid;
            const email= decodeValue.email;
            const isVerified= decodeValue.email_verified;

            // Fetch additional user data including role from Firestore
            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            const userData = userDoc.data();

            // Access role from user data in Firestore
            const role = userData?.role || 'user'; // Default role if not found

            req.user={userId,email,isVerified,role}
            return next();
        }
        return res.json({message: 'Unauthorized'});
    } catch (e) {
        //console.log(e)
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Missing or invalid token.'});
    }
}


const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid ff')

    }
    try {
        const {name, userId, role} = isTokenValid({token})
        req.user = {name, userId, role}
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access')
        }
        next()

    }


}

module.exports = {
    authenticateUser, authorizePermissions,decodeToken
}