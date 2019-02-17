# :musical_note: Palbum

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
 - [ ] Add website
 - [x] Build
 - [ ] GitHub release
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

## :raised_hands: Acknowledgments

Icon made by Freepik from [www.flaticon.com](https://www.flaticon.com/free-icon/musical-notes-symbols_11178#term=musical%20note&page=1&position=35)
