const generateMessage = (message, username='Admin') => {
    return{
        username,
        message,
        createdAt: new Date().getTime()
    }
};

const generateLocationMessage = (link, username='Admin') => {
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