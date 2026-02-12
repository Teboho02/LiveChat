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
      text: "Hey Flippy! Wrtie me a script for building an Analog Clock.",
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

// Render chat list
function renderChatList() {
  const chatListHTML = chats
    .map((chat, index) => {
      if (chat.isGroup) {
        return `
                        <div class="chatList" onclick="openChat(${index})">
                            <div class="groupImages">
                                <img src="${chat.image}" class="groupImage" alt="User">
                                <img src="${chat.image}" class="groupImage" alt="User">
                                <img src="${chat.image}" class="groupImage" alt="User">
                                <div class="moreCount">+${chat.members - 3}</div>
                            </div>
                            <div class="Contents">
                                <div class="chatHeader">
                                    <div class="Name">${chat.name}</div>
                                </div>
                            </div>
                        </div>
                    `;
      }
      return `
                    <div class="chatList" onclick="openChat(${index})">
                        <img src="${chat.image}" class="userImage" alt="${chat.name}">
                        <div class="Contents">
                            <div class="chatHeader">
                                <div class="Name">${chat.name}</div>
                                ${chat.time ? `<div class="Time">${chat.time}</div>` : ""}
                            </div>
                            ${chat.lastMessage ? `<div class="LastMessage">${chat.lastMessage}</div>` : ""}
                        </div>
                    </div>
                `;
    })
    .join("");

  document.querySelector("#chatListContainer").innerHTML = chatListHTML;
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

renderChatList();
openChat(0); // Open first chat by default
