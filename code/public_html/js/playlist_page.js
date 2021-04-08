var playlists = [{title: "Playlist One", id: "abcd", thumbnail: "N/A"},
                {title: "Playlist Two", id: "efgh", thumbnail: "N/A"},
                {title: "Playlist Three", id: "ijkl", thumbnail: "N/A"}];

var songOne = [{title: "Song One", artist: "Artist One", album: "Album One"},
                {title: "Song Two", artist: "Artist Two", album: "Album Two"},
                {title: "Song Threee", artist: "Artist Three", album: "Album Three"}];


// get the users cookie
function getUserID() {
    var id = document.cookie;
    if (id != '') {
        var value = id.split('=');
        id = value[1];
    }
    return id;
}

// get all of the songs from the given ID
function getSongs(playlistID) {
    var songList = [];
    var table = document.getElementById("songTable");
    for (var row = 0; row < table.rows.length; row++) {
        if (table.rows[row].cells[0].id == 'song-title') {
            songList.push(table.rows[row].cells[0].innerHTML);
        }
    }
    return songList;
}


// update the button text based on the chosen platform
function updateButton(src, platform) {
    if (src == "source") {
        document.getElementById("sourceTransferButton").innerHTML = platform;
        displayPlaylists(platform);
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

    var user = getUserID();
    //if (user != '') {
        // call the given platform's taskers to get the playlist information
        if (platform == "Spotify") {
            console.log("Spotify Taskers not implemented.");
        } else if (platform == "YoutubeMusic") {
            var yMusic = "'YoutubeMusic'";
            for (var i = 0; i < playlists.length; i++) {
                var playid = "'" + playlists[i].id + "'";
                $('#playlist-box').append('<div class="playlist-item"><button class="playselect-button" onclick="displaySongs(' + yMusic + ', ' + playid + ')" id="' + playlists[i].id + '"></button><p class="pt-2 pl-2">' + playlists[i].title + '</p></div>');
            }
            $.ajax({
                url: `https://playsync.me/youtube/user=${user}&op=playlist`,
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    data.forEach(function(info) {
                        $('#playlist-box').append('<div class="playlist-item"><button class="playselect-button" onclick="displaySongs(YoutubeMusic, ' + info.id + ')" id="' + info.id + '"></button><p class="pt-2 pl-2">' + info.title + '</p></div>');
                    });
                },
                error: function(err) {
                    console.log("There was an error:", err);
                }
            })
        } else { // plat3
            console.log("Not implemented.");
        }
    //} else {
        //console.log("User not found.");
    //}
}

// NOTE: function needs to be updated. parameters have been changed
function displaySongs(platform, playlistID) {
    // update the button for which playlist is selected
    var btn = document.getElementById(playlistID);
    var numPlaylists = document.getElementById("playlist-box").childElementCount;
    if (numPlaylists != 0) {
        for (var i = 0; i < numPlaylists; i++) {
            document.getElementById("playlist-box").children[i].children[0].classList.remove("psb-clicked");
        }
        btn.classList.add("psb-clicked");
    }

    // remove all songs from a previous playlist, if there are any
    var songBox = document.getElementById("status-box");
    while (songBox.firstChild) {
        songBox.removeChild(songBox.firstChild);
    }

    var user = getUserID();
    //if (user != '') {
        // call the given platform's taskers to get the song information
        if (platform == "Spofity") {
            console.log("Spotify unfinished");
        } else if (platform == "YoutubeMusic") {
            var songs = '<table id="songTable">';
            for (var i = 0; i < songOne.length; i++) {
                //var playid = "'" + playlists[i].id + "'";
                songs += '<tr><td style="text-align: left;" id="song-title">' + songOne[i].title + '</td><td style="text-align: left;">' + songOne[i].artist + '</td><td style="text-align: left;">' + songOne[i].album + '</td></tr>';
            }
            songs += '</table>';
            $('#status-box').append(songs);
            $.ajax({
                url: `https://playsync.me/youtube/user=${user}&op=songlist&playlistid=${playlistID}`,
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    data.forEach(function(item) {
                        $('#status-box').append('<div class="status-item"><p id="song-title">' + item.title + '</p><p>' + item.artist + '</p><p>' + item.album + '</p></div>');
                    });
                },
                error: function(err) {
                    console.log("There was an error:", err);
                }
            })
        } else { // plat 3
            console.log("Not implemented.");
        }
    //} else {
    //    console.log("User not found.");
    //}
}

