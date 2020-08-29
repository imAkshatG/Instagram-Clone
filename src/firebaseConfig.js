import firebase from 'firebase';

firebase.initializeApp({
    apiKey: "AIzaSyDpyksqVKwPm9rxyjCaIeICFXSaMzCeXUA",
    authDomain: "instagram-clone-c50d6.firebaseapp.com",
    databaseURL: "https://instagram-clone-c50d6.firebaseio.com",
    projectId: "instagram-clone-c50d6",
    storageBucket: "instagram-clone-c50d6.appspot.com",
    messagingSenderId: "436101826044",
    appId: "1:436101826044:web:1d7202991f0bba5c9a9e79",
    measurementId: "G-K0Z622LEWL"
})

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

