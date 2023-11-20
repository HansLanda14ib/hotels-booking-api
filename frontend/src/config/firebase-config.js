import firebase from 'firebase/app';
import 'firebase/analytics';

//console.log('All environment variables:', process.env);
require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
};
//console.log('Firebase config:', firebaseConfig);
// // Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.analytics();
