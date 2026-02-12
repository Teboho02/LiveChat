export const UI = {
    renderChatList(users, containerSelector, onUserClick) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        if (!users.length) {
            container.innerHTML = '<div class="empty-state">No users found</div>';
            return;
        }

        container.innerHTML = users.map(user => {
            const statusClass = (user.status === 'online' || user.OnlineStatus === 'online') ? 'status-online' : 'status-offline';
            return `
                <div class="chatList" data-user-id="${user.userId}">
                    <img src="${user.profilePicture || '../assets/download.jpg'}" class="userImage" alt="${user.name}">
                    <div class="Contents">
                        <div class="chatHeader">
                            <div class="Name">${user.name} <span class="${statusClass}">●</span></div>
                        </div>
                        <div class="LastMessage">${user.email}</div>
                    </div>
                </div>`;
        }).join("");

        container.querySelectorAll('.chatList').forEach(item => {
            item.addEventListener('click', () => onUserClick(item.dataset.userId));
        });
    },

    renderGroupsList(groups, containerSelector, currentUser, onGroupClick, onCreateFirst) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        if (!groups.length) {
            container.innerHTML = `
                <div class="empty-state">No groups found</div>
                <div style="text-align: center; padding: 20px;">
                    <button id="createFirstGroupBtn" class="add-user-btn">Create First Group</button>
                </div>`;
            document.getElementById('createFirstGroupBtn')?.addEventListener('click', onCreateFirst);
            return;
        }

        container.innerHTML = groups.map(group => {
            const memberCount = group.members?.length || 0;
            const isMember = group.members?.some(m => m.userId === currentUser?.userId);
            return `
                <div class="chatList group-item" data-group-id="${group.groupId}">
                    <div class="group-avatar"><img src="../assets/icons/group-icon.png" class="userImage"></div>
                    <div class="Contents">
                        <div class="chatHeader">
                            <div class="Name">${group.groupName}</div>
                            <span class="member-count">${memberCount} members</span>
                        </div>
                        <div class="LastMessage">${isMember ? '✓ Member' : 'Click to join'}</div>
                    </div>
                </div>`;
        }).join("");

        container.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('click', () => onGroupClick(item.dataset.groupId));
        });
    },

    renderGroupMessages(groupId, groupsData, currentUser) {
        const group = groupsData[groupId];
        const messagesArea = document.querySelector('.messagesArea');
        if (!messagesArea || !group?.groupMessages) return;

        messagesArea.innerHTML = group.groupMessages.map(msg => {
            const isSent = msg.From === currentUser?.userId;
            return `
                <div class='message-wrapper' style="display: flex; justify-content: ${isSent ? 'flex-end' : 'flex-start'}; margin: 10px 0;">
                    <div style="max-width: 70%; background: ${isSent ? '#ddecdf' : '#dfdffc'}; padding: 10px; border-radius: 10px;">
                        ${!isSent ? `<div style="font-size: 12px; font-weight: bold; color: #555; margin-bottom: 5px;">${msg.FromName}</div>` : ''}
                        <div style="word-wrap: break-word;">${msg.message}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px; text-align: right;">
                            ${new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>`;
        }).join('');
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
};