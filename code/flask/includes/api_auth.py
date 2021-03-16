from api.youtube import youtube_music_auth as ytauth

# Return a tuple: (NUMBER_OF_TOKENS, TOKEN1, TOKEN2, ...)

def credential_youtube(auth_header_raw: str):
    return (1, ytauth(auth_header_raw))
