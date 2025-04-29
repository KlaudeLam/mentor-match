import { auth, db } from "./firebase.js";
import {
  setDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // toggle
  let toggle = "signup";
  const signinOpt = document.querySelector("#signin-opt");
  const signupOpt = document.querySelector("#signup-opt");

  const signupForm = document.querySelector("#signup-form");
  const signinForm = document.querySelector("#signin-form");

  signinOpt.addEventListener("click", () => {
    if (toggle === "signin") return;
    toggle = "signin";

    signinOpt.classList.add("active-option");
    signupOpt.classList.remove("active-option");
    signupForm.classList.add("hidden");
    signinForm.classList.remove("hidden");
  });

  signupOpt.addEventListener("click", () => {
    if (toggle === "signup") return;
    toggle = "signup";

    signupOpt.classList.add("active-option");
    signinOpt.classList.remove("active-option");
    signupForm.classList.remove("hidden");
    signinForm.classList.add("hidden");
  });

  // Sign up
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const role = document.querySelector('input[name="role"]:checked')?.value;
      const name = document.querySelector("#name").value;
      const signupEmail = document.querySelector("#signup-email").value;
      const signupPassword = document.querySelector("#signup-password").value;
      const confirmPassword = document.querySelector("#confirm-password").value;

      // password confirmation
      if (confirmPassword != signupPassword) {
        alert("Password not match. Please try again.");
        return;
      }

      // Sign up with firebase
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signupEmail,
          signupPassword
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: signupEmail,
          name,
          bio: "",
          location: "",
          role,
          createdAt: new Date(),
          availability: [],
          skills: [],
          interests: [],
        });

        // Put data in local storage
        localStorage.clear();
        localStorage.setItem("email", signupEmail);
        localStorage.setItem("name", name);
        localStorage.setItem("role", role);
        localStorage.setItem("bio","");
        localStorage.setItem("location", "");
        localStorage.setItem("availability", []);
        localStorage.setItem("skills", []);
        localStorage.setItem("interests", []);

        // alert and redirect
        alert("Sign up successful!");
        window.location.href = "profileedit.html";
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      }
    });
  }

  // Signin

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const signinEmail = document.querySelector("#signin-email").value;
      const signinPassword = document.querySelector("#signin-password").value;

      // sign in with firebase
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          signinEmail,
          signinPassword
        );

        const user = userCredential.user;

        // Retreive data from firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const data = docSnap.data();

        // Put data in local storage
        localStorage.clear();
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);

        // alert and redirect
        alert("Sign up successful!");
        window.location.href = "dashboard.html";
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      }
    });
  }
});
