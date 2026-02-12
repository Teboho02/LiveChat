export default class Messages {
    //from and to uses userId
    constructor(message, type, time, From, To) {
        this.message = message;
        this.type = type;
        this.time = time;
        this.From = From;
        this.To = To;
        this.messageId = this.generateMessageId();
    }

    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36)}`;
    }

    sendMessage() {
        // Get all users from localStorage
        const users = JSON.parse(localStorage.getItem('Users')) || {};
        

        // Get sender and recipient
        const sender = users[this.From];
        const recipient = users[this.To];
        
        const messageObj = {
            messageId: this.messageId,
            message: this.message,
            type: this.type,
            time: this.time,
            From: this.From,
            To: this.To
        };

        // Initialize messages arrays if they don't exist
        if (!sender.messages) sender.messages = [];
        if (!recipient.messages) recipient.messages = [];

        sender.messages.push(messageObj);
        recipient.messages.push(messageObj);

        users[this.From] = sender;
        users[this.To] = recipient;
        localStorage.setItem('Users', JSON.stringify(users));



        // Update current user in sessionStorage if they're the sender
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.userId === this.From) {
            currentUser.messages = sender.messages;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        // Update chat interface in real-time
        this.updateChatInterface();

        return { status: 'success', message: 'Message sent successfully' };
    }

    updateChatInterface() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;

        // Check if we're currently viewing this chat
        const activeChat = document.querySelector('.messagesArea');
        if (!activeChat) return;

        // Get the userId of the person we're chatting with
        const sendBtn = document.getElementById('sendBtn');
        const otherUserId = sendBtn ? sendBtn.getAttribute('data-user-id') : null;

        // Only update if we're viewing the relevant chat
        if (otherUserId === this.To || otherUserId === this.From) {
            this.renderMessages(currentUser.userId, otherUserId);
        }
    }

    renderMessages(currentUserId, otherUserId) {
        const users = JSON.parse(localStorage.getItem('Users')) || {};
        const currentUser = users[currentUserId];
        
        if (!currentUser || !currentUser.messages) return;

        // Filter messages between current user and other user
        const chatMessages = currentUser.messages.filter(msg => 
            (msg.From === currentUserId && msg.To === otherUserId) ||
            (msg.From === otherUserId && msg.To === currentUserId)
        );

        // Sort by time
        chatMessages.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Render messages
        const messagesArea = document.querySelector('.messagesArea');
        if (!messagesArea) return;

        const messagesHTML = chatMessages.map(msg => {
            const isSent = msg.From === currentUserId;
            const backroundColor = isSent ? '#ddecdf' : '#dfdffc';
            

            //if message is sent by current user, align to right, else align to left
            return `
                <div class='test' style="display: flex; justify-content: ${isSent ? 'flex-end' : 'flex-start'}; margin: 10px 0;">
                    <div style="max-width: 70%; background: ${backroundColor}; padding: 10px; border-radius: 10px;">
                        <div style="word-wrap: break-word;">${msg.message}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px; text-align: right;">
                            ${new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        messagesArea.innerHTML = messagesHTML || `
            <div style="padding: 20px; text-align: center; color: #666;">
                No messages yet
            </div>
        `;

    }

      static renderMessagesStatic(currentUserId, otherUserId) {
        const messages = new Messages('', '', '', '', '');
        messages.renderMessages(currentUserId, otherUserId);
    }


    // Static method to get messages between two users
    static getMessagesBetween(userId1, userId2) {
        const users = JSON.parse(localStorage.getItem('Users')) || {};
        const user = users[userId1];
        
        if (!user || !user.messages) return [];

        return user.messages.filter(msg => 
            (msg.From === userId1 && msg.To === userId2) ||
            (msg.From === userId2 && msg.To === userId1)
        ).sort((a, b) => new Date(a.time) - new Date(b.time));
    }   
}