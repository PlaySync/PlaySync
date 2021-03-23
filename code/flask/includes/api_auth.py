from api.youtube import youtube_music_auth

# Return a tuple: (NUMBER_OF_TOKENS, TOKEN1, TOKEN2, ...)

def credential_youtube(auth_header_raw: str):
    return (1, youtube_music_auth(auth_header_raw))
