import { auth, db } from "./firebase.js";
import {
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Log out
export const logOut = async () => {
  try {
    await signOut(auth);
    alert("Sign out successfully")
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // toggle
  let toggle = "signup";
  const signinOpt = document.querySelector("#signin-opt");
  const signupOpt = document.querySelector("#signup-opt");

  const signupForm = document.querySelector("#signup-form");
  const signinForm = document.querySelector("#signin-form");

  // Toggle form and button
  const signupMode = () => {
    if (toggle === "signup") return;
    toggle = "signup";

    signupOpt.classList.add("active-option");
    signinOpt.classList.remove("active-option");
    signupForm.classList.remove("hidden");
    signinForm.classList.add("hidden");
  }
  const signinMode = () => {
    if (toggle === "signin") return;
    toggle = "signin";

    signinOpt.classList.add("active-option");
    signupOpt.classList.remove("active-option");
    signupForm.classList.add("hidden");
    signinForm.classList.remove("hidden");
  }

  // Sign up/in functions
  const signup = () => {
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
            "uid": user.uid,
            "email": signupEmail,
            name,
            "bio": "",
            "location": "",
            role,
            "createdAt": new Date(),
            "availability": [],
            "skills": [],
            "interests": [],
            "img": "https://res.cloudinary.com/diib6xxxh/image/upload/v1745923865/user_y2g6ig.png"
          });

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
  }
  const signin = () =>{ 
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

          // alert and redirect
          alert("Sign in successful!");
          window.location.href = "dashboard.html";
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        }
      });
    }
  }

  // Toggle form and button
  signinOpt.addEventListener("click", () => signinMode());
  signupOpt.addEventListener("click", () => signupMode());

  signup();
  signin();
});
