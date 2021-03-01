from flask import Flask, render_template
from includes.blueprint import landing_page, login_page, userauth_page, logout_page

app = Flask(__name__)
app.register_blueprint(landing_page)
app.register_blueprint(login_page)
app.register_blueprint(userauth_page)
app.register_blueprint(logout_page)

# @app.route('/')
# def index():
#     return 'Web App with Python Flask!'

app.run(host='0.0.0.0', port=81)
