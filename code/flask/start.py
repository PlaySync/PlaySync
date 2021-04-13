from flask import Flask, render_template
from flask_session import Session
from includes.blueprint import *
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)
app.register_blueprint(landing_page)
app.register_blueprint(login_page)
app.register_blueprint(userauth_page)
app.register_blueprint(logout_page)
app.register_blueprint(signup_page)
app.register_blueprint(useradd_page)
app.register_blueprint(about_page)
app.register_blueprint(youtube_operation)
app.register_blueprint(authadd_page)
app.register_blueprint(authget_page)
app.register_blueprint(transfer_page)
app.register_blueprint(profile_page)
app.register_blueprint(youtube_auth)
app.register_blueprint(update_email)
app.register_blueprint(spotify_api)
app.register_blueprint(spotify_auth)
# app.register_blueprint(spotify_playlist)
app.register_blueprint(spotify_callback)
app.register_blueprint(spotify_remove)
# app.register_blueprint(spotify_songs)
# app.register_blueprint(spotify_add_pl)
# app.register_blueprint(spotify_add_sg)
# app.register_blueprint(spotify_search)



# @app.route('/')
# def index():
#     return 'Web App with Python Flask!'

app.run(host='127.0.0.1', port=81)
