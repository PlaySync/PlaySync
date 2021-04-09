from configparser import ConfigParser
from psycopg2 import sql
import psycopg2

def config(filename='includes/database.ini', section='postgresql'):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db

def psql_conn():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            return conn
        else:
            raise Exception('PostgreSQL Conn Not Created')

def psql_close(conn):
    if conn is not None:
        conn.close()

# Returns true when username:password pair matches
def psql_read_user_psw(username: str, password: str):
    check_ret = False    
    conn = psql_conn()
    cur = conn.cursor()
    # print("Finding", username, password)
    query = psycopg2.sql.SQL("SELECT * FROM {tbl} WHERE {col1}=%s AND {col2}=%s").format(
        tbl=sql.Identifier('t_user'),
        col1=sql.Identifier('username'),
        col2=sql.Identifier('passwd_sha256'))
    cur.execute(query, (username, password, ))
    row = cur.fetchone() # Check if at least 1 row (and should be at most one row as well...)
    if row is not None: # found row
        check_ret = True
    cur.close()
    conn.close()
    return check_ret

# Returns true when username exists
def psql_read_user(username: str):
    check_ret = False    
    conn = psql_conn()
    cur = conn.cursor()
    # cur.execute('SELECT * FROM t_user WHERE username=\''+username+'\'')
    query = psycopg2.sql.SQL("SELECT * FROM {tbl} WHERE {col1}=%s").format(
        tbl=sql.Identifier('t_user'),
        col1=sql.Identifier('username'))
    cur.execute(query, (username, ))
    row = cur.fetchone() # Check if at least 1 row (and should be at most one row as well...)
    if row is not None: # found row
        check_ret = True
    cur.close()
    conn.close()
    return check_ret

# 
def psql_write_user(username: str, password: str, email: str):
    conn = psql_conn()
    cur = conn.cursor()
    print("Inserting", username, password, email)
    if email=='':
        cur.execute('INSERT INTO t_user(username, passwd_sha256, mail_optin) VALUES (%s, %s, %s)', (username, password, 'FALSE'))
    else:
        cur.execute('INSERT INTO t_user(username, passwd_sha256, mail_optin, emailaddr) VALUES (%s, %s, %s, %s)', (username, password, 'TRUE', email))
    conn.commit()
    cur.close()
    conn.close()
    return None

#
def psql_get_uid(username: str):
    user_id = -1   
    conn = psql_conn()
    cur = conn.cursor()
    # cur.execute('SELECT * FROM t_user WHERE username=\''+username+'\'')
    query = psycopg2.sql.SQL("SELECT uid, username FROM {tbl} WHERE {col1}=%s").format(
        tbl=sql.Identifier('t_user'),
        col1=sql.Identifier('username'))
    cur.execute(query, (username, ))
    row = cur.fetchone() # Check if at least 1 row (and should be at most one row as well...)
    if row is not None: # found row
        user_id = row[0]
    cur.close()
    conn.close()
    return user_id

# 
def psql_check_auth(uid: int, auth_type: str):
    auth_body=""
    conn = psql_conn()
    cur = conn.cursor()
    # cur.execute('SELECT * FROM t_auth WHERE uid=\''+username+'\'')
    query = psycopg2.sql.SQL("SELECT uid,auth_body FROM {tbl} WHERE auth_type=%s AND {col1}=%s").format(
        tbl=sql.Identifier('t_auth'),
        col1=sql.Identifier('uid'))
    cur.execute(query, (auth_type, uid))
    row = cur.fetchone() # Check if at least 1 row (and should be at most one row as well...)
    if row is not None: # found row
        auth_body = row[1]
    cur.close()
    conn.close()
    return auth_body

# 
def psql_write_auth(uid: int, auth_type: str, auth_body: str):
    conn = psql_conn()
    cur = conn.cursor()
    auth_body = auth_body.encode('latin').replace(b'\r', b'').decode('latin')
    # print("Inserting", uid, auth_type, auth_body)
    if psql_check_auth(uid, auth_type) == "":
        cur.execute('INSERT INTO t_auth(uid, auth_type, auth_body) VALUES (%s, %s, %s)', (uid, auth_type, auth_body))
    else:
        cur.execute('UPDATE t_auth SET auth_body=%s WHERE uid=%s AND auth_type=%s', (auth_body, uid, auth_type))
    conn.commit()
    cur.close()
    conn.close()
    return None

def psql_get_email(username: str):
    email = ""
    conn = psql_conn()
    cur = conn.cursor()
    query = psycopg2.sql.SQL("SELECT emailaddr FROM {tbl} WHERE username=%s").format(
        tbl=sql.Identifier('t_user'))
    cur.execute(query, (username,))
    row = cur.fetchone() # Check if at least 1 row (and should be at most one row as well...)
    if row is not None: # found row
        email = row[0]
    cur.close()
    conn.close()
    return email

def psql_write_email(email :str, username :string):
    conn = psql_conn()
    cur = conn.cursor()
    cur.execute('UPDATE t_user SET emailaddr=%s WHERE uid=%s', (email, username))
    return None