## shebang block
##!/usr/bin/env python3

from ytmusicapi import YTMusic

# Interactively input header, save the auth JSON to a file
# YTMusic.setup(filepath="headers_auth.json")

# Non-interactively input header, save to file
# YTMusic.setup(filepath=headers_auth.json, headers_raw="<headers copied above>")

# Non-interactively capture the JSON as return
# JSON_AUTH = YTMusic.setup(headers_raw="<headers copied above>")

# Accpeting raw header as STDIN
JSON_AUTH = YTMusic.setup()
# print(JSON_AUTH)

# Authenticate
SESSION_AUTH = YTMusic(JSON_AUTH)

# Create PlayList
playlistId = SESSION_AUTH.create_playlist("GTest", "Lorem ipsum dolor sit amet")
print("Play List ID:", playlistId)
search_results = SESSION_AUTH.search(query="Fubuki", limit=5)
print("Search results:")
for song in search_results:
    if(song['resultType'] in ['song','video']):
        print("Type:", song['resultType'], "Title:", song['title'], "Artist:", song['artists'][0]['name'], "Duration:", song['duration'])
#add_status = SESSION_AUTH.add_playlist_items(playlistId, [search_results[0]['videoId']])
#print("Add Status:", add_status)