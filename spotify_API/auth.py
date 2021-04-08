# SPOTIPY_CLIENT_ID='594f76094a6240e29ab5613ff3f4cf7f'
# SPOTIPY_CLIENT_SECRET='76e4f1e062db46d9be7a29a0d3194ad2'
# set SPOTIPY_REDIRECT_URI='https://playsync.me/'

# GET https://accounts.spotify.com/authorize?client_id=594f76094a6240e29ab5613ff3f4cf7f&response_type=code&redirect_uri=https%3A%2F%2Fplaysync.me%2F&scope=playlist-modify-public%20playlist-modify-private%20user-library-read%20playlist-read-private
# curl -H "Authorization: Basic NTk0Zjc2MDk0YTYyNDBlMjlhYjU2MTNmZjNmNGNmN2Y6NzZlNGYxZTA2MmRiNDZkOWJlN2EyOWEwZDMxOTRhZDI=" -d grant_type=authorization_code -d code=AQBsvaPYDs2oB6iMggN6dkbbSNfBCH9HGk9MDhU-xPBMm8tUBsluibzrRMQ1ugpXsjn9WiCZUorm9Qg3Bar4T900FTQieuVOBPvmElkYFp0ly-G5sL3M4wbenE2rvAUSd1KjCYmJwY5FbB_91VPPK-Qx9lUAY8ZR371LUrKezZ7ngaXg9RnF_tXEidSgv8BezuA4i_vagUoCuBhRq2BBe3mb4LCDXeF3ljJdU9ccNVYbE3z5tK0SwICljdZCrCzvQt4Mr4OoalPIcNKrPcUc_EsT5A -d redirect_uri=https%3A%2F%2Fplaysync.me%2F https://accounts.spotify.com/api/token --ssl-no-revoke
# 594f76094a6240e29ab5613ff3f4cf7f:76e4f1e062db46d9be7a29a0d3194ad2 --> client_id:client_secret
# NTk0Zjc2MDk0YTYyNDBlMjlhYjU2MTNmZjNmNGNmN2Y6NzZlNGYxZTA2MmRiNDZkOWJlN2EyOWEwZDMxOTRhZDI= --> base 64 encode
# code = AQBsvaPYDs2oB6iMggN6dkbbSNfBCH9HGk9MDhU-xPBMm8tUBsluibzrRMQ1ugpXsjn9WiCZUorm9Qg3Bar4T900FTQieuVOBPvmElkYFp0ly-G5sL3M4wbenE2rvAUSd1KjCYmJwY5FbB_91VPPK-Qx9lUAY8ZR371LUrKezZ7ngaXg9RnF_tXEidSgv8BezuA4i_vagUoCuBhRq2BBe3mb4LCDXeF3ljJdU9ccNVYbE3z5tK0SwICljdZCrCzvQt4Mr4OoalPIcNKrPcUc_EsT5A


# {
#     "access_token":"BQBMoZLj7qzkN8oFbWf3tg7R41PGRgfG9pF2dgZER9F_fs0lPiI02RmvakMf8MGrweif5W19PgneSXdMWv-Vfcbf4W7Nrz3eThly4O_4WHhTAqh48sg8ttao4sdFqsCjeKQwWHqMLIipUKSvxetsyS8laAqq56Fiyory9LseWBLgIij5eDENk5j2R7tYxpOxbnSDYYlJ4SnZ7YDcKnemAGAf4aKDFAOQmFh9f5kZsPCSdiks4gXX",
#     "token_type":"Bearer",
#     "expires_in":3600,
#     "refresh_token":"AQBa6mDeuPuEx77BPRI99L3QON7I5tUFKhGqEM4P88Pe8f3Cqxtbv36ERzW6fRbJ5LE-Zt7fZtfQFx-otUUPhOqvjbSuTr01x7osQbAZ2xsyYZED0heGmZy222srQTednf4",
#     "scope":"playlist-read-private user-library-read playlist-modify-private playlist-modify-public"
# }

#  =========================================================================================================================================================================

import requests

# same for each user (allows access to spotify)
refresh_token = 'AQBa6mDeuPuEx77BPRI99L3QON7I5tUFKhGqEM4P88Pe8f3Cqxtbv36ERzW6fRbJ5LE-Zt7fZtfQFx-otUUPhOqvjbSuTr01x7osQbAZ2xsyYZED0heGmZy222srQTednf4'
base_64 = 'NTk0Zjc2MDk0YTYyNDBlMjlhYjU2MTNmZjNmNGNmN2Y6NzZlNGYxZTA2MmRiNDZkOWJlN2EyOWEwZDMxOTRhZDI'

spotify_user_id = '28if7yjhp3m84t3329ql7lviw'           # different for each user 

daily_mix_id = '37i9dQZF1E3alGd4eiuDlY'                 # ignore this



# https://accounts.spotify.com/authorize?client_id=594f76094a6240e29ab5613ff3f4cf7f&response_type=code&redirect_uri=https%3A%2F%2Fplaysync.me%2F&scope=playlist-modify-public%20playlist-modify-private%20user-library-read%20playlist-read-private
# this link gives playsync access to users public and private playlists (both read and modify), as well as their saved songs 