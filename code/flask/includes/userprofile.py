from includes.psql_conn import *

def get_email(user):
	return psql_get_email(user)

def add_auth(user, auth_body):
	uid = psql_get_uid(user)
	psql_write_auth(uid, 'ytmusic', auth_body)
	return "added"

def get_auth(user):
	uid = psql_get_uid(user)
	auth_body = psql_check_auth(uid, 'ytmusic')
	return auth_body

def update_usr_email(user, email):
	uid = psql_get_uid(user)
	return psql_write_email(email, uid)