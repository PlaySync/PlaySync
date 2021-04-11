// Get the users cookie
function getUserID() {
    var id = document.cookie;
    if (id != '') {
        var value = id.split('=');
        id = value[1];
    }
    return id;
}

// Update the dropdown button text based on the chosen platform
// Args: src -- indicates whether the button is the Platform 1 button or Platform 2
//       platform -- indicates which platform was selected
function updateButton(src, platform) {

    // Update the source button and call the given platform's user-playlist and user-songs API functions
    if (src == "source") {
        document.getElementById("sourceTransferButton").innerHTML = platform;
        if (platform == "Spotify") {
            console.log("Spotify");
            updateDestinationButton(false);
        } else if (platform == "YoutubeMusic") {
            displayYouTubePlaylists();
        } else {
            console.log("Platform does not exist.");
            updateDestinationButton(false);
        }

    // Update the destination platform and call the given platform's search-song API function
    } else if (src == "dest") {
        document.getElementById("destinationTransferButton").innerHTML = platform;
        if (platform == "Spotify") {
            console.log("Spotify");
        } else if (platform == "YoutubeMusic") {
            console.log("YouTubeMusic");
            // Remove all songs from a previous playlist, if there are any
            removeChildrenElements("status-box");

            // Get the selected playlist by its classes
            var playbox = document.getElementById("playlist-box");
            var playlistid = '';
            var numPlaylists = document.getElementById("playlist-box").childElementCount;
            for (var i = 0; i < numPlaylists; i++) {
                if (playbox.children[i].children[0].classList.contains("psb-clicked")) {
                    playlistid = playbox.children[i].children[0].id;
                }
            }

            console.log("PlaylistID:", playlistid);
            // If there is no selected playlist, do not call YouTube API.
            if (playlistid != '') {
                $('#status-box').append('<div class="list-group"><a class="status-item list-group-item disabled">Select which songs to transfer:</a>');
                var songTableID = "songsFrom" + playlistid;
                var songTable = document.getElementById(songTableID);
                var userError = false;

                // Search YouTubeMusic for each song in the songTable
                for (var i = 0; i < songTable.rows.length; i++) {
                    searchYouTubeSongs(songTable.rows[i].cells[0].innerHTML, songTable.rows[i].cells[1].innerHTML, '', i);
                }
                $('#status-box').append('</div>');

                // Append the HTML and update the transfer button if there were no errors.
                if (!userError) {
                    document.getElementById("confirmTransferButton").classList.remove("signup-button-disabled");
                    document.getElementById("confirmTransferButton").classList.remove("disabled");
                } else {
                    console.log("There was an error accessing YouTubeMusic.");
                    //alert("There was an error accessing YouTubeMusic. Check that your account is authorized.");
                }
            } else {
                console.log("No playlist found.");
            }
        } else {
            console.log("Platform does not exist.");
        }
    
    // Should never happen: each element is hardcoded to include 'source' or 'dest'
    } else {
        console.log("Error");
    }
}

// Function that calls the YouTubeMusic playlist API function
function displayYouTubePlaylists() {

    // Remove all playlists from a previous platform, if there are any
    removeChildrenElements("playlist-box");

    var userC = getUserID();
    if (userC != '') {
        var html = '';
        $.ajax({
            url: 'https://playsync.me/youtube',
            type: 'POST',
            dataType: 'json',
            data: {
                user: userC,
                op: 'playlist'
            },
            success: function(data) {
                data.forEach(function(info) {
                    var id = "'" + info.id + "'";
                    html += '<div class="playlist-item" id="divPlaylistCollapse' + info.id + '"><button class="playselect-button" onclick="updateSelectedPlaylist(' + id + ')" type="button" data-toggle="collapse" data-target="#playlistCollapse' + info.id + '" aria-expanded="false" aria-controls="playlistCollapse" id="' + info.id + '"></button>';
                    html += '<p class="pt-2 pl-2">' + info.title + '</p></div>';
                    displayYouTubeSongs(info.id);
                });
                $('#playlist-box').append(html);
                updateDestinationButton(true);
            },
            error: function(err) {
                console.log("There was an error accessing the user's playlists:", err);
            }
        })
    } else {
        console.log("User not found.");
    }
}

