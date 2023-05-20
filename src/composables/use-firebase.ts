import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzUardcFInC1Os7ynHGiq5R2YKnZSmKEk",
  authDomain: "nine-29413.firebaseapp.com",
  projectId: "nine-29413",
  storageBucket: "nine-29413.appspot.com",
  messagingSenderId: "981466426779",
  appId: "1:981466426779:web:f22dc05032adf18473453e"
};

// init firebase
initializeApp(firebaseConfig)

// init firestore service
const db = getFirestore()
export default db