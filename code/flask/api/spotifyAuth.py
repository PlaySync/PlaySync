import os
from flask import Flask, session, request, redirect
from flask_session import Session
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import uuid
import json
from datetime import datetime

app.config['SECRET_KEY'] = os.urandom(64)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)

caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)

def session_cache_path():
    return caches_folder + session.get('uuid')

def spotify_auth():
    if not session.get('uuid'):
        #Visitor is unknown, give random ID
        session['uuid'] = str(uuid.uuid4())

    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(scope='playlist-read-private playlist-modify-private playlist-modify-private',
                                                cache_handler=cache_handler, 
                                                show_dialog=True)

    if request.args.get("code"):
        #Being redirected from Spotify auth page
        auth_manager.get_access_token(request.args.get("code"))
        return redirect('/profile')

    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        auth_url = auth_manager.get_authorize_url()
        return redirect(auth_url)
