// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEwQTYjkpgo5zq9IY-Ii-92mdXZoqbumI",
  authDomain: "penny-expense-traker-app.firebaseapp.com",
  projectId: "penny-expense-traker-app",
  storageBucket: "penny-expense-traker-app.firebasestorage.app",
  messagingSenderId: "1060216923564",
  appId: "1:1060216923564:web:3b9c575f541ea1f54f4609"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app , {
    persistence: getReactNativePersistence(AsyncStorage),
});

//db
export const firestore = getFirestore(app);