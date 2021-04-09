from includes.psql_conn import *

def get_email(user):
	return psql_get_email(user)

def addauth(user, auth_body):
	uid = psql_get_uid(user)
	psql_write_auth(uid, 'ytmusic', auth_body)
	return "added"
