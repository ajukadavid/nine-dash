import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuwcwo814ZfjmKVrcwPRfaD6YahrcLWpg",
  authDomain: "nine-c6a0a.firebaseapp.com",
  projectId: "nine-c6a0a",
  storageBucket: "nine-c6a0a.appspot.com",
  messagingSenderId: "740031502016",
  appId: "1:740031502016:web:7fc9d432d40447727a7f25"
};

// init firebase
initializeApp(firebaseConfig)

// init firestore service
const db = getFirestore()
export default db