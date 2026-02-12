export function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

export function getAllUsers() {
    const users = JSON.parse(localStorage.getItem('Users')) || {};
    return Object.values(users);
}

export function getAllGroups() {
    const groups = JSON.parse(localStorage.getItem('Groups')) || {};
    return Object.values(groups);
}

export function getGroupsRaw() {
    return JSON.parse(localStorage.getItem('Groups')) || {};
}

export function saveGroups(groups) {
    localStorage.setItem('Groups', JSON.stringify(groups));
}

export function updateLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function updateUserInStorage(updatedUser) {
    const users = JSON.parse(localStorage.getItem('Users')) || {};
    if (updatedUser.userId) {
        users[updatedUser.userId] = updatedUser;
        localStorage.setItem('Users', JSON.stringify(users));
    }
}