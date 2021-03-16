from ytmusicapi import YTMusic
from includes.const import *
import json
from datetime import datetime

def youtube_music_auth(raw_header: str):
    return YTMusic.setup(headers_raw=raw_header)

class youtube_music_tasker:
    def __init__(self, auth_json:str):
        self.api=YTMusic(auth_json)

    # Return:
    #   [
    #       {
    #           "id": "playlistid1",
    #           "title": "playlist_title1",
    #           "thumbnail": "url_to_playlist1_1st_thumbnail"
    #       }, 
    #       {
    #           "id": "playlistid2",
    #           "title": "playlist_title2",
    #           "thumbnail": "url_to_playlist2_1st_thumbnail"
    #       }
    #   ]
    #
    def show_playlist(self):
        list_of_playlist = []

        try:
            library_playlists = self.api.get_library_playlists(limit=50) # Hopefully, no one has 50+ playlists. 
            for pl in library_playlists:
                # Only showing non-empty well-formed playlists
                if 'count' in pl and pl['count']>0 and 'playlistId' in pl and 'title' in pl and 'thumbnails' in pl:
                    playlist = {}
                    playlist['id']=pl['playlistId']
                    playlist['title']=pl['title']
                    if len(pl['thumbnails']>0):
                        playlist['thumbnail']=pl['thumbnails'][0]['url']
                    else:
                        playlist['thumbnail']=DEFAULT_IMG_URL            
                    list_of_playlist.append(playlist)
        except Exception as e:
            print("Unexpected Error in show_playlist:", e)
        
        return json.dumps(list_of_playlist)

    # Return:
    #   [
    #       {
    #           "title": "name",
    #           "artist": "someone",
    #           "album": "the album"
    #       }, 
    #       {
    #           "title": "name",
    #           "artist": "any",
    #           "album": "any"
    #       }
    #   ]
    #
    def show_song_in_playlist(self, playlist_id:str):
        list_of_song = []

        try:
            pl_detail = self.api.get_playlist(playlistId=playlist_id)
            if len(pl_detail)>0 and 'tracks' in pl_detail[0]:
                for track in pl_detail[0]['tracks']:
                    if 'title' in track:
                        new_track = {'title':track['title'], 'artist':'any', 'album':'any'}
                        if 'artists' in track and len(track['artists'])>0:
                            new_track['artist'] = track['artists'][0]['name']
                        if 'album' in track and 'name' in track['album']:
                            new_track['album'] = track['album']['name']
                        list_of_song.append(new_track)
        except Exception as e:
            print("Unexpected Error in show_song_in_playlist:", e)
        return json.dumps(list_of_song)


    # access: 'PRIVATE', 'PUBLIC', 'UNLISTED'
    # Return: A tuple of (create_status, playlist_id, add_status)
    def new_playlist(self, playlist_name:str, desc:str = "A playlist created by PlaySync on "+str(datetime.today().strftime('%Y-%m-%d')), access: str = 'PRIVATE', tracks=[]):
        try:
            playlist_id = self.api.create_playlist(title=playlist_name, description=desc, privacy_status=access)
            if type(playlist_id) == str: # It is an id
                if len(tracks)>0:
                    status = self.api.add_playlist_items(playlist_id, tracks)
                    return (0, playlist_id, status) # Creation successful, add status attached
                else:
                    return (0, playlist_id, "NULL") # Creation successful, didn't add
            else: # Status message, means error in creation
                return (-1, 0, 0)
        except Exception as e:
            print("Unexpected Error in new_playlist:", e)
            return (-2, 0, 0) # Didn't crash gracefully

    def search_song(self, song_title:str, song_artist:str='', song_misc:str=''):
        song_list = []
        try:
            search_results = self.api.search(query = song_title + song_artist + song_misc, limit=10)
            for song_found in search_results:
                if(song_found['resultType'] in ['song','video']):
                    new_song = {'id':song_found['videoId'], 'title': song_found['title'], 'artist':'None', 'album':'None', 'duration':'Unknown'}
                    if len(song_found['artists'])>0:
                        new_song['artist']=song_found['artists'][0]['name']
                    if 'album' in song_found:
                        new_song['artist']=song_found['album']['name']
                    if 'duration' in song_found:
                        new_song['duration']=song_found['duration']
                    song_list.append(new_song)
        except Exception as e:
            print("Unexpected Error in search_song:", e)
        
        return json.dumps(song_list)
       