function confirm() {
    // function will call the next api taskers to start making the new playlist

    var platformOne = document.getElementById("sourceTransferButton").innerHTML;
    var platformTwo = document.getElementById("destinationTransferButton").innerHTML;

    if (String(platformOne) != "Platform 1" && String(platformTwo) != "Platform 2") { // check both buttons have selected a platform
        // check to make sure the playlist and status boxes are not empty
        if (!document.getElementById("playlist-box").firstElementChild || !document.getElementById("status-box").firstElementChild) {
            console.log("Playlists and Songs must exist.");
        } else {
            console.log("confirm");

            var playlistBox = document.getElementById("playlist-box").children;
            var numPlaylists = document.getElementById("playlist-box").childElementCount;
            var playID = '';
            for (var i = 0; i < numPlaylists; i++) {
                if (playlistBox[i].children[0].classList.contains("psb-clicked")) {
                    playID = playlistBox[i].children[0].id;
                }
            }

            var sourceSongs = getSongs(playID);
            var user = getUserID();
            //if (sourceSongs.length != 0) {

            //}

            if (platformOne == "Spotify") {
                console.log("Sptofiy not implemented");
                if (platformTwo == "Spotify") {
                    console.log("Spotify not implemented");
                } 
                
                else if (platformTwo == "YoutubeMusic") {
                    // DONT FORGET TO MAKE THE USER CALL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    var desc = "A brand new playlist using PlaySync."
                    $.ajax({
                        url: `https://playsync.me/youtube/user=${user}&op=newlist&name=Placeholder&desc=${desc}&access=PRIVATE`,
                        type: 'POST',
                        dataType: 'json',
                        success: function(data) {
                            console.log(data);
                            for (var i = 0; i < sourceSongs.length; i++) {
                                $.ajax({
                                    url: `https://playsync.me/youtube/user=${user}&op=addsong&tracks=${sourceSongs[i]}`,
                                    type: 'POST',
                                    dataType: 'json',
                                    success: function(data) {
                                        console.log(data);
                                    },
                                    error: function(err) {
                                        console.log("There was an error:", err);
                                    }
                                })
                            }
                        },
                        error: function(err) {
                            console.log("There was an error:", err);
                        }
                    })
                }
    
                else {
                    console.log("Plat 3 not implemented.");
                }
            } 
            
            else if (platformOne == "YoutubeMusic") {

                if (platformTwo == "Spotify") {
                    console.log("Spotify not implemented");
                } 
                
                else if (platformTwo == "YoutubeMusic") {
                    // DONT FORGET TO MAKE THE USER CALL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    var desc = "A brand new playlist using PlaySync."
                    var tracklist = '';
                    for (var i = 0; i < sourceSongs.length; i++) {
                        if (i == sourceSongs.length - 1) {
                            tracklist += sourceSongs[i];
                        } else {
                            tracklist += sourceSongs[i] + '$';
                        }
                    }
                    $.ajax({
                        url: `https://playsync.me/youtube/user=${user}&op=newlist&name=Placeholder&desc=${desc}&access=PRIVATE&tracks=${sourceSongs}`,
                        type: 'POST',
                        dataType: 'json',
                        success: function(data) {
                            console.log(data);
                            data.forEach(function(item) {
                                //$('#status-box').append('<div class="status-item"></div>');
                            });
                        },
                        error: function(err) {
                            console.log("There was an error:", err);
                        }
                    })
                }
    
                else {
                    console.log("Plat 3 not implemented.");
                }
            } 
            
            else {
                console.log("Plat 3 not implemented.");
                /*if (platformTwo == "Spotify") {
                    console.log("Spotify not implemented");
                } 
                
                else if (platformTwo == "YoutubeMusic") {
                    // DONT FORGET TO MAKE THE USER CALL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    var desc = "A brand new playlist using PlaySync."
                    $.ajax({
                        url: `https://playsync.me/youtube/user=${user}&op=newlist&name=Placeholder&desc=${desc}&access=PRIVATE&tracks=${sourceSongs}`,
                        type: 'POST',
                        dataType: 'json',
                        success: function(data) {
                            console.log(data);
                            data.forEach(function(item) {
                                //$('#status-box').append('<div class="status-item"></div>');
                            });
                        },
                        error: function(err) {
                            console.log("There was an error:", err);
                        }
                    })
                }
    
                else {
                    console.log("Plat 3 not implemented.");
                }*/
            }
        }
    } else {
        console.log("Both source and destination platforms must be selected.");
    }

}