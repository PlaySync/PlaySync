from flask import Flask, render_template
from includes.blueprint import *

app = Flask(__name__)
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

# @app.route('/')
# def index():
#     return 'Web App with Python Flask!'

app.run(host='127.0.0.1', port=81)
