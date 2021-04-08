from includes.psql_conn import *

def get_email(user):
	uname = user.split(':')[1]
	return psql_get_email(uname)
