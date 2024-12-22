import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBj4zp5qsbZlGbc3QIMYzSkWQBFis2ky0g",
  authDomain: "my-listings-app-4734e.firebaseapp.com",
  projectId: "my-listings-app-4734e",
  storageBucket: "my-listings-app-4734e.firebasestorage.app",
  messagingSenderId: "236833616834",
  appId: "1:236833616834:web:b01dbe0dbe5df0347a5c5b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);