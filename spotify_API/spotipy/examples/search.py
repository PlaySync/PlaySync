# shows artist info for a URN or URL

from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
import sys
import pprint

# sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="594f76094a6240e29ab5613ff3f4cf7f", client_secret="76e4f1e062db46d9be7a29a0d3194ad2"))

if len(sys.argv) > 1:
    search_str = sys.argv[1]
else:
    search_str = 'Radiohead'

sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())
result = sp.search(search_str)
pprint.pprint(result)
