# Playsync Youtube Taskers v1 Documentation

### Usage

```
POST https://playsync.me/youtube
```
### Database Requirement
In table `t_auth`:
| uid      | auth_type | auth_body |
| ----------- | ----------- | ----------- |
| $uid_from_t_user      | ytmusic | $RAW_HEADER |


#### Fetching Raw Header
Please refer to: https://ytmusicapi.readthedocs.io/en/latest/setup.html#copy-authentication-headers and store the RAW HEADER (the one you copied from the browser) into the database.

#### HTTP Request Parameters

```
user: same as values stored in cookies.user
op: operation specifier, see "Available API Operations" section for detail
$param1: parameter for a specific operation. Name may vary. 
$param2: parameter for a specific operation. Name may vary. 
...
```


### Available API Operations

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
    - Optional param: `tracks` a series of id of songs to added to the new playlist, delimited by dash symbol `-`(THIS CAUSES PROBLEM, WILL CHANGE DELIMITER). Omitempty.
- `addsong` Adds song to a playlist [IN DEVELOPMENT]
