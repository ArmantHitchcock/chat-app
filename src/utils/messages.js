const generateMessage = function (username1, text1) {
    return{
        username: username1,
        text: text1,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}