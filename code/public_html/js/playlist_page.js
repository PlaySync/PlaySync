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

        // Remove all songs from a previous playlist, if there are any
        removeChildrenElements("playlist-box");
        removeChildrenElements("status-box");

        if (platform == "Spotify") {
            displaySpotifyPlaylists();
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

            // If there is no selected playlist, do not call Spotify API.
            if (playlistid != '') {
                $('#status-box').append('<form><div class="form-group"><label for="playlistName">Playlist Name</label><input type="text" class="form-control" id="playlistName" aria-describedby="emailHelp" placeholder="Enter a name for your new playlist (Optional)"></div><div class="form-group"><label for="playlistDesc">Playlist Description</label><input type="text" class="form-control" id="playlistDesc" placeholder="Enter a description for your new playlist (Optional)"></div></form>');
                $('#status-box').append('<div class="list-group"><a class="status-item list-group-item disabled" id="listHeader">Select which songs to transfer:</a>');
                var songTableID = "songsFrom" + playlistid;
                var songTable = document.getElementById(songTableID);
                var userError = false;

                // Search Spotify for each song in the songTable
                for (var i = 0; i < songTable.rows.length; i++) {
                    console.log("Title:", songTable.rows[i].cells[0].innerHTML);
                    console.log("Artist:", songTable.rows[i].cells[1].innerHTML);
                    searchSpotifySongs(songTable.rows[i].cells[0].innerHTML, songTable.rows[i].cells[1].innerHTML, i);
                }
                $('#status-box').append('</div>');

                // Append the HTML and update the transfer button if there were no errors.
                if (!userError) {
                    document.getElementById("confirmTransferButton").classList.remove("signup-button-disabled");
                    document.getElementById("confirmTransferButton").classList.remove("disabled");
                } else {
                    console.log("There was an error accessing Spotify.");
                    //alert("There was an error accessing Spotify. Check that your account is authorized.");
                }
            } else {
                console.log("No playlist found.");
            }

        } else if (platform == "YoutubeMusic") {
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

            // If there is no selected playlist, do not call YouTube API.
            if (playlistid != '') {
                $('#status-box').append('<form><div class="form-group"><label for="playlistName">Playlist Name</label><input type="text" class="form-control" id="playlistName" aria-describedby="emailHelp" placeholder="Enter a name for your new playlist (Optional)"></div><div class="form-group"><label for="playlistDesc">Playlist Description</label><input type="text" class="form-control" id="playlistDesc" placeholder="Enter a description for your new playlist (Optional)"></div></form>');
                $('#status-box').append('<div class="list-group"><a class="status-item list-group-item disabled" id="listHeader">Select which songs to transfer:</a>');
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

            removeChildrenElements("playlist-box");
            removeChildrenElements("status-box");
        }
    
    // Should never happen: each element is hardcoded to include 'source' or 'dest'
    } else {
        console.log("Error");
    }
}

// SPOTIFY FUNCTIONS

// Function that calls the Spotify playlist API function
function displaySpotifyPlaylists() {

    // Remove all playlists from a previous platform, if there are any
    removeChildrenElements("playlist-box");

    var userC = getUserID();
    if (userC != '') {
        var html = '';
        $.ajax({
            url: 'https://playsync.me/spotify',
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
                    html += '<p class="pt-2 pl-2">' + info.name + '</p></div>';
                    displaySpotifySongs(info.id);
                });
                $('#playlist-box').append(html);
                updateDestinationButton(true);
            },
            error: function(err) {
                console.log("There was an error accessing the user's playlists:", err);
            }
        });
    } else {
        console.log("User not found.");
    }
}

