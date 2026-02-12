import { ProfileFunctions } from "./profile/profileFunctions.js";

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  let originalValues = {};

  if (!currentUser) {
    window.location.href = "../pages/login.html";
    return;
  }

  const editBtn = document.getElementById("editBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const profileForm = document.getElementById("profileForm");
  const formActions = document.querySelector(".formActions");

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const avatarImg = document.getElementById("avatarImg");

  // Load current user data
  loadUserData();

  function loadUserData() {
    const users = JSON.parse(localStorage.getItem("Users"));
    if (users && users[currentUser.userId]) {
      const userData = users[currentUser.userId];

      fullNameInput.value = userData.name || "";
      emailInput.value = userData.email || "";
      passwordInput.value = "••••••••";

      // Load profile picture if exists
      if (userData.profilePicture) {
        avatarImg.src = userData.profilePicture;
      }

      // Store original values
      originalValues = {
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture,
      };
    }
  }

  // Edit button - enable form fields
  editBtn.addEventListener("click", function () {
    fullNameInput.removeAttribute("readonly");
    passwordInput.removeAttribute("readonly");
    passwordInput.value = "";
    passwordInput.placeholder = "Enter new password (optional)";

    formActions.style.display = "flex";
    editBtn.style.display = "none";
  });

  // Cancel button - disable form and restore original values
  cancelBtn.addEventListener("click", function () {
    fullNameInput.setAttribute("readonly", true);
    passwordInput.setAttribute("readonly", true);

    // Restore original values
    fullNameInput.value = originalValues.name;
    passwordInput.value = "••••••••";

    formActions.style.display = "none";
    editBtn.style.display = "block";
  });

  // Save button - submit form
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newName = fullNameInput.value.trim();
    const newPassword = passwordInput.value.trim();

    // Validate name
    if (!newName) {
      alert("Name cannot be empty");
      return;
    }

    // Update name
    ProfileFunctions.updateName(newName, currentUser.userId);

    // Update password if provided
    if (newPassword && newPassword !== "") {
      ProfileFunctions.updatePassword(
        newPassword,
        currentUser.userId,
        emailInput.value,
      );
    }

    // Update session storage with new name
    currentUser.name = newName;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update original values
    originalValues.name = newName;

    // Reset form to readonly state
    fullNameInput.setAttribute("readonly", true);
    passwordInput.setAttribute("readonly", true);
    passwordInput.value = "••••••••";

    formActions.style.display = "none";
    editBtn.style.display = "block";

    alert("Profile updated successfully!");
  });

  // Logout button
  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("currentUser");
    window.location.href = "../pages/sign-in.html";
  });
});
