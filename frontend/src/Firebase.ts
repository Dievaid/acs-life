// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3tvx90oBKRHDZMbdlKaJCKGVK5HYuzW0",
  authDomain: "acs-life-703d6.firebaseapp.com",
  projectId: "acs-life-703d6",
  storageBucket: "acs-life-703d6.appspot.com",
  messagingSenderId: "1088572334830",
  appId: "1:1088572334830:web:47b388e92560818012c9ff",
  measurementId: "G-FDBWKG6119"
};

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);
const storage = getStorage(fb);

export {
    fb,
    auth,
    db,
    storage
};