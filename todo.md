# TODO

## Authorization
* Add "Continue as Guest"
* Add more reliable way to store PATs
* If a request returns as not authorized, show modal

## Environments Page
* Add indicator that Deploy went though successfully
* Add better visual indicators that a build is running
* Statuses should have better names (not inProgress)
* Change display to better reflect what's in the Environment
* Heartbeats keep moving around

## Extras
* Automatically update the page as the statuses change

## Sprint Page
* Add "Back to Top" arrow in bottom right corner
* Store sprint query IDs in localstorage for faster responses
* Store folder ID in localstorage for faster query creation

### PBI Panel
* Open PBI panel in center of viewport, not at the top
* Allow for panel to be at bottom of screen
* Allow for click and dragging the panel out
* Add effort and tags to pbi panel

### Display
* Emphasize what's currently in progress
    * Alternatively, de-emphasize what isn't in progress

### PBI
* Make Items Draggable in priority
* After displaying task hours, calculate total time needed and display

### Tasks
* Add ability to delete tasks
* Figure out what to do with tasks that exists in sprints that are not the current sprint (roll-over pbis)
* Bug: Do not display tasks that have been removed
* Bug: Icon for testing tasks should display
* Bug: Adding hours to a new task does not work
* Bug: New task is put at the bottom of list (after Add New)
* Bug: New task icon doesn't show up on refresh
* Add ability to assign a task to a person or self
* Add more variation for people's name colors

## Cleanup
* Remove importing ALL of bootstrap in files

## Config
* Make a config json for each project
* Make the order of heartbeat environments sortable

## Navigation
* Warn the user if they logout
* Display current user

## Extras
### Sprint Page
* Display a burndown chart
* Display current sprint velocity
* Add profile icons to tasks
* Add a link to the original task in TFS

### New Sprint Page
* Set dates
* Set Sprint Name (based off of Sprint # -)
* Set team capacity (days off)

### Changelog Page
* Post a list of recent bugfixes and features