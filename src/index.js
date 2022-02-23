const express = require('express')
const Filter = require('bad-words')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const {generateMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
//const io = socketio(server)

const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000
const publicDirextoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirextoryPath))

// app.use(function (req, res, next) {
//     res.status(503).send('Site is currently under maintenance')
// })

//route handlers
// app.get("", function (req, res) {
//     res.send("caht app home page")
// })
//let varCount = 0
let varMessage = 'hello from server'


// server (emit) -> client(receive) - countUpdate
// client (emit) -> server(receive) - increment

// server (emit) -> client(receive) - acknowledgement -> server
// client (emit) -> server(receive) - acknowledgement -> client


//socket.emit,                              :  sent to a septific socket/connection
//io.emit,                                  :  sent to everyone
//socket.broadcast.emit                     :  sent to everyone except the current socket/connection
//io.to.emit, socket.broadcast.to.emit      :  sepcify a specific room/group/channel to send to
io.on('connection', (socket)=>{
    console.log('new socket connection')

    //data out________________________________________________________________________________________________________
    // socket.emit('countUpdated', generateMessage(varCount))

    //data in________________________________________________________________________________________________________
    // socket.on('increment', function () {
    //     varCount ++
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated', generateMessage(varCount)) //data out______________________
    // })

    socket.on('join', (options, callback)=> {
        console.log("socket.on join")
        // console.log(room1)
        const {error, user} = addUser({id: socket.id, ...options})
        console.log("index.js = error: " + error)
        console.log("index.js = user: " + JSON.stringify(user))

        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('messageIOFunc', generateMessage('Admin2',varMessage)) //data out______________________
        socket.broadcast.to(user.room).emit('messageIOFunc', generateMessage(`${user.username} has joined`)) //data out______________________
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })//data out______________________
        callback() //data out______________________
    })

    socket.on('sendMessage', function (msg, callback) {
        const user = getUser(socket.id)
        const filter = new Filter()
        //socket.emit('countUpdated', count)
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('messageIOFunc',generateMessage(user.username, msg)) //data out______________________
        callback('arg being pushed to client') //data out______________________
    })

    socket.on('sendGeoLoc', function (position, callback) {
        const user = getUser(socket.id)
        console.log(position)
        //socket.emit('countUpdated', count)
        io.to(user.room).emit('locationMessage', generateMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`)) //data out______________________
        callback('geoLoc sent') //data out______________________
    })

    socket.on('disconnect', function () {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('messageIOFunc', generateMessage('Admin2', `${user.username} has left`)) //data out______________________
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })//data out______________________
        }
        
    })
})

server.listen(port, function () {
    console.log("Server is running on port: " + port)
})

