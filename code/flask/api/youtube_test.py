import sys
from youtube import youtube_music_auth as ytauth

VERBOSE=True

if __name__ == '__main__':
    print("Paste your header here (see https://ytmusicapi.readthedocs.io/en/latest/setup.html#copy-authentication-headers for tutorial):")
    raw_header = sys.stdin.read()

    if VERBOSE:
        print(ytauth(raw_header))

# To Be Finished