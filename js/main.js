import Messages from '../js/chatService/message.js';
import * as Data from './storage.js';
import { UI } from './chatUI.js';

let allUsers = [];
let allGroups = [];
let currentTab = 'chats';


//when the application loads we get all the users and groups
function initializeApp() {
    allUsers = Data.getAllUsers();
    allGroups = Data.getAllGroups();
    
    const currentUser = Data.getCurrentUser();
    UI.renderChatList(allUsers, "#chatListContainer", openUserChat);
    
    setupEventListeners();
}

window.addEventListener('storage', (e) => {
    if (e.key === 'Users' || e.key === 'Groups') {
        refreshAppState();
    }
});

/**
 * Re-fetches data from storage and refreshes the current view
 */
function refreshAppState() {
    allUsers = Data.getAllUsers();
    allGroups = Data.getAllGroups();
    
    // Refresh the list on the left
    refreshActiveView();
    
    // Refresh the open chat window if one is active
    const sendBtn = document.getElementById('sendBtn');
    const sendGroupBtn = document.getElementById('sendGroupBtn');
    const currentUser = Data.getCurrentUser();

    if (sendBtn) {
        const otherUserId = sendBtn.getAttribute('data-user-id');
        if (otherUserId && currentUser) {
            Messages.renderMessagesStatic(currentUser.userId, otherUserId);
        }
    }

    if (sendGroupBtn) {
        const groupId = sendGroupBtn.getAttribute('data-group-id');
        if (groupId) {
            UI.renderGroupMessages(groupId, JSON.parse(localStorage.getItem('Groups')), currentUser);
        }
    }
}


function sendGroupMessage(groupId) {
    const input = document.getElementById('groupMessageInput');
    const text = input.value.trim();
    const currentUser = Data.getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('Groups')) || {};

    if (text && groups[groupId]) {
        const msg = {
            messageId: `msg_${Date.now()}`,
            message: text,
            type: 'text',
            time: new Date().toISOString(),
            From: currentUser.userId,
            FromName: currentUser.name,
            To: groupId
        };
        groups[groupId].groupMessages = (groups[groupId].groupMessages || []);
        groups[groupId].groupMessages.push(msg);
        
        Data.updateLocalStorage('Groups', groups);
        input.value = '';
        
        // TRIGGER LOCAL REFRESH
        refreshAppState(); 
    }
}

function setupEventListeners() {
    const tabs = document.querySelectorAll('.tab');
    const addGroupBtn = document.getElementById('addGroupBtn');
    const searchBar = document.querySelector('.searchBar');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            if (index === 0) {
                currentTab = 'chats';
                UI.renderChatList(allUsers, "#chatListContainer", openUserChat);
                if (addGroupBtn) addGroupBtn.style.display = 'none';
            } else {
                currentTab = 'groups';
                UI.renderGroupsList(allGroups, "#chatListContainer", Data.getCurrentUser(), openGroupChat, createNewGroup);
                if (addGroupBtn) addGroupBtn.style.display = 'block';
            }
        });
    });

    searchBar?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (currentTab === 'chats') {
            const filtered = allUsers.filter(u => u.name.toLowerCase().includes(query) || (u.email && u.email.toLowerCase().includes(query)));
            UI.renderChatList(filtered, "#chatListContainer", openUserChat);
        } else {
            const filtered = allGroups.filter(g => g.groupName.toLowerCase().includes(query));
            UI.renderGroupsList(filtered, "#chatListContainer", Data.getCurrentUser(), openGroupChat, createNewGroup);
        }
    });

    //event listener for storage changes to sync across tabs
    //enables the real time sending and receiving of messages across multiple tabs/windows of the same browser, as well as keeping the user and group lists updated in real time.
    window.addEventListener('storage', (e) => {
        if (e.key === 'Users' || e.key === 'Groups') {
            allUsers = Data.getAllUsers();
            allGroups = Data.getAllGroups();
            refreshActiveView();
        }
    });

    if (addGroupBtn) addGroupBtn.addEventListener('click', createNewGroup);
}

