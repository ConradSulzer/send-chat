const generateMessage = (message, username='Admin') => {
    return{
        username,
        message,
        createdAt: new Date().getTime()
    }
};

const generateLocationMessage = (username, link) => {
    return {
        username,
        link,
        createdAt: new Date().getTime()
    }
};

module.exports = {
    generateMessage,
    generateLocationMessage
}