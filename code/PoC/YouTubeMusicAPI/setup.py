#!/usr/bin/env python3

from ytmusicapi import YTMusic

# Interactively input header, save the auth JSON to a file
YTMusic.setup(filepath=headers_auth.json)

# Non-interactively input header, save to file
YTMusic.setup(filepath=headers_auth.json, headers_raw="<headers copied above>")

# Non-interactively capture the JSON as return
JSON_AUTH = YTMusic.setup(headers_raw="<headers copied above>")
