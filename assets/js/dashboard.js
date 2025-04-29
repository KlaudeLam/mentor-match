import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const mentorList = document.querySelector(".card-list");
  const filterForm = document.querySelector(".filter-form");

  const createCard = (user) => {
    if (user.uid === auth.currentUser?.uid) return null;

    const card = document.createElement("div");
    card.className = "card";
    card.id = user.uid;
    card.innerHTML = `
      <img src="${user.img || "./assets/images/user.png"}" alt="${
      user.name
    }" class="card-img">
      <h3>${user.name}</h3>
      <p class="card-skills">Skills: ${(user.skills || []).join(", ")}</p>
      <p class="card-location">Location: ${user.location || "Unknown"}</p>
      <button class="add-card">Add</button>
    `;
    return card;
  };

  //   Get info from firestore
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const renderCards = (users) => {
    mentorList.innerHTML = "";
    users.forEach((user) => {
      const card = createCard(user);
      if (card) mentorList.appendChild(card);
    });
  };

  const applyFilters = async () => {
    const role = filterForm.querySelector('input[name="role"]:checked')?.value;
    const skill = filterForm
      .querySelector("#skills")
      .value.trim()
      .toLowerCase();
    const interests = filterForm
      .querySelector("#interests")
      .value.trim()
      .toLowerCase();
    const location = filterForm
      .querySelector("#location")
      .value.trim()
      .toLowerCase();
    const availability = [
      ...filterForm.querySelectorAll('input[name="availability"]:checked'),
    ].map((cb) => cb.value.toLowerCase());

    const allUsers = await fetchUsers();

    // Filter each user based on criteria
    const filtered = allUsers.filter((user) => {
      if (user.uid === auth.currentUser?.uid) return false;
      if (role && user.role !== role) return false;
      if (skill && !user.skills?.some((s) => s.toLowerCase().includes(skill)))
        return false;
      if (
        interests &&
        !user.interests?.some((i) => i.toLowerCase().includes(interests))
      )
        return false;
      if (location && !user.location?.toLowerCase().includes(location))
        return false;
      if (
        availability.length &&
        !availability.some((element) =>
          user.availability?.map((a) => a.toLowerCase()).includes(element)
        )
      )
        return false;
      return true;
    });

    renderCards(filtered);
  };

  //   if submit: filter (else: do nothing)
  filterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await applyFilters();
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const allUsers = await fetchUsers();
      renderCards(allUsers);
      applyFilters();
    }
  });
});
