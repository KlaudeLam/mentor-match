import { onUserReady } from "./common.js";
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  let addableLists ={};
  let interests=[];
  let skills=[];
  let availability = [];

  const initiate = () => {
    document.getElementById("name").innerHTML = localStorage.getItem("name");
    document.getElementById("bio").innerHTML = localStorage.getItem("bio");
    document.getElementById("location").innerHTML = localStorage.getItem("location");
    document.getElementById("role").innerHTML = localStorage.getItem("role");
    document.getElementById("img-preview").src = (localStorage.getItem("img"))? localStorage.getItem("img") : "./assets/images/user.png";
    render("interests");
    render("skills");
    render("availability");
  };

  const render = (name) => {
    const id = name;
    const list = addableLists[name];
    document.getElementById(id).innerHTML = "";

    if (!list.length) return;
    list.forEach((element) => {
      document
        .getElementById(id)
        .insertAdjacentHTML(
          "beforeend",
          `<div class="capsule">${element}</div>`
        );
    });
  };
  
  onUserReady(()=>{
    interests = JSON.parse(localStorage.getItem("interests"));
    skills = JSON.parse(localStorage.getItem("skills"));
    availability = JSON.parse(localStorage.getItem("availability"));
    addableLists = {interests,skills,availability};

    initiate();
  });
});