// When YouTube is selected as a source platform, this function returns the songs in each playlist.
// Args: playlistID -- the ID of the YouTubeMusic playlist to be searched
// Returns: a string containing the information from each song put in a table to be appended to the playlist's information
function displayYouTubeSongs(playlistID) {

    var userC = getUserID();
    if (userC != '') {
        var html = '';
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
                html += '<div class="song-item collapse" id="playlistCollapse' + playlistID + '"><table style="padding-left: 20px; width: 100%;" id="songsFrom' + playlistID + '">';
                data.forEach(function(item) {
                    html += '<tr><td style="text-align: left;" id="song-title">' + item.title + '</td><td style="text-align: left;" id="song-artist">' + item.artist + '</td><td style="text-align: left;" id="song-album">' + item.album + '</td></tr>';
                });
                html += '</table></div>';
                var dest = '#divPlaylistCollapse' + playlistID;
                $(html).insertAfter(dest);
            },
            error: function(err) {
                console.log("There was an error finding the songs in the user's playlist:", err);
            }
        })
    } else {
        console.log("User not found.");
    }
}

// Function that searches for songs on YouTubeMusic
// Args: songTitle -- the title of the song to be searched
//       songArtist -- the artist of the song to be searched
//       songDesc -- some more info to search the song
//       songCount -- indicates how many times the function has been called (used to make each ID unique for the collapse to work properly)
// Returns: a string containing the HTML to be appended to the status-box
function searchYouTubeSongs(songTitle, songArtist, songDesc, songCount) {

    var userC = getUserID();
    if (userC != '') {
        var html = '';
        $.ajax({
            url: 'https://playsync.me/youtube',
            type: 'POST',
            dataType: 'json',
            data: {
                user: userC,
                op: 'searchsong',
                title: songTitle,
                artist: songArtist,
                misc: songDesc
            },
            success: function(data) {
                if (data.length == 0) {
                    html += '<a class="status-item list-group-item" data-toggle="collapse" href="#" id="UnavailableSong">' + songTitle + ' was not found.</a>';
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var id = "'" + data[i].id + "'";
                        if (i == 0) {
                            html += '<a class="status-item list-group-item" data-toggle="collapse" href="#songCollapse' + songCount + '" onclick="updateSelect(' + id + ')" id="' + data[0].id + '">' + data[0].title + ': ' + data[0].artist + '</a>';
                        } else {
                            html += '<div class="collapse" id="songCollapse' + songCount + '"><a class="status-item list-group-item" href="#" onclick="updateSelect(' + id + ')" id="' + data[i].id + '">' + data[i].title + ': ' + data[i].artist + '</a></div>';
                        }
                    }
                }
                $('#status-box').append(html);
            },
            error: function(err) {
                console.log("There was an error searching for the song on YouTubeMusic:", err);
            }
        })
    }

    else {
        console.log("User not found.");
    }
}

