from configparser import ConfigParser
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
    print("Finding", username, password)
    cur.execute('SELECT * FROM t_user WHERE username=\''+username+'\' AND passwd_sha256=\''+password+'\'')
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
    cur.execute('SELECT * FROM t_user WHERE username=\''+username+'\'')
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