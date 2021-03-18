function displaySongs(playlistNum) {
    //not sure how to access songs yet so for now it's some dummy info
    var btn = document.getElementById("playlist" + playlistNum);
    for (i = 0; i < 3; i++) { // will have to change i < 2 to be the number of playlists
        document.getElementById("playlist" + i).classList.remove("psb-clicked");
    }
    btn.classList.add("psb-clicked");
}