// Function that calls the final new-list or add-song APIs
function confirm() {

    var platformOne = document.getElementById("sourceTransferButton").innerHTML;
    var platformTwo = document.getElementById("destinationTransferButton").innerHTML;

    // Check both platforms have been selected
    if (String(platformOne) != "Platform 1" && String(platformTwo) != "Platform 2") {
        // Check to make sure the playlist and status boxes are not empty, or else there was an error accessing either
        if (!document.getElementById("playlist-box").firstElementChild || !document.getElementById("status-box").firstElementChild) {
            console.log("Playlists and Songs must exist.");
        } else {

            var userC = getUserID();
            if (userC != '') {
                // Get the ID of the currently selected playlist
                var playlistBox = document.getElementById("playlist-box").children;
                var numPlaylists = document.getElementById("playlist-box").childElementCount;
                var playID = '';
                for (var i = 0; i < numPlaylists; i++) {
                    if (playlistBox[i].children[0].classList.contains("psb-clicked")) {
                        playID = playlistBox[i].children[0].id;
                    }
                }

                // sourceSongs = [id, id, id, id];
                var sourceSongs = getSelectedSongs();
                // Check that there are actually songs that are selected
                if (sourceSongs.length != 0) {

                    // Methods for when the source platform is Spotify
                    if (platformOne == "Spotify") {
                        console.log("Sptofiy not implemented");

                        // Method for Spotify -> Spotify
                        if (platformTwo == "Spotify") {
                            console.log("Spotify not implemented");
                        } 
                        
                        // Method for Spotify -> YouTubeMusic
                        else if (platformTwo == "YoutubeMusic") {
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

                        // Method for Spotify -> Platform 3
                        else {
                            console.log("Plat 3 not implemented.");
                        }
                    } 
                    
                    // Methods for when the source platform is YouTubeMusic
                    else if (platformOne == "YoutubeMusic") {

                        // Method for YouTubeMusic -> Spotify
                        if (platformTwo == "Spotify") {
                            console.log("Spotify not implemented");
                        } 
                        
                        // Method for YouTubeMusic -> YouTubeMusic
                        else if (platformTwo == "YoutubeMusic") {
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

                        // Method for YouTubeMusic -> Platform 3
                        else {
                            console.log("Plat 3 not implemented.");
                        }
                    } 
                    
                    // Methods for Platform 3
                    else {
                        console.log("Plat 3 not implemented.");
                    }

                // sourceSongs length == 0
                } else {
                    console.log("No selected songs.");
                }

            // userC == ''
            } else {
                console.log("No user found.");
            }
        }

    // Source and/or destination isn't selected
    } else {
        console.log("Both source and destination platforms must be selected.");
    }

}


// HELPER FUNCTIONS


// NOTE: IMPLEMENT DE-SELECTION OF A PARENT COLLAPSE IN THE CASE OF AN ALTERNATIVE BEING SELECTED

// Update the CSS for the currently selected playlist.
// Used to indicate which songs should be passed into each search function.
function updateSelectedPlaylist(playlistID) {
    var btn = document.getElementById(playlistID);
    var numPlaylists = document.getElementById("playlist-box").childElementCount;
    if (numPlaylists != 0) {
        for (var i = 0; i < numPlaylists; i++) {
            console.log(document.getElementById("playlist-box").children[i].children[0]);
            document.getElementById("playlist-box").children[i].children[0].classList.remove("psb-clicked");
        }
        btn.classList.add("psb-clicked");
    }

    // remove all songs from a previous playlist, if there are any
    removeChildrenElements("status-box");

    if (document.getElementById("headerSelectTextTwo") != null) {
        document.getElementById("headerSelectTextTwo").remove();
    }
}

// Update the CSS for each song that is selected to be transferred.
// Used to keep track of which songs need to be added to a new playlist
// Args: songID -- the ID of the song that has been clicked
function updateSelect(songID) {
    var x = document.getElementById(songID);
    if (x.classList.contains("selected")) {
        document.getElementById(songID).classList.remove("selected");
    } else {
        document.getElementById(songID).classList.add("selected");
    }
}

// Update the CSS for the destination button.
// Args: valid -- indicates whether the destination button should be enabled or disabled
function updateDestinationButton(valid) {
    var btn = document.getElementById("destinationTransferButton");
    if (valid) {
        btn.classList.remove("disabled");
        btn.classList.remove("drop-button-disabled");
    } else {
        btn.classList.add("disabled");
        btn.classList.add("drop-button-disabled");
    }
}

// Remove the elements in playlist-box and status-box
// Args: divID -- the ID of playlist or status
function removeChildrenElements(divID) {
    var box = document.getElementById(divID);
    while (box.firstChild) {
        box.removeChild(box.firstChild);
    }
}

// Get the ID's of every song with the class 'selected'
function getSelectedSongs() {
    var id = [];
    var statusbox = document.getElementById("status-box");
    if (statusbox.firstElementChild) {
        console.log("Success");
        var statusChildren = statusbox.children[0].childElementCount; // children[0] is the <ul></ul> group
        for (var i = 0; i < statusChildren; i++) {
            // In the <ul> group, children elements are <div> or <a>, and <div> indicates alternate songs that need to be caught
            if (statusbox.children[0].children[i].tagName == 'DIV') {
                console.log("DIV: ", statusbox.children[0].children[i].tagName);
                for (var j = 0; j < statusbox.children[0].children[i].childElementCount; j++) {
                    // children[0].children[i].children[j] catches the alternate songs listed in a collapsable
                    console.log("Test:", statusbox.children[0].children[i].children[j]);
                    if (statusbox.children[0].children[i].children[j].classList.contains("selected")) {
                        console.log("Success!!!");
                        id.push(statusbox.children[0].children[i].children[j].id);
                    }
                }
            }

            // catches the songs with no alternatives
            if (statusbox.children[0].children[i].classList.contains("selected")) {
                console.log("Test2: ", statusbox.children[0].children[i]);
                id.push(statusbox.children[0].children[i].id);
            }
        }
    }
    console.log(id);
    return id;
}