import hashlib
from includes.psql_conn import psql_read_user_psw, psql_read_user, psql_write_user

# Define all user authentication functions here.

# Check if user:sha224(psw) from database matches uname:passwd
def check_cookies_DB(user: str, passwd: str):
    # Connect to PostgreSQL
    # Check if uid:passwd exists in table
    # Return Username on success, None on fail
    if psql_read_user_psw(user, passwd):
        return user
    return None

def check_user_exist(user: str):
    # Connect to PostgreSQL
    # Check if user exists in table
    if psql_read_user(user):
        return user
    return None

# Check if `user` cookie is valid. Return None if not. Otherwise return uname.
def valid_user(user: str):
    uname = user.split(':')[1]
    passwd = user.split(':')[0]
    return check_cookies_DB(uname, passwd) # If matches DB entry

def add_user(user: str, passwd: str, email: str = ''):
    psql_write_user(user, passwd, email) # If matches DB entry
    return None

def get_uid(username: str):
    return psql_get_uid(username)