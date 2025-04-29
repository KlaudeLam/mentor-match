import { auth, db } from "./firebase.js";
import {
  updateDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { onUserReady } from "./common.js";

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  let interests,
    skills,
    availability = [];
  let addableLists = {};
  let file;
  let imgURL = "";
  const cloudName = "diib6xxxh";
  const preset = "users_preset";

  const initiate = () => {
    document.getElementById("name").value = localStorage.getItem("name");
    document.getElementById("bio").value = localStorage.getItem("bio");
    document.getElementById("location").value =
      localStorage.getItem("location");

    document.getElementById("img-preview").src = localStorage.getItem("img");
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
    document
      .getElementById("photo")
      .addEventListener("change", function (event) {
        file = event.target.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = function (e) {
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
  };

  // Press add to save info
  const addCapsule = () => {
    const addBtns = document.querySelectorAll(".add-btns");
    // Check which add the button belongs to
    addBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const type = btn.id.replace("add-", "");
        const newVal = document.getElementById(type).value;
        if (!newVal.length) return;
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
      window.location.href = "profile.html";
    });
  };

  // Upoad to Cloudinary
  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    // Upload to users/ folder in Cloudinary
    formData.append("folder", "users");

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // Return image URL
  };

  // Save info
  const save = async () => {
    const saveBtn = document.getElementById("save-btn");
    saveBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (file) {
        try {
          imgURL = await uploadToCloudinary(file);
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        }
      }

      const data = {
        name: document.getElementById("name").value,
        bio: document.getElementById("bio").value,
        location: document.getElementById("location").value,
        interests,
        skills,
        availability: [
          ...document.querySelectorAll('input[name="availability"]:checked'),
        ].map((checkbox) => checkbox.value),
        img: imgURL ? imgURL : localStorage.getItem("img"),
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

  // Delete account confirmation
  const showPopup = () => {
    document.getElementById("popup").style.display = "flex";
  };
  const hidePopup = () => {
    document.getElementById("popup").style.display = "none";
  };


  //  Delete account
  const deleteAccount = async () => {
    document
      .getElementById("del-acc-btn")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        showPopup();

        document
          .getElementById("unconfirm-btn")
          .addEventListener("click", (e) => {
            e.preventDefault();
            hidePopup();
          });

        document.getElementById("confirm-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            // clear firestore
            try {
              await deleteDoc(doc(db, "users", auth.currentUser.uid));
              await deleteUser(auth.currentUser);
              localStorage.clear();
              hidePopup();
              window.location.href = "dashboard.html";
            } catch (error) {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            }
          });
      });
  };

  onUserReady(()=>{
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
    deleteAccount();
  });
});
