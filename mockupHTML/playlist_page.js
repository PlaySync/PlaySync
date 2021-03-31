// update the button text based on the chosen platform
function updateButton(src, platform) {
    if (src == "source") {
        document.getElementById("sourceTransferButton").innerHTML = platform;
    } else if (src == "dest") {
        document.getElementById("destinationTransferButton").innerHTML = platform;
    } else {
        console.log("Error");
    }
}

function displayPlaylists(platform) { // platform will identify whether to call data from youtube/spotify/etc


    // remove all playlists from a previous platform, if there are any
    var playlistBox = document.getElementById("playlist-box");
    while (playlistBox.firstChild) {
        playlistBox.removeChild(playlistBox.firstChild);
    }

    // call the given platform's taskers to get the playlist information
    $.ajax({
        url: '/show_playlist',
        type: 'GET',
        data: {
            self: ''
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
            for (var i = 0; i < data.size; i++) {
                $('#playlist-box').append('<div class="playlist-item"><button class="playselect-button" onclick="displaySongs(' + i + ')" id="playlist' + data[i].id + '"></button><p class="pt-2 pl-2">' + data[i].title + '</p></div>');
            }
        },
        error: function(err) {
            console.log(err);
        }
    })
}

// NOTE: function needs to be updated. parameters have been changed
function displaySongs(platform, playlistNum) {
    // update the button for which playlist is selected
    var btn = document.getElementById("playlist" + playlistNum);
    var numPlaylists = document.getElementById("playlist-box").childElementCount;
    if (numPlaylists != 0) {
        for (i = 0; i < numPlaylists; i++) {
            document.getElementById("playlist" + i).classList.remove("psb-clicked");
        }
        btn.classList.add("psb-clicked");
    }

    // remove all songs from a previous playlist, if there are any
    var songBox = document.getElementById("status-box");
    while (songBox.firstChild) {
        songBox.removeChild(songBox.firstChild);
    }

    // call the given platform's taskers to get the song information
    $.ajax({
        url: '/show_song_in_playlist',
        type: 'GET',
        data: {
            self: '',
            playlist_id: ''
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
            for (var i = 0; i < data.size; i++) {
                $('#status-box').append('<div class="status-item"></div>');
            }
        },
        error: function(err) {
            console.log(err);
        }
    })
}

function confirm() {
    // function will call the next api taskers to start making the new playlist

    // check to make sure the playlist and status boxes are not empty
    if (!document.getElementById("playlist-box").firstElementChild || !document.getElementById("status-box").firstElementChild) {
        console.log("error");
    } else {
        console.log("confirm");
    }
}