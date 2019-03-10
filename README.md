# :musical_note: Palbum

> Resume playing Spotify back from where you left

Palbum gives you control to play an album/playlist from where you left by showing you a list of the most recently played tracks.

**[Website](https://antonio-ramadas.github.io/palbum)**

<a href="https://github.com/antonio-ramadas/palbum/releases/latest">
<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/browsing-through-list.gif" width="400"></div>
</a>

<details>
<summary>Extended example (±30 seconds)</summary>
<a href="https://github.com/antonio-ramadas/palbum/releases/latest">
<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/usage.gif" width="1280"></div>
</a>
</details>

## :sparkles: Features

### Dark mode

<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/dark-mode.png" width="512"></div>

### Multi-platform

<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/operating-systems.png" width="450"></div>

### Intuitive

<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/intuitive.gif" width="450"></div>

### Shortcuts

<table align="center">
  <thead>
    <tr>
        <th>Shortcut (Mac)</th>
        <th>Shortcut (Windows/Linux)</th>
        <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>&#8984; + M</td>
        <td>ctrl + M</td>
        <td>Show/Hide window</td>
    </tr>
    <tr>
        <td>&#8984; + D</td>
        <td>ctrl + D</td>
        <td>Toggle dark mode</td>
    </tr>
    <tr>
        <td colspan="2">Arrow/tab keys or mouse wheel</td>
        <td>Scroll list</td>
    </tr>
    <tr>
        <td colspan="2">Enter or left click</td>
        <td>Play</td>
    </tr>
    <tr>
        <td colspan="2">Right click on the icon</td>
        <td>Quit and other options</td>
    </tr>
    </tbody>
</table>

## :man_technologist: Development

### Requirements

Palbum works on macOS, Windows and Linux. You are able to develop on any of these platforms.

Palbum is a JavaScript application, so you need [Node.js](https://nodejs.org/en/) since `v10.15.1`.

### Tech stack

Palbum is split into two. The backend is built on top of [Electron](https://electronjs.org) which creates a server on port 1995 for the authentication process. The frontend uses [React](https://reactjs.org) which creates a server on port 3000 while on development.

There are also a bunch of files on the root of the repository which are [explained on one of my other repositories](https://github.com/antonio-ramadas/my-javascript-boilerplate).

The authentication is made with a [proxy server](https://github.com/antonio-ramadas/spotify-proxy-oauth2) and a [Spotify authentication module](https://github.com/antonio-ramadas/spotify-authentication). The server is used to hide app credentials. Given that the code is open source, you can deploy your own server with your own credentials. The module used for authentication is used to make a valid Spotify authentication request which goes through the proxy server so it can add the necessary data (i.e., the credentials).

If you want to deploy your own server, then, in case you use [spotify-proxy-oauth2](https://github.com/antonio-ramadas/spotify-proxy-oauth2), you need to set the following environment variables after creating a Spotify app:
 - `CLIENT_ID`
   - The ID of your Spotify app

 - `CLIENT_SECRET`
   - The secret of your Spotify app

 - `REDIRECT_URI`
   - The URI which Spotify should redirect the user to after the authentication process. Please be aware you need to add the URI to the list of redirects of your Spotify app.

 - `SCOPE`
   - For Palbum you need `user-read-currently-playing user-read-recently-played user-modify-playback-state`

### Installation

Navigate to the root of this repository and run `npm install` on your terminal. You have now all the required node modules and you are able to run any of the [npm scripts](#npm-scripts). After installing, a [git hook is created to test for any lint errors before any commit](git-hooks/pre-commit.sh). Given the small size of the project, it should not take more than a couple of seconds.

### How does Palbum work?

Palbum is a very simple app that runs on the user toolbar/menubar. It retrieves the most recently played tracks using the [spotify-context-history](https://github.com/antonio-ramadas/spotify-context-history) module. Afterwards, every 30 seconds a new request is made through this module to Spotify to check for any new updates. This data is then merged with the existent tracks on Palbum. The _play_ action is also made with this module. The access key is refreshed on the background. If there is any problem while updating the keys, the authentication is restarted. If the authentication does not work, then Palbum quits.

Electron and React use [Inter Process Communication](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md) to request/retrieve data (e.g., dark mode state and list of tracks) between each other.

### Project decisions

 - Given the bulk size of the app, I tried to cut down external packages that add little value and carry several dependencies. So, sometimes you can see code that does the same as other packages. However, if you do not agree with this in any place, please say so because I may have overlooked.

 - The colour of Windows icon is: 5, 107, 184 (R, G, B)
   - The default icon is all black and becomes invisible in the default Windows theme.

## :question: F.A.Q.

<details>
<summary>If I play Spotify on my phone, will they also appear on Palbum?</summary>

Yes! The information is retrieved from Spotify and it does not matter where you listen.
</details>

<details>
<summary>I'm listening to Spotify on my phone, can I use Palbum to change tracks?</summary>

Yes! Palbum will play what you chose on an active player and it does not matter which one it is.
</details>

<details>
<summary>I am listening/listened to a song and it does not appear on Palbum</summary>

There a multiple reasons for this to happen:

 - Spotify only adds a track to the most recently played after listening to [for more than 30 seconds](https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/)

 - [Spotify only returns the 50 most recently played tracks](https://github.com/spotify/web-api/issues/20). If you keep Palbum running then you may well see over 50 tracks, because Palbum stores them in cache. If you restart the app, then you'll see at most 50 tracks, because the cache is discarded.
</details>

<details>
<summary>Spotify is not playing any of the tracks I choose</summary>

Try this: play any track on Spotify where you want to listen and then try again. If it worked, you can stop reading. If it did not, then continue.

> Side note: this solution may work because Spotify requires an active player (i.e., you must have an active Spotify session on any of your devices). I suspect this requirement is derived to the complicated nature it can be for Spotify to guess where you want to listen if you are not listening anywhere.

Now answer this: Do you have a premium account? If you **do**, then you most likely discovered a bug. Report it by [opening an issue](https://github.com/antonio-ramadas/palbum/issues/new). If you **don't** have a premium account, then I am aware of this [limitation imposed by Spotify](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/) and I'm trying to figure out a solution.
</details>

<details>
<summary>What permissions from Spotify do I need to give?</summary>

 - [`user-read-currently-playing`](https://developer.spotify.com/documentation/general/guides/scopes/#user-read-currently-playing)

 - [`user-read-recently-played`](https://developer.spotify.com/documentation/general/guides/scopes/#user-read-recently-played)

 - [`user-modify-playback-state`](https://developer.spotify.com/documentation/general/guides/scopes/#user-modify-playback-state)
</details>

<details>
<summary>What information do you or the app holds about me?</summary>

None! That is why even the keys used to communicate with the Spotify API are on your side. Palbum itself does not even collect any usage metrics.
</details>

<details>
<summary>I see that you use a proxy on the authentication process.</summary>

When you log in through the app, Spotify needs to know what app is asking for your permissions. This process requires a password and I need to protect it from outsiders. So, I have a proxy that just adds this information to your request. The code for the proxy server is [open source](https://github.com/antonio-ramadas/spotify-proxy-oauth2)! This proxy server does not store any information and serves a single purpose while respecting your privacy.
</details>

<details>
<summary>Are there any leftovers after removing the app?</summary>

Yes, there most likely will be. Palbum creates a single file to store your access and refresh keys to communicate with the Spotify API. Even after uninstalling the app the file will remain there. Deleting this file is the same as a complete reset. The app will simply start as new. If you do want to remove any leftovers, then remove the folder `palbum` under this directory:

 - `%APPDATA%` on Windows

 - `$XDG_CONFIG_HOME` or `~/.config` on Linux

 - `~/Library/Application Support` on macOS
</details>

<details>
<summary>Why did you do this?</summary>

I listen to Spotify at work and I choose a playlist according to my mood or the mood I want to be. It so happens that each mood has multiple playlists and I kept changing. After some time, I grew tired of having to remember what track I was listening to after switching from one playlist and going back to another. I had found no solutions online and decided to put my skills into practice.

> _Skip this part if you do not want to know the geeky details._
>
> I already had some experience with [Electron](https://electronjs.org), but none with [React](https://reactjs.org). Where I work we use React and since I am a junior software engineer that only had been working for a couple of months, I decided to do a small project to have a deeper understanding of  React and make better decisions at work. At the time, I knew React did much more than I intended and still believe this, but I wanted to learn more. It is not a choice I regret. Actually, I am happy I did it and how much I have learned until now.

After implementing this project, I noticed there are [at least 1099 votes for a native Spotify feature](https://community.spotify.com/t5/Live-Ideas/All-Platforms-Remember-Position-in-Playlist-Album/idi-p/55725) that does what Palbum is doing. At the time I am writing this, this feature has 269 comments and is the 75th most voted request out of 1620! I am happy to see that I am not the only one and that I have made something that is helpful to others until Spotify implements it.
</details>

## :raised_hands: Acknowledgments

Icon made by Freepik from [www.flaticon.com](https://www.flaticon.com/free-icon/musical-notes-symbols_11178#term=musical%20note&page=1&position=35)

Website and README.md inspiration from [Caprine](https://sindresorhus.com/caprine/)