// When Spotify is selected as a source platform, this function returns the songs in each playlist.
// Args: playlistID -- the ID of the Spotify playlist to be searched
// Appends a string containing the information from each song put in a table after the matching playlistID
function displaySpotifySongs(playlistID) {

    var userC = getUserID();
    if (userC != '') {
        var html = '';
        $.ajax({
            url: `https://playsync.me/spotify`,
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
                    html += '<tr><td style="text-align: left;" id="song-title">' + item.track + '</td><td style="text-align: left;" id="song-artist">' + item.artist + '</td></tr>'; /*'</td><td style="text-align: left;" id="song-album">' + item.album + */
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

function searchSpotifySongs(songTitle, songArtist, songCount) {
    
    var userC = getUserID();
    if (userC != '') {
        var html = '';
        $.ajax({
            url: 'https://playsync.me/spotify',
            type: 'POST',
            dataType: 'json',
            data: {
                user: userC,
                op: 'searchsong',
                title: songTitle,
                artist: songArtist
            },
            success: function(data) {
                console.log(data);
                if (data.length == 0) {
                    html += '<a class="status-item list-group-item" data-toggle="collapse" href="#" id="UnavailableSong">' + songTitle + ' was not found.</a>';
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var id = "'" + data[i].uri + "'";
                        if (i == 0) {
                            html += '<a class="status-item list-group-item" data-toggle="collapse" href="#songCollapse' + songCount + '" onclick="updateSelect(' + id + ')" id="' + data[0].uri + '">' + data[0].song + ': ' + data[0].artist + '</a>';
                        } else {
                            html += '<div class="collapse" id="songCollapse' + songCount + '"><a class="status-item list-group-item" href="#" onclick="updateSelect(' + id + ')" id="' + data[i].uri + '">' + data[i].song + ': ' + data[i].artist + '</a></div>';
                        }
                    }
                }
                $(html).insertAfter('#listHeader');
            },
            error: function(err) {
                console.log("There was an error searching for the song on Spotify:", err);
            }
        })
    } else {
        console.log("User not found.");
    }
}

// YOUTUBE FUNCTIONS

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
// Appends a string containing the information from each song put in a table after the matching playlistID
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
                $(html).insertAfter('#listHeader');
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

                // sourceSongs = [id, id, id, id];
                var sourceSongs = getSelectedSongs();
                // Check that there are actually songs that are selected
                if (sourceSongs.length != 0) {

                    var playlistName = document.getElementById('playlistName').value;
                    var playlistDesc = document.getElementById('playlistDesc').value;

                    // Turn the array of ids into a string with delimiter $
                    var tracklist = '';
                    for (var i = 0; i < sourceSongs.length; i++) {
                        if (i == sourceSongs.length - 1) {
                            tracklist += sourceSongs[i];
                        } else {
                            tracklist += sourceSongs[i] + '$';
                        }
                    }

                    if (platformTwo == "Spotify") {
                        $.ajax({
                            url: `https://playsync.me/spotify`,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                user: userC,
                                op: 'newlist',
                                name: playlistName,
                                desc: playlistDesc,
                                access: 'PRIVATE',
                                tracks: tracklist
                            },
                            success: function(data) {
                                alert("Congratulations! Your new playlist has been created.");
                            },
                            error: function(err) {
                                console.log("There was an error:", err);
                            }
                        })
                    }

                    else if (platformTwo == "YoutubeMusic") {
                        $.ajax({
                            url: `https://playsync.me/youtube`,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                user: userC,
                                op: 'newlist',
                                name: playlistName,
                                desc: playlistDesc,
                                access: 'PRIVATE',
                                tracks: tracklist
                            },
                            success: function(data) {
                                alert("Congratulations! Your new playlist has been created.");
                            },
                            error: function(err) {
                                console.log("There was an error:", err);
                            }
                        })
                    }

                    else {
                        console.log("No valid platform selected.");
                    }
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
            document.getElementById("playlist-box").children[i].children[0].classList.remove("psb-clicked");
        }
        btn.classList.add("psb-clicked");
        $('.song-item.show').collapse('hide');
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
        if (x.getAttribute("href") != '#') {
            x.removeAttribute("data-toggle");
        }
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
        var statusChildren = statusbox.children[1].childElementCount; // children[1] is the <ul></ul> group
        for (var i = 0; i < statusChildren; i++) {
            // In the <ul> group, children elements are <div> or <a>, and <div> indicates alternate songs that need to be caught
            if (statusbox.children[1].children[i].tagName == 'DIV') {
                for (var j = 0; j < statusbox.children[1].children[i].childElementCount; j++) {
                    // children[1].children[i].children[j] catches the alternate songs listed in a collapsable
                    if (statusbox.children[1].children[i].children[j].classList.contains("selected")) {
                        id.push(statusbox.children[1].children[i].children[j].id);
                    }
                }
            }

            // catches the songs with no alternatives
            if (statusbox.children[1].children[i].classList.contains("selected")) {
                id.push(statusbox.children[1].children[i].id);
            }
        }
    }
    return id;
}