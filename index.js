var socket = io();
var myStream;

function ajoutVideo(stream) {
    try {
        var video = document.createElement('video');
        document.getElementById('participants').appendChild(video);
        video.autoplay = true;
        video.controls = true;
        video.srcObject = stream;
    } catch (error) {
        console.error(error);
    }
}

function register() {
    var name = document.getElementById('name').value;
    try {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(function(stream) {
            myStream = stream;
            ajoutVideo(stream);
            document.getElementById('register').style.display = 'none';
            document.getElementById('userAdd').style.display = 'block';
            document.getElementById('userShare').style.display = 'block';
            
            socket.emit('register', name);
        })
        .catch(function(err) {
            console.log('Failed to get local stream', err);
        });
    } catch (error) {
        console.error(error);
    }
}

socket.on('call', function(data) {
    var peerId = data.peerId;
    var call = socket.emit('answer', {peerId: peerId, stream: myStream});
    
    call.on('stream', function(remoteStream) {
        ajoutVideo(remoteStream);
    });
});

function appelUser() {
    try {
        var name = document.getElementById('add').value;
        document.getElementById('add').value = ""; 
        
        socket.emit('call', {name: name, stream: myStream});
    } catch (error) {
        console.error(error);
    }
}

function addScreenShare() {
    var name = document.getElementById('share').value;
    document.getElementById('share').value = "";
    
    navigator.mediaDevices.getDisplayMedia({video: {cursor: "always"}, audio: true})
    .then((stream) => {
        socket.emit('shareScreen', {name: name, stream: stream});
    });
}

