import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { logOut } from "./auth.js";

// Wait for common to load
let userReadyCallback = null;
let userData = null;
export const onUserReady = (callback) => {
  userReadyCallback = callback;

  // call immediately if already available
  if (userData) callback(userData);
};

// redirection
const routeMeta = [
  {
    route: "/dashboard.html",
    requireAuth: false,
    requireGuest: false,
  },
  {
    route: "/auth.html",
    requireAuth: false,
    requireGuest: true,
  },
  {
    route: "/profile.html",
    requireAuth: true,
    requireGuest: false,
  },
  {
    route: "/profileedit.html",
    requireAuth: true,
    requireGuest: false,
  },
];

const getRouteMeta = () => {
  const path = window.location.pathname;
  console.log(path);
  return routeMeta.find((r) => r.route == path);
};

// execute
document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  const loggedinElements = document.querySelectorAll(".logged-in");
  const loggedoutElements = document.querySelectorAll(".logged-out");

  // toggle content based on auth status
  const loggedInMode = () => {
    console.log("user");
    loggedoutElements.forEach((element) => element.classList.add("hidden"));
    loggedinElements.forEach((element) => element.classList.remove("hidden"));

    const username = localStorage.getItem("name");
    document
      .querySelectorAll(".username")
      .forEach((element) => (element.innerHTML = username));

    document.getElementById("user-avatar").src = localStorage.getItem("img");
  };
  const loggedOutMode = () => {
    loggedoutElements.forEach((element) => element.classList.remove("hidden"));
    loggedinElements.forEach((element) => element.classList.add("hidden"));
  };

  // Update local storage
  const updateLocalStorage = async () => {
    try {
      const snapshot = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snapshot.data();

      // Put data in local storage
      localStorage.clear();
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);
      localStorage.setItem("bio", data.bio);
      localStorage.setItem("img", data.img);
      localStorage.setItem("location", data.location);
      localStorage.setItem("interests", JSON.stringify(data.interests));
      localStorage.setItem("skills", JSON.stringify(data.skills));
      localStorage.setItem("availability", JSON.stringify(data.availability));
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

  // tell other files to wait for common.js load first
  onAuthStateChanged(auth, async (user) => {
    const meta = getRouteMeta();
    if (user) {
      // if (meta?.requireGuest) {
      //   // alert("You have already logged in");
      //   window.location.href = "dashboard.html";
      // }
      updateLocalStorage();
      loggedInMode();
      userData = user;
      if (typeof userReadyCallback === "function") userReadyCallback(userData);
    } else {
      // if (meta?.requireAuth) {
      //   // alert("Please log in first");
      //   window.location.href = "auth.html";
      // }
      loggedOutMode();
    }
  });

  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    logOut();
  });
});
