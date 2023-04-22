// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbnocq_T_NNQw1thPeimoyrKDM82hK1T8",
  authDomain: "proiect-ip-c3429.firebaseapp.com",
  projectId: "proiect-ip-c3429",
  storageBucket: "proiect-ip-c3429.appspot.com",
  messagingSenderId: "251133083444",
  appId: "1:251133083444:web:ea2ee6e7bb65ac7e686f61",
  measurementId: "G-ZQVTJMLPQS"
};

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);

export {
    fb,
    auth,
    db
};