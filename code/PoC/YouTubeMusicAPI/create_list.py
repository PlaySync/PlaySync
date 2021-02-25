## shebang block
##!/usr/bin/env python3
from ytmusicapi import YTMusic
from os import path

PATH_TO_JSON = "headers_auth.json"

def err(errstr='!unimplemented()'):
    raise NameError(errstr)

if __name__ == '__main__':
    print("==============================================================")
    print("===            PlaySync: Playlist Creation Demo            ===")
    print("==============================================================")

    # Authenticate, now with pre-gen header.
    if path.exists(PATH_TO_JSON):
        SESSION_AUTH = YTMusic(PATH_TO_JSON)
    else:
        err("JSON file does not exist. Please run header_gen.py first.")

    # Create PlayList
    playlist_title = input("[1] Create a new playlist: ") 
    playlist_desc = input("[2] A brief description for this playlist: ") 
    print("[-] Playlist in creation...")
    playlist_id = SESSION_AUTH.create_playlist(playlist_title, playlist_desc)
    if type(playlist_id) == type(playlist_title): # Returned a str
        remote_pl_title = SESSION_AUTH.get_playlist(playlistId=playlist_id,limit=1)['title']
        print("[-] Playlist created as", playlist_id, ":", remote_pl_title)
        if(input("[3] Proceed? [Y/N]: ") == "Y"):
            playlist_title = remote_pl_title
        else:
            print("[-] Abort! Cleaning up...")
            SESSION_AUTH.delete_playlist(playlist_id)
            print("[-] Byebye!")
            exit()
    else:
        print(playlist_id)
        err("Failed to create playlist, please refer to the error message.")

    # Add song
    song_list_to_add = []
    COMM = "F"
    while True:
        COMM = input("[4] Managing Playlist [A(DD)/D(EL)/S(TOP)/L(IST)]: ")
        if COMM=="A" or COMM=="ADD" :
            # something
            print("[-] Now we are adding songs into the playlist.")
            song_title = input("[5] Song title: ")
            song_artist = " "+input("[6] Artist(optional): ")
            song_misc = " "+input("[7] Miscellaneous(optional): ")
            search_results = SESSION_AUTH.search(query = song_title + song_artist + song_misc, limit=10)
            print("[-] These are the songs in top 10 results we found. (Format: No., Title, Artist, Type, Duration)")

            tmp_song_list = [] # ID, title, first_artist, type, duration 
            for song_found in search_results:
                if(song_found['resultType'] in ['song','video']):
                    if len(song_found['artists'])>0:
                        tmp_song_list.append([song_found['videoId'], song_found['title'], song_found['artists'][0]['name'], song_found['resultType'], song_found['duration']])
                    elif 'album' in song_found:
                        tmp_song_list.append([song_found['videoId'], song_found['title'], song_found['album']['name'], song_found['resultType'], song_found['duration']])
                    else:
                        tmp_song_list.append([song_found['videoId'], song_found['title'], "", song_found['resultType'], song_found['duration']])
            
            for idx, song in enumerate(tmp_song_list):
                print(str(idx+1) + "    " + song[1] + "    " + song[2] + "    " + song[3] + "    " + song[4])

            print("[-] Please input the No. for the one to add to your playlist. 0 for nothing.")
            chosen_no = int(input("[8] No. of the song:"))
            if(chosen_no <= 0):
                # do nothing
                print("[-] Not to add")
            elif(chosen_no<=len(tmp_song_list)):
                print("[-] Adding:", tmp_song_list[chosen_no-1][1], "by", tmp_song_list[chosen_no-1][2])
                song_list_to_add.append([tmp_song_list[chosen_no-1][0], tmp_song_list[chosen_no-1][1], tmp_song_list[chosen_no-1][2]])

        elif COMM=="D" or COMM=="DEL":
            # List and prompt for delete
            print("[-] Listing songs added so far")
            for idx, song in enumerate(song_list_to_add):
                print(str(idx+1) + "    " + song[1] + " - " + song[2])
            chosen_no = int(input("[9] No. of the song to delete, 0 for nothing:"))
            if(chosen_no <= 0):
                # do nothing
                print("[-] Not to add")
            elif(chosen_no<=len(song_list_to_add)):
                print("[-] Deleting:", song_list_to_add[chosen_no-1][1], "by", song_list_to_add[chosen_no-1][2])
                del song_list_to_add[chosen_no-1]
        elif COMM=="S" or COMM=="STOP":
            # something
            break
        elif COMM=="L" or COMM=="LIST":
            # List the current song to add to playlist
            print("[-] Listing songs added so far")
            for idx, song in enumerate(song_list_to_add):
                print(str(idx+1) + "    " + song[1] + " - " + song[2])
        else:
            print("[-] Unknown command.")
    
    print("[-] Commiting changes to the playlist", playlist_title, end='')
    add_status = SESSION_AUTH.add_playlist_items(playlist_id, [song[0] for song in song_list_to_add])
    print("    ", add_status)
else:
    err()

# cntr=
# for song in search_results:
#     if(song['resultType'] in ['song','video']):
#         print("Type:", song['resultType'], "Title:", song['title'], "Artist:", song['artists'][0]['name'], "Duration:", song['duration'])
# #add_status = SESSION_AUTH.add_playlist_items(playlistId, [search_results[0]['videoId']])
# #print("Add Status:", add_status)