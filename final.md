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

<b>package.json</b><br>

<b>package-lock.json</b><br>

<b>popup.html</b><br>

<b>popup.js</b><br>

<b>style.css</b><br>
