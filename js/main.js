import Messages from '../js/chatService/message.js'

function getAllUsers() {
    const users = JSON.parse(localStorage.getItem('Users')) || {};
    // Convert object to array of user objects
    const usersArray = Object.values(users);
    return usersArray;
}

// Add to your initialization section
window.addEventListener('storage', function(e) {
    if (e.key === 'Users') {
        console.log('Storage event detected for Users key:', e);
        
        // Update current user from localStorage
        const currentUser = getCurrentUser();
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('Users')) || {};
            const updatedCurrentUser = users[currentUser.userId];
            if (updatedCurrentUser) {
                sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
            }
        }
        
        // Refresh the current chat if open
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            const otherUserId = sendBtn.getAttribute('data-user-id');
            if (otherUserId && currentUser) {
                Messages.renderMessagesStatic(currentUser.userId, otherUserId);
            }
        }
        
        // Refresh user list
        allUsers = getAllUsers();
        renderChatList(allUsers);
    }
});

// Get current logged-in user
function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Update user in localStorage
function updateUserInStorage(updatedUser) {
    const users = JSON.parse(localStorage.getItem('Users')) || {};
    
    // Update user directly using userId as key
    if (updatedUser.userId) {
        users[updatedUser.userId] = updatedUser;
        localStorage.setItem('Users', JSON.stringify(users));
    }
}

// Check if user is in subscriptions
function isUserSubscribed(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.subscriptions) return false;
    return currentUser.subscriptions.includes(userId);
}

// Add user to subscriptions (mutual subscription)
function addUserToSubscriptions(userId) {
    const currentUser = getCurrentUser();

    if (!currentUser) return;
    
    // Add to current user's subscriptions
    if (!currentUser.subscriptions.includes(userId)) {
        currentUser.subscriptions.push(userId);
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInStorage(currentUser);
    }
    
    // Add current user to the other user's subscriptions
    const users = JSON.parse(localStorage.getItem('Users')) || {};
    const otherUser = users[userId]; // Direct access by userId!
    
    if (otherUser) {
        if (!otherUser.subscriptions) {
            otherUser.subscriptions = [];
        }
        if (!otherUser.subscriptions.includes(currentUser.userId)) {
            otherUser.subscriptions.push(currentUser.userId);
            updateUserInStorage(otherUser);
        }
    }
    
    // Refresh the chat view
    openUserChat(userId);
}

// Store all users for search
let allUsers = [];
let currentUser = null;

// Initialize users on page load
function initializeUsers() {
    currentUser = getCurrentUser();
    allUsers = getAllUsers();
    // Show ALL users including yourself
    renderChatList(allUsers);
}

// Search functionality
function searchUsers(query) {
    if (!query.trim()) {
        renderChatList(allUsers);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );
    
    renderChatList(filteredUsers);
}

// Render chat list - UPDATED VERSION
function renderChatList(usersToDisplay = allUsers) {
    if (!usersToDisplay || usersToDisplay.length === 0) {
        document.querySelector("#chatListContainer").innerHTML = '<div class="empty-state">No users found</div>';
        return;
    }
    
    const chatListHTML = usersToDisplay
        .map((user, index) => {
            // Show online/offline status
            const statusClass = user.status === 'online' || user.OnlineStatus === 'online' 
                ? 'status-online' 
                : 'status-offline';
            
            return `
                <div class="chatList" data-user-id="${user.userId}">
                    <img src="${user.profilePicture || '../assets/download.jpg'}" class="userImage" alt="${user.name}">
                    <div class="Contents">
                        <div class="chatHeader">
                            <div class="Name">${user.name} <span class="${statusClass}">●</span></div>
                        </div>
                        <div class="LastMessage">${user.email}</div>
                    </div>
                </div>
            `;
        })
        .join("");

    document.querySelector("#chatListContainer").innerHTML = chatListHTML;
    
    // Add click event listeners to all chat items
    document.querySelectorAll('.chatList').forEach(chatItem => {
        chatItem.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            openUserChat(userId);
        });
    });
}

function openUserChat(userId) {
    const user = allUsers.find(u => u.userId === userId);
    if (!user) {
        console.error('User not found:', userId);
        return;
    }

    const isSubscribed = isUserSubscribed(userId);
    const currentUser = getCurrentUser();
    const isSelf = currentUser && currentUser.userId === userId;

    let messagesHTML = `
        <div class="chatHeaderTop">
            <img src="${user.profilePicture || '../assets/download.jpg'}" class="userImageHeader" alt="${user.name}">
            <div class="chatName">${user.name}${isSelf ? ' (You)' : ''}</div>
        </div>
    `;

    if (!isSubscribed) {
        // Not added yet – show "Add User" button and disabled input
        messagesHTML += `
        <div class="messagesArea">
            <div class="add-user-container">
                <img src="${user.profilePicture || '../assets/download.jpg'}" 
                    class="add-user-avatar" 
                    alt="${user.name}">
                <h3 class="add-user-name">${user.name}</h3>
                <p class="add-user-email">${user.email}</p>
                <button id="addUserBtn" data-user-id="${userId}" class="add-user-btn">
                    Add User
                </button>
            </div>
        </div>
        <div class="messageInputArea disabled">
            <input type="text" class="messageInput" placeholder="Add user to start messaging..." disabled>
            <button class="sendButton" disabled>Send</button>
        </div>
        `;
    } else {
        // Subscribed – show empty messages container and active input
        messagesHTML += `
        <div class="messagesArea"></div>
        <div class="messageInputArea">
            <input type="text" class="messageInput" placeholder="Type a message..." id="messageInput">
            <button class="sendButton" id="sendBtn" data-user-id="${userId}">Send</button>
        </div>
        `;
    }

    document.querySelector("#messageContainer").innerHTML = messagesHTML;

    // Attach event listeners
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            addUserToSubscriptions(this.getAttribute('data-user-id'));
        });
    }

    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            sendMessage(this.getAttribute('data-user-id'));
        });
    }

    // ✅ Render existing messages if subscribed and not self
    if (isSubscribed && !isSelf) {
        Messages.renderMessagesStatic(currentUser.userId, userId);
    }
}

// Placeholder for sending messages
// Updated sendMessage function
function sendMessage(userId) {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No current user found');
        return;
    }
    
    // Create and send message
    const newMessage = new Messages(
        message,
        'text',
        new Date().toISOString(),
        currentUser.userId,
        userId
    );
    
    const result = newMessage.sendMessage();
    
    if (result.status === 'success') {
        input.value = '';
    } else {
        console.error('Failed to send message:', result.message);
    }
}

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeUsers();
        
        const searchBar = document.querySelector('.searchBar');
        if (searchBar) {
            searchBar.addEventListener('input', function(e) {
                searchUsers(e.target.value);
            });
        }
    });
} else {
    // DOM already loaded
    initializeUsers();
    
    const searchBar = document.querySelector('.searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            searchUsers(e.target.value);
        });
    }
}

// Make functions available globally for compatibility
window.openUserChat = openUserChat;
window.addUserToSubscriptions = addUserToSubscriptions;
window.sendMessage = sendMessage;   