const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

module.exports = admin;

/*

const admin = require('firebase-admin');

const serviceAccount = require('./credentials.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;



 */