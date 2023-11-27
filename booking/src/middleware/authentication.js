const CustomError = require('../errors')
const admin = require('../configs/firebase-config');
const jwt = require('jsonwebtoken');

const authenticateFirebaseToken = async (req, res, next) => {
    const firebaseToken = req.headers.authorization?.split(' ')[1];

    if (!firebaseToken) {
        return res.status(401).json({success: false, message: 'Firebase token is missing'});
    }

    try {
        const decodeValue = await admin.auth().verifyIdToken(firebaseToken);
        if (decodeValue) {
            const userId = decodeValue.uid;
            const email = decodeValue.email;
            const isVerified = decodeValue.email_verified;

            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            const userData = userDoc.data();


            const role = userData?.role || 'user'; // Default role if not found

            req.user = {userId, email, isVerified, role};
            req.firebaseUser = decodeValue;
            next();
        } else {
            return res.status(401).json({success: false, message: 'Invalid Firebase token'});
        }
    } catch (error) {
        return res.status(401).json({success: false, message: 'Error verifying Firebase token'});
    }
};

const authenticateJWTToken = (req, res, next) => {
    const jwtToken = req.headers['x-access-token'];

    if (!jwtToken) {
        return res.status(401).json({success: false, message: 'JWT token is missing'});
    }

    try {
        const decoded = jwt.verify(jwtToken, process.env.HOTEL_API_SECRET);
        req.jwtUser = decoded;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: 'Invalid JWT token'});
    }
};


const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access')
        }
        next()
    }

}

module.exports = {
    authorizePermissions, authenticateFirebaseToken, authenticateJWTToken
}