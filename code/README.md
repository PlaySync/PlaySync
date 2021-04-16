## Setup Guide

### Dependencies List
All dependencies listed below must be installed on your testing environment previous to deploying the project.

- Python 3.8+
    - pip:
        - `flask` (with `jinja2`)
        - `psycopg2`
        - `configparser` (Should have been pre-installed with Python 3)
        - `hashlib`

- HTTP Server (Recommend: NGINX)
- PostgreSQL 13+

### Configure Database

Create a database with following tables

```
                                       Table "public.t_user"
    Column     |         Type          | Collation | Nullable |               Default               
---------------+-----------------------+-----------+----------+-------------------------------------
 uid           | integer               |           | not null | nextval('t_user_uid_seq'::regclass)
 username      | character varying(20) |           | not null | 
 passwd_sha256 | character varying(64) |           | not null | 
 mail_optin    | boolean               |           | not null | 
 emailaddr     | character varying(64) |           |          | 
Indexes:
    "t_user_pkey" PRIMARY KEY, btree (uid)
    "t_user_username_key" UNIQUE CONSTRAINT, btree (username)

                       Table "public.t_auth"
  Column   |         Type          | Collation | Nullable | Default 
-----------+-----------------------+-----------+----------+---------
 uid       | integer               |           | not null | 
 auth_type | character varying(10) |           | not null | 
 auth_body | text                  |           | not null | 
Indexes:
    "t_auth_uid_auth_type_key" UNIQUE CONSTRAINT, btree (uid, auth_type)
Foreign-key constraints:
    "t_auth_uid_fkey" FOREIGN KEY (uid) REFERENCES t_user(uid)

                       Table "public.t_synclist"
    Column     |         Type          | Collation | Nullable | Default 
---------------+-----------------------+-----------+----------+---------
 uid           | integer               |           | not null | 
 from_platform | character varying(10) |           | not null | 
 to_platform   | character varying(10) |           | not null | 
 from_listid   | character varying(64) |           | not null | 
 to_listid     | character varying(64) |           | not null | 
Indexes:
    "unique_to_list" UNIQUE CONSTRAINT, btree (to_platform, to_listid)
Foreign-key constraints:
    "t_synclist_uid_fkey" FOREIGN KEY (uid) REFERENCES t_user(uid)

                      Table "public.t_sharedlist"
    Column     |         Type          | Collation | Nullable | Default 
---------------+-----------------------+-----------+----------+---------
 uid           | integer               |           | not null | 
 from_platform | character varying(10) |           |          | 
 from_listid   | character varying(64) |           |          | 
 shared_songs  | text                  |           |          | 
Indexes:
    "t_sharedlist_from_platform_from_listid_shared_songs_key" UNIQUE CONSTRAINT, btree (from_platform, from_listid, shared_songs)
Foreign-key constraints:
    "t_sharedlist_uid_fkey" FOREIGN KEY (uid) REFERENCES t_user(uid)
```

### Install/Configure PlaySync on Ubuntu 20

Clone the repository. 

Update `code/flask/includes/database.ini` to match your PSQL config.

Setting up systemd to run Playsync Flask Application as a service by creating `/etc/systemd/system/playsync.service` with contents below
```
[Unit]
Description=Playsync Flask Application
After=network.target

[Service]
User=root # Edit this
WorkingDirectory=/home/freesync/flask # Edit this
ExecStart=/usr/bin/python3.8 start.py # Edit this
Restart=always
# StandardOutput=file:/home/freesync/logs/flask.log # Optional
# StandardError=file:/home/freesync/logs/flask_err.log # Optional

[Install]
WantedBy=multi-user.target
```

(Where `/usr/bin/python3.8` should be your path to python executable and `/home/freesync/flask` is the path to `code/flask` in your cloned repository. May differ on on different system setting-ups.)

Configure 

Reload systemd and set up auto-start.
```
systemctl daemon-reload
systemctl enable playsync
systemctl start playsync
```

### Configure NGINX

Create a vhost configuration for Nginx. Modify/Add the section below:
```
        location / {
                proxy_pass http://127.0.0.1:81; # Where Flask is running at
                index  index.php index.html index.htm;
        }

...

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                root   /home/freesync/public_html; # Where code/public_html is at
        }
```

Reload NGINX to make changes take effects.

### Setting up first account for test

Visit your site served by NGINX, register an account and login. Navigate using the top bar to `Profile Page`.

- Youtube Music API: Go to `Youtube Music` configuration tab, refer to [This Guide](https://ytmusicapi.readthedocs.io/en/latest/setup.html#authenticated-requests) to get the Request Header and paste it into the textbox. Submit.

- Spotify API: [TO-BE-FINISHED]

### Test API Taskers Functionality

Use `POST` request for the test.

YouTube: `https://example.com/youtube`

Spotify: `https://example.com/spotify`

```
user: same as values stored in cookies.user
op: operation specifier, see "Available API Operations" section for detail
$param1: parameter for a specific operation. Name may vary. 
$param2: parameter for a specific operation. Name may vary. 
...
```
`op` and `param`s: 
- `songlist` Lists all songs in the playlist with a specific playlist ID
    - Mandatory param: `playlistid` 
- `playlist` Lists all playlists owned by the authenticated Youtube Music Account of `user`
- `searchsong` Searches songs on Youtube Music
    - Mandatory param: `title` title of the song
    - Optional param: `artist` artist of the song
    - Optional param: `misc` Miscellaneous info of the song, possibly album, different version, etc. Appeneded to the end of the search keyword.
- `newlist` Creates a new Playlist
    - Mandatory param: `name` name of the new playlist. 
    - Optional param: `desc` description of the param. Omitempty. 
    - Optional param: `tracks` a series of id of songs to added to the new playlist, delimited by dash symbol `$`. Omitempty.
- `addsong` Adds song to a playlist
    - Mandatory param: `playlistid` the ID of the playlist to add songs to
    - Mandatory param: `tracks` a series of id of songs to added to the new playlist, delimited by dash symbol `$`.

### Test project functionality

Refer to `Playlist Transfer` section in `README.md` from root folder.