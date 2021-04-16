# Team PlaySync

Building a cross-platform Playlist Synchronization Toolset

### Description

PlaySync, as proposed, is a software tool to migrate/synchronize playlists across multiple music streaming platforms. These platforms currently include Spotify and YouTube Music (Apple Music, Pandora, Amazon Music, Beatport, LastFM, etc. to be implemented). The tool will prompt users to log in to their respective platform accounts and specify which platform they wish to migrate from and which to migrate to. It will then ask the user to specify which playlists they wish to migrate. It will also allow users to view the contents of each playlist before transferring.

The software will allow users to sync their playlists across platforms. Other features (that are not yet implemented) include the option to do a one-time sync or have their playlists sync automatically during a given time interval whenever changes to their playlist are made, as well as the option to share playlists with other users.

### Platform Authentication

*Playsync is not responsible for any lost music during playlist transfer. By allowing platform authentication, the user allows Playsync access to all public and private playlists as well as access to read/write to the user's music library*.

#### Spotify Authentication:

Once the user is registered and logged in, navigate to the Profile Page > Spotify tab on the left-hand side. Select 'Login Using Spotify' then login with a registered Spotify account. Playsync will request access to the account. Select 'Allow'. The Spotify account is now registered. 

#### YoutubeMusic Authentication:

Once the user is registered and logged in, navigate to the Profile Page > Youtube Music tab on the left-hand side. In another tab, login with a registered YoutubeMusic account. Nagivage to the Library page, then right-click the page and select 'Inspect'. Select the 'Network' tab on the top of the page, then select 'Headers'. Scroll down to the 'Request Headers' section and copy all of the text below 'accept: */*'. Paste this code in the 'Raw Header' text box on the Profile Page > Youtube Music page. The YoutubeMusic account is now registered. 

### Playlist Transfer

Nagivate to the 'Transfer' page. On the left side, select the source platform to tranfer **from**. Select the playlists to be transfered. Once a valid playlist is selected, select the destintion platform to transfer **to**. Enter a playlist title and description (optional). On the right-hand side, select the songs within in the playlist to be transfered, from the drop down menu of matching songs. Once all desired songs and playlists are selected, select 'Tranfer'. All selected songs and playlists will be transfered to a newly created playlist on the destination platform.  

### Repository Structure

- `code` - Project-related codeworks
- `meeting` - Meeting notes/logs, either with TA or team discussion
- `milestone` - Milestone submissions
- `design/wireframes ` - Wireframe designs and frontend layout
