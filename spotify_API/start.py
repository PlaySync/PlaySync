import spotipy
import sys
from spotipy.oauth2 import SpotifyClientCredentials

# ------------------------------------------------------------

def search():
    search_str = input("Enter something to search for: ")
    limit = input("Enter result limits: ")

    results = sp.search(q=search_str, limit=limit)
    for idx1, track in enumerate(results['tracks']['items']):
        print("\t", idx1, track['name'])
    print()

# ------------------------------------------------------------

def artist_search(): 
    search_str = input("Enter name to search for: ")

    results = sp.search(q='artist:' + search_str, type='artist')
    items = results['artists']['items']
    if len(items) > 0:
        artist = items[0]
        print("\t", artist['name'], artist['uri'])

# ------------------------------------------------------------

def song_search(): 
    search_str = input("Enter song to search for: ")

    results = sp.search(q='song:' + search_str, type='song')
    items = results['songs']['items']
    if len(items) > 0:
        song = items[0]
        print("\t", song['name'], song['uri'])

# ------------------------------------------------------------
  
def user_playlists():
    if len(sys.argv) > 1:
        username = sys.argv[1]
    else:
        username = input("Enter user ID: ")

    playlists = sp.user_playlists(username)
    for playlist in playlists['items']:
        print("\t", playlist['name'])
    print()

# ------------------------------------------------------------

def exit_program():
    exit()

# ------------------------------------------------------------

def switch():
    print("Menu:")
    print("1: General Search")
    print("2: Artist Search")
    print("3: Get users playlists")
    print("4: Exit")
    
    option = int(input("Input number: "))

    def default(): print("Incorrect option")

    dict = {
        1 : search,
        2 : artist_search,
        3 : user_playlists,
        4 : exit_program,
    }
    dict.get(option,default)() # get() method returns the function matching the argument

# ------------------------------------------------------------

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="594f76094a6240e29ab5613ff3f4cf7f", client_secret="76e4f1e062db46d9be7a29a0d3194ad2"))
while(1):
    switch() # Call switch() method

