const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $incrementButton = document.querySelector('#increment')
const $geoLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemp = document.querySelector('#message-temp').innerHTML
const locationMessageTemp = document.querySelector('#location-message-temp').innerHTML
const sidebarTemp = document.querySelector('#sidebar-temp').innerHTML

//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})
const autoscroll = function () {
    // get new message element
    const $newMessage = $messages.lastElementChild

    // get height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //get the visiable height
    const visibleHeight = $messages.offsetHeight

    //get height of messages container
    const containerHeight = $messages.scrollHeight

    //get how far has user scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

console.log("from browser chat.js")
console.log(username)
console.log(room)
console.log(location.search)

socket.emit('join', {username, room}, function (error) {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
// const options = location.search.split("=");
// const username = options[1].split("&")[0];
// const room = options[2];

socket.on('messageIOFunc', (message1)=>{
    console.log('The message is:', message1)
    const html = Mustache.render(messageTemp, {
        username: message1.username,
        message:message1.text,
        createdAt: moment(message1.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message1)=>{
    console.log('The message is:', message1)
    const html = Mustache.render(locationMessageTemp, {
        username: message1.username,
        locUrl:message1.text,
        createdAt: moment(message1.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', function({room, users}){
    const html = Mustache.render(sidebarTemp, {room, users})
    document.querySelector('#sidebar').innerHTML = html
})

// socket.on('countUpdated', (count)=>{
//     console.log('The count has been updated', count)
// })

$incrementButton.addEventListener('click', function () {
    console.log('Clicked')
    socket.emit('increment')
})

$messageForm.addEventListener('submit', function (e) {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    console.log('submitted')
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, function (Arg) {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log('the message was delivered', Arg)
    })
})

$geoLocationButton.addEventListener('click', function () {
    console.log('geo button Clicked')
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser')
    }
    $geoLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position)
        socket.emit('sendGeoLoc', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            $geoLocationButton.removeAttribute('disabled')
            console.log('loc shared')
        })
    })
})



