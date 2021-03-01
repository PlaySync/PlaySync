import hashlib

def check_cookies_DB(uname: str, passwd: str):
    # Connect to PostgreSQL
    # Check if uid:passwd exists in table
    # Return Username on success, None on fail
    return "alphauser"

def check_user_DB(user: str, passwd: str):
    # Connect to PostgreSQL
    # Check if user:sha256(passwd) exists in table
    # Return Username on success, None on fail
    return "alphauser"

def valid_token(token: str):
    # verify uid validity 
    return True

def valid_user(user: str):
    uname = user.split(':')[0]
    passwd = user.split(':')[1]
    return check_cookies_DB(uname, passwd)