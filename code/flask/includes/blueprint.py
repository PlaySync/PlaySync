from flask import Blueprint, render_template, abort, request, make_response
from jinja2 import TemplateNotFound
from includes.userauth import *

landing_page = Blueprint('landing_page', __name__, template_folder='templates')
login_page = Blueprint('login_page', __name__, template_folder='templates')
userauth_page = Blueprint('userauth_page', __name__, template_folder='templates')
logout_page = Blueprint('logout_page', __name__, template_folder='templates')     

@landing_page.route('/')
def landing():
    if 'visited' in request.cookies: # Not new comer
        if 'token' in request.cookies and 'user' in request.cookies: # Logged in
            token = valid_token(request.cookies.get('token'))
            user = valid_user(request.cookies.get('user'))
            
            if token == True and user != None:
                return render_template('authed.html', title='Authenticated User - PlaySync', username=user)
            else:
                resp = make_response(render_template('login.html', title='Please log in - PlaySync'))
                resp.set_cookie('token', expires=0)
                resp.set_cookie('user', expires=0)
                return resp
        else: # Not Logged In
            return render_template('landing.html', title='Consider Log-In or Register - PlaySync')


    else:
        resp = make_response(render_template('landing.html', title='Welcome, first-time visitor - PlaySync'))
        resp.set_cookie('visited', '1')
        return resp

@login_page.route('/login')
def login():
    return render_template('login.html', title='Log-in form - PlaySync')

@userauth_page.route('/userauth', methods=['POST'])
def userauth():
    data = request.get_json()
    resp = make_response('You have been logged in. Go back to <a href="./">Home</a>.')
    resp.set_cookie('token', request.form.get('psw'))
    resp.set_cookie('user', request.form.get('uname')+':'+request.form.get('psw'))
    return resp