# Least Played Games Analyzer

This is crude, quick and dirty implementation to determine which games in your collection are. You'll need some programming to skills to get it working at the moment.

This was developed using Node 8.9. Steps to get it working:

* run `npm install`
* change the bggusername in src/bgg.js to your username;
* uncomment the schedule job in the src/index.js file (line 5)
* comment out the analyzer bit (line 6)
* run `npm start`
* it will started syncing with BGG every 5seconds and show what it's doing
* depending on your collection this may take a while
* when it's done syncing it will start playing a "tada" sound every 5seconds 
* turn off the sync by typing `ctr + C`
* comment out the schedule job in the src/index.js file (line 5)
* uncomment the analyzer bit (line 6)
* run `npm start`
* cry when you see how long you haven't played certain games