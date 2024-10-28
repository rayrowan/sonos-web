# Summary

A simple web interface for Sonos speakers, expandable to add functionality missing in Sonos Apps.

# Web interface - screenshot
![sonos-web-controller](https://github.com/user-attachments/assets/2f772410-baf6-4e23-a42d-aca242698b51)

# Usage
## Controls
- Volume Up / Down
- Play / Pause
- Previous song
- Next song
- Refresh: Retrieve the latest information from Sonos
- Settings: Display the URL of the NodeJS Sonos Controller middleware

## Functions
### Queue / Playlists
Initially the songs on the Sonos queue are displayed. Also all the Sonos playlists are listed.

Single click a playlist to display the songs in that playlist.

Double click a playlist to replace the queue with that playlist.

Move mouse over a song in the playlist to show the location of that music file.

Double click a song in a playlist to move that song into the Queue.

To save the new queue into a playlist, enter the desired playlist name and click the Save icon.

### Folders
The Sonos app provides access to local music folders, however the Sonos API does not. Instead, the NodeJS Sonos Controller middleware can directly access this folder if configured and accessible. See instructions instructions.

Single click a folder to display the songs in that folder.

In addition, it compares the folder to the displayed playlist and highlights any songs in common.

Click Up arrow to go back up a level

# Architecture
3-layers
1. Web interface (in this project). Any web server can deliver these HTML, JS and CSS files.
2. NodeJS controller
3. Sonos SOAP API

# Installation
Copy this folder to a folder on a web server. 
Edit the settings.json

## Prerequisite
- Install NodeJS.
- Install node-sonos-http-api-master from https://github.com/jishi/node-sonos-http-api
- Copy the files from assets into node-sonos-http-api-master/lib/actions
- Replace the file node-sonos-http-api-master\node_modules\sonos-discovery\lib\models\player.js with assets/player.js 
- If using Folders, replace the two occurences of the following line in folderlist.js to point to your music folder
 - -  const directoryPath = '/home/pi/share/music';
- Rebuild the node project
- Start node-sonos-http-api-master
- Test: In a browser on the same machine, enter http://localhost:5050/playlists to see a JSON of all the playlists on your Sonos system.

# To run
Enter the URL for the sonos-web folder in a browser.


