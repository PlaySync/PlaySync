//var userTEST = "64d96f030c409c53612e3afc1fcb54aae40f4242ea346aedc9e9633678670c0f:alpha_user";
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

    var userC = getUserID();
    console.log(userC);
    if (user != '') {
        // call the given platform's taskers to get the playlist information
        if (platform == "Spotify") {
            console.log("Spotify Taskers not implemented.");
        } else if (platform == "YoutubeMusic") {
            console.log("Playlist Call Test w/ Full User");
            var yMusic = "'YoutubeMusic'";
            $.ajax({
                url: 'https://playsync.me/youtube',
                type: 'POST',
                dataType: 'json',
                data: {
                    user: userC,
                    op: 'playlist'
                },
                success: function(data) {
                    console.log("Data(Playlist):", data);
                    data.forEach(function(info) {
                        console.log("Info:", info);
                        var id = "'" + info.id + "'";
                        $('#playlist-box').append('<div class="playlist-item"><button class="playselect-button" onclick="displaySongs(' + yMusic + ', ' + id + ')" id="' + info.id + '"></button><p class="pt-2 pl-2">' + info.title + '</p></div>');
                    });
                },
                error: function(err) {
                    console.log("There was an error:", err);
                }
            })
        } else { // plat3
            console.log("Not implemented.");
        }
    } else {
        console.log("User not found.");
    }
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

    var userC = getUserID();
    if (userC != '') {
        // call the given platform's taskers to get the song information
        if (platform == "Spofity") {
            console.log("Spotify unfinished");
        } else if (platform == "YoutubeMusic") {
            //var songs = '<table id="songTable">';
            //for (var i = 0; i < songOne.length; i++) {
                //var playid = "'" + playlists[i].id + "'";
            //    songs += '<tr><td style="text-align: left;" id="song-title">' + songOne[i].title + '</td><td style="text-align: left;">' + songOne[i].artist + '</td><td style="text-align: left;">' + songOne[i].album + '</td></tr>';
            //}
            //songs += '</table>';
            console.log("Song Call Update");
            $.ajax({
                url: `https://playsync.me/youtube`,
                type: 'POST',
                dataType: 'json',
                data: {
                    user: userC,
                    op: 'songlist',
                    playlistid: playlistID
                },
                success: function(data) {
                    console.log("Data(Song):", data);
                    var songs = '<table id="songTable">';
                    data.forEach(function(item) {
                        console.log(item);
                        songs += '<tr><td style="text-align: left;" id="song-title">' + item.title + '</td><td style="text-align: left;">' + item.artist + '</td><td style="text-align: left;">' + item.album + '</td></tr>';
                    });
                    songs += '</table>';
                    $('#status-box').append(songs);
                },
                error: function(err) {
                    console.log("There was an error:", err);
                }
            })
        } else { // plat 3
            console.log("Not implemented.");
        }
    } else {
        console.log("User not found.");
    }
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
            var userC = getUserID();
            //if (sourceSongs.length != 0) {

            //}

            console.log("Source Songs:", sourceSongs);
            if (userC != '') {
                if (platformOne == "Spotify") {
                    console.log("Sptofiy not implemented");
                    if (platformTwo == "Spotify") {
                        console.log("Spotify not implemented");
                    } 
                    
                    else if (platformTwo == "YoutubeMusic") {
                        // DONT FORGET TO MAKE THE USER CALL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        console.log("Transfer");
                        $.ajax({
                            url: `https://playsync.me/youtube`,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                user: userC,
                                op: 'newlist',
                                desc: 'A brand new playlist using PlaySync.',
                                access: 'PRIVATE'
                            },
                            success: function(data) {
                                console.log(data);
                                for (var i = 0; i < sourceSongs.length; i++) {
                                    console.log("Add");
                                    $.ajax({
                                        url: `https://playsync.me/youtube`,
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                            user: userC,
                                            op: 'addsong',
                                            tracks: sourceSongs[i]
                                        },
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
                        var tracklist = '';
                        for (var i = 0; i < sourceSongs.length; i++) {
                            if (i == sourceSongs.length - 1) {
                                tracklist += sourceSongs[i];
                            } else {
                                tracklist += sourceSongs[i] + '$';
                            }
                        }
                        console.log("Tracks:", tracklist);
                        $.ajax({
                            url: `https://playsync.me/youtube`,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                user: userC,
                                op: 'newlist',
                                name: 'Placeholder',
                                desc: 'A brand new playlist using PlaySync.',
                                access: 'PRIVATE',
                                tracks: tracklist
                            },
                            success: function(data) {
                                console.log("Source:", data);
                                //data.forEach(function(item) {
                                    //$('#status-box').append('<div class="status-item"></div>');
                                //});
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
            } else {
                console.log("User not found.");
            }
        }
    } else {
        console.log("Both source and destination platforms must be selected.");
    }

}