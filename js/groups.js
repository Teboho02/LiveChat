import Groups from "./authentication/groups.js";

const addGroupBtn = document.getElementById("addGroupBtn");

addGroupBtn.addEventListener("click", function () {
  const groupName = prompt("Enter the name of the new group:");
  if (groupName) {
    const newGroup = new Groups(groupName);
    const groups = JSON.parse(localStorage.getItem("Groups")) || {};
    groups[newGroup.groupId] = newGroup;


    const currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
    if (currentUser) {
      newGroup.members.push({ userId: currentUser.userId, name: currentUser.name });
    }

    localStorage.setItem("Groups", JSON.stringify(groups));

    alert(`Group "${groupName}" created successfully!`);
  }
});
