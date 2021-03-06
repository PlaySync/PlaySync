import os
import spotipy
from flask import session, redirect, request
from spotipy.oauth2 import SpotifyOAuth
import uuid
import json
from datetime import datetime

caches_folder = '/tmp/spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)

def session_cache_path(user):
    # if not session.get('uuid'):
    #     #Visitor is unknown, give random ID
    #     session['uuid'] = str(uuid.uuid4())
    return caches_folder + user

def get_spotify(user):
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path(user))
    auth_manager = spotipy.oauth2.SpotifyOAuth(scope='playlist-read-private playlist-modify-private',
        cache_handler=cache_handler, 
        client_id='ae468ff1f96549b28044be8d0419677d',
        client_secret='c033909b0caf46069a4ee7cbb9169b15',
        redirect_uri='https://playsync.me/spotifycallback',
        show_dialog=True)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    return spotify

def auth_spotify(user):
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path(user))
    auth_manager = spotipy.oauth2.SpotifyOAuth(scope='playlist-read-private playlist-modify-private',
        cache_handler=cache_handler, 
        client_id='ae468ff1f96549b28044be8d0419677d',
        client_secret='c033909b0caf46069a4ee7cbb9169b15',
        redirect_uri='https://playsync.me/spotifycallback',
        show_dialog=True)
    
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        #Display sign in link when no token
        auth_url = auth_manager.get_authorize_url()
        return redirect(auth_url)
    
    return redirect('./profile')

def callback(user):
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path(user))
    auth_manager = spotipy.oauth2.SpotifyOAuth(scope='playlist-read-private playlist-modify-private',
    cache_handler=cache_handler, 
    client_id='ae468ff1f96549b28044be8d0419677d',
    client_secret='c033909b0caf46069a4ee7cbb9169b15',
    redirect_uri='https://playsync.me/spotifycallback',
    show_dialog=True)
    #Being redirected from Spotify auth page
    auth_manager.get_access_token(request.args.get("code"))
    return redirect('/profile')

def get_name():
    user = request.cookies.get('user').split(':')[1]
    spotify = get_spotify(user)
    user = "Not connected"
    try:  
        user = spotify.me()['display_name']
    except:
        return
    return user

def get_uid():
    user = request.cookies.get('user').split(':')[1]
    spotify = get_spotify(user)
    u_id = ""
    try:  
        u_id = spotify.current_user()['id']
    except:
        return
    return u_id

def sign_out(user):
    try:
        os.remove(session_cache_path(user))
        session.clear()
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))
    return redirect('/profile')

def playlists(user):
    spotify = get_spotify(user)
    results = []
    for i in spotify.current_user_playlists()['items']:
        results.append({'name': i['name'], 'id': i['uri'].split(':')[-1]})
    return json.dumps(results)

def songs(user, pl_id):
    spotify = get_spotify(user)
    results = []
    for i in spotify.playlist_items(pl_id, additional_types=['track'])['items']:
        artists = [x['name'] for x in i['track']['artists']][0]
        results.append({'track': i['track']['name'], 'artist': artists})
    return json.dumps(results)

def current_user(user):
    spotify = get_spotify(user)
    return json.dumps(spotify.current_user())

def add_playlist(user, name):
    spotify = get_spotify(user)
    u_id = get_uid()
    spotify.user_playlist_create(u_id, name, public=False, collaborative=False, description="A playlist created by PlaySync on "+str(datetime.today().strftime('%Y-%m-%d')))
    pl_id = {'playlistid': spotify.current_user_playlists()['items'][0]['uri'].split(':')[-1]}
    return pl_id

def search_song(user, artist, track):
    spotify = get_spotify(user)
    result = spotify.search(q=f'{artist} {track}', limit=5, type='track')
    song_list = []
    # for i in range(5):
    for item in result['tracks']['items']:
        song_list.append({'uri': item['uri'].split(':')[-1], 'song': item['name'], 'artist': item['artists'][0]['name']})
    if result['tracks']['total'] == 0:
        return json.dumps([])
    return json.dumps(song_list)

def add_song(user, pl_id, track):
    spotify = get_spotify(user)
    # result = spotify.search(q=f'{artist} {track}', limit=1, type='track')
    #print(result['tracks']['items'][0]['id'])
    # if result['tracks']['total'] == 0:
    #     return 'Failed to find track'	
    # spotify.playlist_add_items(pl_id, [result['tracks']['items'][0]['uri']])
    spotify.playlist_add_items(pl_id, track)
    return 'done'

