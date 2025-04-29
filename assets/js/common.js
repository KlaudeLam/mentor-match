import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { auth } from "./firebase.js";

// toggle content based on auth status
const loggedinElements = document.querySelectorAll(".logged-in");
const loggedoutElements = document.querySelectorAll(".logged-out");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user");
    loggedoutElements.forEach((element) => element.classList.add("hidden"));
    loggedinElements.forEach((element) => element.classList.remove("hidden"));
  } else {
    loggedoutElements.forEach((element) => element.classList.remove("hidden"));
    loggedinElements.forEach((element) => element.classList.add("hidden"));
  }
});

// Display info
const username = localStorage.getItem("name");
document.querySelectorAll(".username").forEach(element => {
  element.innerHTML = username;
})