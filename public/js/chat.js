const socket = io();

//Elements
const $messageForm = document.getElementById('message-form');
const $messageFormInput = document.getElementById('message-input');
const $messageFormButton = document.getElementById('submit-button');
const $sendLocationButton = document.getElementById('send-location');
const $messages = document.getElementById('messages');

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationTemplate = document.getElementById('location-link').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //New message
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //Visible Height
    const visibleHeight = $messages.offsetHeight;

    //Height of message container
    const containerHeight = $messages.scrollHeight;

    //How far has user scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    //Was the user indeed at the bottom when the new message was sent
    if(containerHeight - newMessageHeight <= scrollOffset) {
        //Scrolls to the bottom aka continuous scroll
        $messages.scrollTop = $messages.scrollHeight;
    }  
};

socket.on('newMessage', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.message,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationLink', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        link: message.link,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });

    document.getElementById('sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', $messageFormInput.value, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error) {
            return console.log(error);
        }

        console.log('Message delivered!')
    });
});

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        alert('Sorry no support for location!');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => { 

        userLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        } 
        
        socket.emit('sendLocation', userLocation, (ack) => {
            $sendLocationButton.removeAttribute('disabled');
            console.log(ack);
        });
    }); 
});

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
});