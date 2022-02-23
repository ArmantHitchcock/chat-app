const { addAbortSignal } = require("stream")

const users = []

// add user___________________________________________________________________________________________________________________
const addUser = function ({id, username, room}) {
    //clean data
        //console.log(username)
        //console.log(typeof username)
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //validation
    if (!username || !room) {
        return {
            error: 'Username and room is required!'
        }
    }
    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    //validate username in room
    if (existingUser) {
        return {
            error: 'Username is in use in that room!, please pick another username or a different room'
        }
    }
    //store user
    const user = {id, username, room}
    console.log("users.js=saving new user: " + JSON.stringify(user))
    users.push(user)
    return { user }
}
//remove user___________________________________________________________________________________________________________________
const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
//get user___________________________________________________________________________________________________________________
const getUser = function (id) {
    return users.find(function (user) {
       return user.id === id
    })
}
//get users___________________________________________________________________________________________________________________
const getUsersInRoom = function (room) {
    room = room.trim().toLowerCase()
    return users.filter(function (user) {
        return user.room === room
    })
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom}

// addUser({
//     id:1,
//     username: "a",
//     room: "a"
// })
// addUser({
//     id:2,
//     username: "b",
//     room: "ab"
// })
// addUser({
//     id:3,
//     username: "c",
//     room: "ab"
// })
// const res = addUser({
//     id:1,
//     username: "a",
//     room: "a"
// })
// console.log(res)
// console.log("users:")
// console.log(users)
// console.log("find user:")
// const foundUser = getUser(1)
// console.log(foundUser)
// console.log("find users in room:")
// const usersInRoom = getUsersInRoom('ab')
// console.log(usersInRoom)
// console.log("removed user:")
// const removedUser = removeUser(1)
// console.log(removedUser)
// console.log("users:")
// console.log(users)