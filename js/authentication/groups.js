

export class Groups {


    constructor(){

            this.members = [];
            this.groupMessages = [];
            this.groupId = this.generateUniqueGroupId();

    }

    generateUniqueGroupId() {

        return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }


    sendMessage(message, fromUserId){


        const newMessage = {
            id: Date.now(),
            content: message,
            fromUserId: fromUserId,
            timestamp: new Date()
        };

        this.groupMessages.push(newMessage);

        const users = JSON.parse(localStorage.getItem('Users')) || {};
        this.members.forEach(member => {
            const user = users[member.userId];  
            if (user) {
                if (!user.groupMessages) {
                    user.groupMessages = {};
                }   
                if (!user.groupMessages[this.groupId]) {
                    user.groupMessages[this.groupId] = [];
                }
                user.groupMessages[this.groupId].push(newMessage);
                users[member.userId] = user;  
            }   
        });
        localStorage.setItem('Users', JSON.stringify(users));

        return newMessage;
    }

}