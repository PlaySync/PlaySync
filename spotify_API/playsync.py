import json
import requests
from datetime import date
from auth import spotify_user_id, daily_mix_id
from refresh import Refresh

class SaveSongs:
    def __init__(self):
        self.user_id = spotify_user_id
        self.spotify_token = ""
        self.daily_mix_id = daily_mix_id
        self.tracks = ""
        self.playlists = ""
        self.new_playlist_id = ""


    # reads in songs from existing playlist on spotify (requires playlist id)
    def find_songs(self):
        print("Finding songs in daily mix...")
        query = "https://api.spotify.com/v1/playlists/"+self.daily_mix_id+"/tracks"
        response = requests.get(query, headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer "+self.spotify_token
        })

        response_json = response.json()

        # print(response)

        for i in response_json["items"]:
            self.tracks += (i["track"]["uri"] + ",")    # creates CSV list of song URI's
        self.tracks = self.tracks[:-1]                  # deletes last comma from the list

        self.add_to_playlist()
    
    # creates a new (empty) playlist in the users library
    def create_playlist(self):  # create a new playlist 

        today = date.today()
        todayFormatted = today.strftime("%m/%d/%Y")

        print("Creating a new playlist...")
        query = "https://api.spotify.com/v1/users/"+spotify_user_id+"/playlists"
        request_body = json.dumps({
           "name": todayFormatted + " daily mix",
           "description": "copy of daily mix playlist",
           "public": True
        })
        
        response = requests.post(query, data=request_body, headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer "+self.spotify_token
        })

        response_json = response.json()
        return response_json["id"]


    # adds songs from a list of tracks to the newly created playlist
    def add_to_playlist(self):
        print("Adding songs to playlist...")

        self.new_playlist_id = self.create_playlist()

        query = "https://api.spotify.com/v1/playlists/"+self.new_playlist_id+"/tracks?uris="+self.tracks

        response = requests.post(
            query,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.spotify_token
        })

        print(response.json)

    # prints all of the users playlists 
    def print_user_playlists(self):

        print("Finding users playlists ...")
        query = "https://api.spotify.com/v1/users/"+self.user_id+"/playlists?limit=50"
        response = requests.get(query, headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer "+self.spotify_token
        })

        response_json = response.json()

        counter = 1
        for i in response_json["items"]:
            print("\t", counter, " ", i["name"], "(", i["tracks"]["total"], "songs )")
            counter += 1
            self.playlists += (i["name"] + ",")             # creates CSV list of playlist URI's
        self.playlists = self.playlists[:-1]                # deletes last comma from the list


    # refreshes access token
    def call_refresh(self):

        print("Refreshing token")
        refreshCaller = Refresh()
        self.spotify_token = refreshCaller.refresh()
        # self.find_songs()
        self.print_user_playlists()
        

a = SaveSongs()
a.call_refresh()

