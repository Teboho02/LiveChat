function getAllUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Parse each stringified user object
    return users.map(user => JSON.parse(user));
}

const chats = [
  {
    image: "../assets/download.jpg",
    name: "Nthabiseng",
    lastMessage: "Long time no seen. How have you been?",
    time: "",
  },
];

// Mock conversation data
const mockConversation = {
  name: "Nthabiseng",
  image: "../assets/download.jpg",
  messages: [
    {
      text: "Hey Flippy! Write me a script for building an Analog Clock.",
      sent: false,
      time: "19:01",
    },
    {
      text: "Hey Flippy! Write me a script for building an Analog Clock.",
      sent: true,
      time: "19:01",
    },
    {
      text: "Hey Flippy! Write me a script for building an Analog Clock.",
      sent: false,
      time: "19:01",
    },
    {
      text: "Hey Flippy! Write me a script for building an Analog Clock.",
      sent: true,
      time: "19:01",
    },
    {
      text: "Hey Flippy! Write me a script for building an Analog Clock.",
      sent: false,
      time: "19:01",
    },
  ],
};

// Store all users for search
let allUsers = [];

// Initialize users on page load
function initializeUsers() {
    allUsers = getAllUsers();
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

// Render chat list
function renderChatList(usersToDisplay = allUsers) {
  const chatListHTML = usersToDisplay
    .map((user, index) => {
      return `
        <div class="chatList" onclick="openChat(${index})">
            <img src="${user.profilePicture || '../assets/download.jpg'}" class="userImage" alt="${user.name}">
            <div class="Contents">
                <div class="chatHeader">
                    <div class="Name">${user.name}</div>
                </div>
                <div class="LastMessage">${user.email}</div>
            </div>
        </div>
      `;
    })
    .join("");

  document.querySelector("#chatListContainer").innerHTML = chatListHTML || '<div style="padding: 20px; text-align: center; color: #666;">No users found</div>';
}

// Open chat and show messages
function openChat(index) {
  const chat = chats[index];

  const messagesHTML = `
    <div class="chatHeaderTop">
        <img src="${mockConversation.image}" class="userImageHeader" alt="${mockConversation.name}">
        <div class="chatName">${mockConversation.name}</div>
    </div>

    <div class="messagesArea">
        ${mockConversation.messages
          .map(
            (msg) => `
            <div class="messageWrapper ${msg.sent ? "sent" : "received"}">
                ${!msg.sent ? `<img src="${mockConversation.image}" class="messageUserImage" alt="User">` : ""}
                <div class="messageBubble ${msg.sent ? "sentBubble" : "receivedBubble"}">
                    <div class="messageText">${msg.text}</div>
                    <div class="messageTime">${msg.time}</div>
                </div>
                ${msg.sent ? `<img src="${mockConversation.image}" class="messageUserImage" alt="User">` : ""}
            </div>
        `,
          )
          .join("")}
    </div>

    <div class="messageInputArea">
        <input type="text" class="messageInput" placeholder="">
        <button class="sendButton">
    
        </button>
    </div>
  `;

  document.querySelector("#messageContainer").innerHTML = messagesHTML;
}

// Initialize on page load
initializeUsers();
openChat(0); // Open first chat by default

// Add event listener to search bar
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            searchUsers(e.target.value);
        });
    }
});