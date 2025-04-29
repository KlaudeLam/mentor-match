import { auth, db } from "./firebase.js";
import {
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  let interests,
    skills,
    availability = [];
  let addableLists = {};
  // Fetch info
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

  const initiate = () => {
    document.getElementById("name").value = localStorage.getItem("name");
    document.getElementById("bio").value = localStorage.getItem("bio");
    document.getElementById("location").value =
      localStorage.getItem("location");

    render("interests");
    render("skills");

    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      if (availability.includes(checkbox.value)) checkbox.checked = true;
    });
  };

  const render = (name) => {
    const id = "info-" + name;
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

  // Add pics and preview
  const addPic = () => {
    document.getElementById("photo").addEventListener("change", function(event) {
      const file = event.target.files[0]; 
    
      if (file) {
        const reader = new FileReader();
    
        reader.onload = function(e) {
          const imagePreview = document.getElementById("img-preview");

          // Set the image source to the file
          imagePreview.src = e.target.result; 

          // Make the image visible
          imagePreview.style.display = "block"; 
        };
        
        // Read the image file as a data URL
        reader.readAsDataURL(file); 
      }
    });
  }

  // Press add to save info
  const addCapsule = () => {
    const addBtns = document.querySelectorAll(".add-btns");
    // Check which add the button belongs to
    addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const type = btn.id.replace("add-", "");
        const newVal = document.getElementById(type).value;

        // add to array
        addableLists[type].push(newVal);

        // rerender
        render(type);

        // empty input
        document.getElementById(type).value = "";
      });
    });
  };

  // Press delete capsule

  // Cancel
  const cancel = () => {
    const cancelBtn = document.getElementById("cancel-btn");
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./profile.js";
    });
  };

  // Save info
  const save = () => {
    const saveBtn = document.getElementById("save-btn");
    saveBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById("name").value,
        bio: document.getElementById("bio").value,
        location: document.getElementById("location").value,
        interests,
        skills,
        availability: [
          ...document.querySelectorAll('input[name="availability"]:checked'),
        ].map((checkbox) => checkbox.value),
      };

      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), data);

        alert("Update successfully!");
        window.location.href = "profile.html";
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      }
    });
  };

  //  Delete account
  const deleteAccount = () => {};

  onAuthStateChanged(auth, (user) => {
    if (user) {
      updateLocalStorage();

      // Fill out the information
      interests = JSON.parse(localStorage.getItem("interests"));
      skills = JSON.parse(localStorage.getItem("skills"));
      availability = JSON.parse(localStorage.getItem("availability"));

      addableLists = { skills, interests };

      initiate();
      addPic();
      addCapsule();
      cancel();
      save();
      // deleteAccount();
    } else {
      // Not logged in, maybe redirect to login
      window.location.href = "signin.html";
    }
  });
});
