"use strict";
exports.__esModule = true;
exports.db = void 0;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
var lite_1 = require("firebase/firestore/lite");
require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCUGyFjBk1BIiKzFS0ESuwdJahLvR2njqM",
    authDomain: "crawl-jobs-5b75b.firebaseapp.com",
    projectId: "crawl-jobs-5b75b",
    storageBucket: "crawl-jobs-5b75b.appspot.com",
    messagingSenderId: "872160547191",
    appId: "1:872160547191:web:63d7b6a6cddf4ccead1172",
    measurementId: "G-YCR5NF69FX"
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, lite_1.getFirestore)(app);
