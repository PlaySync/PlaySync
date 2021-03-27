import json
import requests
from datetime import date
from auth import spotify_token, spotify_user_id, daily_mix_id

class SaveSongs:
    def __init__(self):
        self.user_id = spotify_user_id
        self.spotify_token = spotify_token
        self.daily_mix_id = daily_mix_id
        self.tracks = ""
        self.new_playlist_id = ""

    
    def find_songs(self):   # Loop through playlist tracks, add them to list

        print("Finding songs in daily mix...")
        query = "https://api.spotify.com/v1/playlists/{}/tracks".format(daily_mix_id)
        response = requests.get(query, headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(self.spotify_token)})

        response_json = response.json()

        for i in response_json["items"]:
            self.tracks += (i["track"]["uri"] + ",")    # creates CSV list of song URI's
        self.tracks = self.tracks[:-1]                  # deletes last comma from the list


    
    def create_playlist(self):  # create a new playlist 

        today = date.today()
        todayFormatted = today.strftime("%m/%d/%Y")

        print("Creating a new playlist...")
        query = "https://api.spotify.com/v1/users/{}/playlists".format(spotify_user_id)
        request_body = json.dumps({
           "name": todayFormatted + " daily mix",
           "description": "Daily mix playlist rescued once again from the brink of destruction by your friendly neighbourhood python script",
           "public": True
        })
        
        response = requests.post(query, data=request_body, headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(self.spotify_token)})

        response_json = response.json()
        return response_json["id"]



    def add_to_playlist(self):  # add all songs to new playlist
        print("Adding songs to playlist...")

        self.new_playlist_id = self.create_playlist()

        query = "https://api.spotify.com/v1/playlists/{}/tracks?uris={}".format(self.new_playlist_id, self.tracks)

        response = requests.post(query, headers={"Content-Type": "application/json",
                                                 "Authorization": "Bearer {}".format(self.spotify_token)})

        print(response.json)



a = SaveSongs()
a.find_songs()
a.add_to_playlist()




