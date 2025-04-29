import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCebJfIux1qSa77o0lLxRbPYa99uuxjZiY",
  authDomain: "virtual-internship-91a09.firebaseapp.com",
  projectId: "virtual-internship-91a09",
  storageBucket: "virtual-internship-91a09.firebasestorage.app",
  messagingSenderId: "363416645639",
  appId: "1:363416645639:web:79462ead19d5fc3b603aa2",
  measurementId: "G-69BPWX3D17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);



export { app, auth, db};
