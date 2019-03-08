# :musical_note: Palbum

> Resume playing Spotify back from where you left

Palbum gives you control to play an album/playlist from where you left by showing you a list of the most recent played tracks.

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

### :waxing_crescent_moon: Dark mode

<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/dark-mode.png" width="512"></div>

### :dizzy: Multi-platform

<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/operating-systems.png" width="450"></div>

### :bowtie: Intuitive

<div align="center"><img src="https://antonio-ramadas.github.io/palbum/images/intuitive.gif" width="450"></div>

### :runner: Shortcuts

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

### Tech stack

### Installation

### Scripts

### How does Palbum work?

### How to contribute?

## :question: F.A.Q.

<details>
<summary>I am listening a song and it does not appear on Palbum</summary>
</details>

<details>
<summary>What permissions from Spotify do I need to give?</summary>

 - [`user-read-currently-playing`](https://developer.spotify.com/documentation/general/guides/scopes/#user-read-currently-playing)

 - [`user-read-recently-played`](https://developer.spotify.com/documentation/general/guides/scopes/#user-read-recently-played)

 - [`user-modify-playback-state`](https://developer.spotify.com/documentation/general/guides/scopes/#user-modify-playback-state)
</details>

<details>
<summary>What information do you or the app holds about me?</summary>

None! That is why even the keys to communicate with the Spotify API are on your side. Palbum itself does not even collect any usage metrics.
</details>

<details>
<summary>I see that you use a proxy on the authentication process.</summary>

When you login through the app, Spotify needs to know what app is asking for your permissions. This process requires a password and I need to protect it from outsiders. So, I have a proxy that just adds this information to your request. The code for the proxy server is [open source](https://github.com/antonio-ramadas/spotify-proxy-oauth2)! This proxy server does not store any information and serves a single purpose while respecting your privacy.
</details>

<details>
<summary>Are there any leftovers after removing the app?</summary>

Yes, there most likely will be. Palbum creates a single file to store your access and refresh keys to communicate with the Spotify API. Even after uninstalling the app the file will remain there. Deleting this file is the same as a complete reset. The app will simply start from the start. If you do want to remove any leftovers, then remove the folder `palbum` under this directory:

 - `%APPDATA%` on Windows

 - `$XDG_CONFIG_HOME` or `~/.config` on Linux

 - `~/Library/Application Support` on macOS
</details>

<details>
<summary>Why did you do this?</summary>

I listen to Spotify at work and I choose a playlist according to my mood or the mood I want to be. It so happens that each mood has multiple playlists and I kept changing. After some time, I grew tired of after switching from one playlist and going back to another, I had to remember what track I was listening to. I had found no solutions online and decided to put my skills into practice.

> _Skip this part if you do not want to know the geeky details._
>
> I already had some experience with [Electron](https://electronjs.org), but none with [React](https://reactjs.org). Where I work we use React and since I am a junior developer that only had been working for a couple of months, I decided to do a small project to understand React better and make smart decisions at work. At the time, I knew React did much more than I intended and still believe this, but I wanted to learn more. It is not a choice I regret. Actually, I am happy I did it and how much I have learn until now.

After implementing this project, I noticed there are [at least 1099 votes for a native Spotify feature](https://community.spotify.com/t5/Live-Ideas/All-Platforms-Remember-Position-in-Playlist-Album/idi-p/55725#comments) that does what Palbum is doing. At the time I am writing this, this feature has 269 comments and is the 75th most voted request out of 1620! I am happy to see that I am not the only one and that I have made something that is helpful to others until Spotify implements it.
</details>

## :construction: Work In Progress
 - [x] Add Spotify logic (remember the number in album/playlist of the song currently playing and resume it from there) 
 - [x] Add list of albums/playlists
 - [x] Add shortcuts (global, arrows, selection, search)
 - [ ] Improve [README.md](README.md)
 - [x] Add settings?
 - [x] Start at login
 - [x] Dark Mode
 - [x] Fix TODOs
 - [x] Refactor
 - [x] Add website
 - [x] Build
 - [x] GitHub release
 - [ ] Collect feedback from family and friends
 - [ ] Advertise ([Product Hunt](https://www.producthunt.com), [Hacker News](https://news.ycombinator.com), Reddit, ...)

## :beetle: Known issues
 - Spotify access token is refreshed 5 seconds before the timeout. This can cause bad requests if the request is slow.
 - OS that are not Mac or Windows (i.e., linux) do not have a right-click event on the tray/dock icon. As such, the buttons to quit and control the if the application should launch at login are not shown.
   - ~~It is worth mentioning that the application opens at login by default and these users will not have an easy task to control this.~~
 - OS that are not Mac or Windows (i.e., linux) do not have an auto-launch option. Check [_startup.js_](public/startup.js) for further information.
 - Project structure should be improved. All electron code lives in [_public/_](public).
 - Uninstalling/Removing the app may leave leftovers. The file created by [electron-store](https://www.npmjs.com/package/electron-store) is never deleted.
 - App bundle is too big for such tiny execution. Moving away from electron can lead to improvements, but let's first figure out the waste and cut it out.
 - Missing auto-updater. I haven't done this, because it is required a paid developer account. (If you know a way, share it!)
 - I like the UX, but not so much about the UI. I can think of some tweaks about HTML and CSS positioning, but I think the colors play a bigger role here.
 - The icon on Windows may look invisible. The dock by default is dark and the app icon is dark.
 - Error handling is hidden from the user. You can see some `console.warn()` and `console.error()` spread around the code. Arguably, all outputs should be shown, but some probably should like when authentication fails.
 - Clicking outside the div with id `root` will disable the event listeners until the user clicks inside.

## :man_technologist: Project decisions
 - Given the bulk size of the app, I try to cut down external packages that add little value, but sometimes carry several dependencies. Often they are safer, but it is also often the case that there is no need for this case. So, sometimes you can see code that does the same like other packages. However, if you do not agree with this in any place, please say so because I may have overlooked.
 - Color of Windows icon: 5, 107, 184 (R, G, B)

## :raised_hands: Acknowledgments

Icon made by Freepik from [www.flaticon.com](https://www.flaticon.com/free-icon/musical-notes-symbols_11178#term=musical%20note&page=1&position=35)

Inspiration from [Caprine](https://sindresorhus.com/caprine/)
