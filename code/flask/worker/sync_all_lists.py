import includes.sync_integration as sync
from includes.api_auth import *
from includes.tasker import *
from includes.psql_conn import *
import json

def youtube_get_tracks(uid: int, playlist_id: str):
    all_tracks = []
    auth_body = psql_check_auth(uid, "ytmusic")
    if auth_body == "": # Not Authed
        return None
    credential = credential_youtube(auth_body)
    ytapi=youtube_music_tasker(credential[1])
    songs = json.loads(ytapi.show_song_in_playlist(playlist_id))
    for song in songs:
        track = song['title']
        # append artist if possible
        if song['artist'] != None and song['artist'] != 'None':
            track += " "+song['artist']
        # append album if possible
        if song['album'] != None and song['album'] != 'None':
            track += " "+song['album']
        all_tracks.append(track) # add to final list

    return all_tracks

# all_tracks = ['song1title artist album', 'song2title artist', ...]
def youtube_update_list(uid: int, playlist_id: str, all_tracks: []):
    # For every song in all_tracks, search it on YouTube
    # see if top 10 results are in the playlist. 
    # if not, add top 1 search result to playlist.
    auth_body = psql_check_auth(uid, "ytmusic")
    if auth_body == "": # Not Authed
        return None
    credential = credential_youtube(auth_body)
    ytapi=youtube_music_tasker(credential[1])

    # Build list of existing titles.
    list_of_song = json.loads(ytapi.show_song_in_playlist(playlist_id))
    exist_song_titles = []
    for song in list_of_song:
        exist_song_titles.append(song['title'])

    # For each track in all_tracks, search it and see if any search result is in the playlist
    trackid_to_add = []
    for track in all_tracks:
        search_results = json.loads(ytapi.search_song(track))
        found = False
        for result in search_results:
            if result['title'] in exist_song_titles:
                found = True
        if found == False:
            # no search result exists in the list, add the first result
            trackid_to_add.append(search_results[0]['id'])
    
    ytapi.add_songs(playlist_id, trackid_to_add)

def spotify_get_tracks(uid: int, playlist_id: str):
    all_tracks = [] # all_tracks = ['song1title artist album', 'song2title artist', ...]
    # TODO: FINISH THIS FUNC
    return all_tracks

def spotify_update_list(uid: int, playlist_id: str, all_tracks: []):
    all_tracks = [] # all_tracks = ['song1title artist album', 'song2title artist', ...]
    # TODO: FINISH THIS FUNC

if __name__ == "__main__":
    all_pairs = sync.list_user_sync_pair(-1)
    # iterate through each pair. 
    # Use a try-catch for every pair so that we fail separate lists 
    # instead of the entire list
    for pair in all_pairs:
        try:
            # Call get_tracks
            all_tracks = []
            if pair['from']['platform'] == "ytmusic":
                all_tracks = youtube_get_tracks(pair['uid'], pair['from']['id'])
            elif pair['from']['platform'] == "spotify":
                all_tracks = spotify_get_tracks(pair['uid'], pair['from']['id'])
            else:
                print(pair['from']['platform'], "is unsupported source platform.")
                continue # unsupported platform, skip
            
            # call update_list
            if pair['to']['platform'] == "ytmusic":
                youtube_update_list(pair['uid'], pair['to']['id'], all_tracks)
            elif pair['to']['platform'] == "spotify":
                spotify_update_list(pair['uid'], pair['to']['id'], all_tracks)
            else:
                print(pair['to']['platform'], "is unsupported target platform.")
                continue # unsupported platform, skip
        except Exception as e:
            continue
    