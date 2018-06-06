# Final Milestone 

## Team Information: Sleep Deprived

<b>Matthew Ho</b><br>
• Data Visualization - time chart<br>
• Data Collection - get time data from website, manipulate using whitelist<br>
<br><b>Christal Vo</b><br>
• Main UI Designer - aesthetics, buttons, alerts, popup<br>
• Backend - Chrome storage, whitelist<br>
• Data Collection - gather and manipulate time data<br>
• Data Visualization - progress bar<br>
<br><b>Yoshika Hilke</b><br>
• UI Designer - images, buttons<br>
• Backend - Database (initial), whitelist<br>
• Researcher/Summarizer (milestones, APIs)<br>

## Source Code

<b>background.js</b><br>
Contains a listener to obtain current tab's URL, obtains initial timestamp (point of entering that URL or opening that tab), and updates the database with timestamp and URL information. Also contains functions to add to the whitelist directly, update, and print the whitelist.

<b>manifest.json</b><br>
Required file for our Chrome extention that contains version information, name and description of our extention that is automatically shown in the extention page (or by hovering over the icon of our extention). Sets the default icon, as well as the page actions for our extention (such as the popup), sets background activity (background.js), and sets an options page.

<b>options.html</b><br>
HTML webpage for our options page. Includes references to our bootstrap css files, buttons and options for the user, titles, and divisions. The data on this page is manipulated using options.js.

<b>options.js</b><br>
The primary whitelist manipulating functions (the only other way is through background.js, in which a user can add to their whitelist by adding the site they are currently visiting. options.js contains functions to add to, remove from, or clear the entire whitelist. It also creates a user-friendly table with "X" buttons so a user can easily see and manipulate the items in their whitelist. 

<b>popup.html</b><br>
Contains small icons to navigate our extention: options button, reset database, and progress bar. Defines stylesheets to use for the popup. Data is manipulated using popup.js.

<b>popup.js</b><br>
Contains functions to generate and accurately reflect data on the progress bar, using data from localstorage that has been collected by background.js. Also contains javascript functions for the buttons on the popup: options button, reset database. Popup.js is where the total time spent on websites is "sorted," or, where the website is added to "Play" if not on the whitelist, and added to "Work" if it is in the whitelist. This file also contains functions to calculate total "play" or "work" time, and reflect this on the progres bar. 

<b>style.css</b><br>
Our style sheet for our extention. Contains style definitions for settings icons, add icon (in our popup), and whitelist style.