function openUserChat(userId) {
    const user = allUsers.find(u => u.userId === userId);
    const currentUser = Data.getCurrentUser();
    if (!user || !currentUser) return;

    const isSubscribed = currentUser.subscriptions?.includes(userId);
    const isSelf = currentUser.userId === userId;

    //check if 2 people are frinds
    let messagesHTML = `
        <div class="chatHeaderTop">
            <img src="${user.profilePicture || '../assets/download.jpg'}" class="userImageHeader">
            <div class="chatName">${user.name}${isSelf ? ' (You)' : ''}</div>
        </div>
        <div class="messagesArea">${!isSubscribed && !isSelf ? renderAddUserPlaceholder(user) : ''}</div>
        <div class="messageInputArea ${(!isSubscribed || isSelf) ? 'disabled' : ''}">
            <input type="text" class="messageInput" id="messageInput" 
                   placeholder="${isSelf ? 'You cannot message yourself' : (isSubscribed ? 'Type a message...' : 'Add user to start messaging')}" 
                   ${(!isSubscribed || isSelf) ? 'disabled' : ''}>
            <button class="sendButton" id="sendBtn" data-user-id="${userId}" ${(!isSubscribed || isSelf) ? 'disabled' : ''}>Send</button>
        </div>
    `;

    document.querySelector("#messageContainer").innerHTML = messagesHTML;

    // Attach local events
    document.getElementById('addUserBtn')?.addEventListener('click', () => addUserToSubscriptions(userId));
    document.getElementById('sendBtn')?.addEventListener('click', () => sendMessage(userId));
    document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(userId);
    });

    if (isSubscribed && !isSelf) {
        Messages.renderMessagesStatic(currentUser.userId, userId);
    }
}
function renderAddUserPlaceholder(user) {
    return `
        <div class="add-user-container">
            <img src="${user.profilePicture || '../assets/download.jpg'}" class="add-user-avatar">
            <h3 class="add-user-name">${user.name}</h3>
            <button id="addUserBtn" class="add-user-btn">Add User</button>
        </div>`;
}
function sendMessage(userId) {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    const currentUser = Data.getCurrentUser();

    if (!text || !currentUser) return;

    const newMessage = new Messages(text, 'text', new Date().toISOString(), currentUser.userId, userId);
    if (newMessage.sendMessage().status === 'success') {
        input.value = '';
        Messages.renderMessagesStatic(currentUser.userId, userId);
    }
}
function addUserToSubscriptions(userId) {
    const currentUser = Data.getCurrentUser();
    if (!currentUser) return;

    // Add to current user
    if (!currentUser.subscriptions) currentUser.subscriptions = [];
    if (!currentUser.subscriptions.includes(userId)) {
        currentUser.subscriptions.push(userId);
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        Data.updateUserInStorage(currentUser);
    }
    // Add current user to the other user's list (Mutual Subscription logic)
    const users = JSON.parse(localStorage.getItem('Users')) || {};
    const otherUser = users[userId];
    if (otherUser) {
        if (!otherUser.subscriptions) otherUser.subscriptions = [];
        if (!otherUser.subscriptions.includes(currentUser.userId)) {
            otherUser.subscriptions.push(currentUser.userId);
            Data.updateUserInStorage(otherUser);
        }
    }
    openUserChat(userId);
}
// Group chat Logic
function openGroupChat(groupId) {
    const group = allGroups.find(g => g.groupId === groupId);
    const currentUser = Data.getCurrentUser();
    if (!group) return;

    const isMember = group.members?.some(m => m.userId === currentUser?.userId);

    let messagesHTML = `
        <div class="chatHeaderTop">
            <img src="../assets/icons/group-icon.png" class="userImageHeader">
            <div class="chatName">${group.groupName}</div>
            <div class="member-count-header">👥 ${group.members?.length || 0} members</div>
        </div>
        <div class="messagesArea"></div>
        <div class="messageInputArea ${!isMember ? 'disabled' : ''}">
            <input type="text" class="messageInput" id="groupMessageInput" placeholder="${isMember ? 'Type a group message...' : 'Join group to chat'}" ${!isMember ? 'disabled' : ''}>
            <button class="sendButton" id="sendGroupBtn" ${!isMember ? 'disabled' : ''}>Send</button>
        </div>
    `;

    document.querySelector("#messageContainer").innerHTML = messagesHTML;

    if (!isMember) {
        const area = document.querySelector('.messagesArea');
        area.innerHTML = `<div class="add-user-container">
            <button id="joinGroupBtn" class="add-user-btn">Join Group</button>
        </div>`;
        document.getElementById('joinGroupBtn').onclick = () => joinGroup(groupId);
    } else {
        UI.renderGroupMessages(groupId, JSON.parse(localStorage.getItem('Groups')), currentUser);
        document.getElementById('sendGroupBtn').onclick = () => sendGroupMessage(groupId);
        document.getElementById('groupMessageInput').onkeypress = (e) => {
            if (e.key === 'Enter') sendGroupMessage(groupId);
        };
    }
}
function joinGroup(groupId) {
    const currentUser = Data.getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('Groups')) || {};
    const group = groups[groupId];
    //first checks if im not in a group.
    if (group && currentUser && !group.members.some(m => m.userId === currentUser.userId)) {
        group.members.push({ userId: currentUser.userId, name: currentUser.name });
        Data.updateLocalStorage('Groups', groups);
        //refreshes the pages and allows updates to show. 
        allGroups = Data.getAllGroups();
        openGroupChat(groupId);
    }
}

function createNewGroup() {
    const name = prompt('Enter group name:');
    
    const currentUser = Data.getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('Groups')) || {};
    const groupId = `group_${Date.now()}`;

    groups[groupId] = {
        groupId,
        groupName: name.trim(),
        members: [{ userId: currentUser.userId, name: currentUser.name }],
        groupMessages: []
    };

    Data.updateLocalStorage('Groups', groups);
    allGroups = Data.getAllGroups();
    refreshActiveView();
    openGroupChat(groupId);
}

function refreshActiveView() {
    if (currentTab === 'chats') UI.renderChatList(allUsers, "#chatListContainer", openUserChat);
    else UI.renderGroupsList(allGroups, "#chatListContainer", Data.getCurrentUser(), openGroupChat, createNewGroup);
}
window.openUserChat = openUserChat;
window.openGroupChat = openGroupChat;
document.addEventListener('DOMContentLoaded', initializeApp);
