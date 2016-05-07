// Problem: Need to get badge count and JavaScript points
// Solution: Use node.js to connect to Treehouse's JSON API to get profile information and print it out.

var http = require("http");
var https = require("https"); 
// var username = "samschlinkert";

function printMessage(username, badgeCount, points) {
  var message = username + " has " + badgeCount + " total badge(s) and " + points + " points in JavaScript.";
  console.log(message);
}

function printError(error){
  console.error(error.message);
};
// Connect to the API URL (http://teamtreehouse.com/username.json)
// or (https://teamtreehouse.com/username.json)

function get(username){
  var request = https.get("https://teamtreehouse.com/"+username+".json", function(response){
    // console.log(response.statusCode);
    // Read the data
    body = "";
    response.on('data', function(chunk){
      body+= chunk;
    });

    response.on('end', function(){
      if(response.statusCode === 200){
        // cool, got a 200
        try {
          // Parse the data (Converting string into an object)
          var profile = JSON.parse(body);
          // profile now a big object 
          // Print the data
          printMessage(username, profile.badges.length, profile.points.JavaScript);
        } catch (error){
          //If we get a parse Error
          printError(error);
        }
      } else {
        // If we get a Status Code Error (i.e. not 200)
        printError({message: "There was an error getting the profile of " + username+". (" + http.STATUS_CODES[response.statusCode] +")"});
      }
    });

  });
  // if we get a Connection Error (yet another kind of error...)
  request.on("error", printError)
}

// make this file's `get` function accessible as a module, and have other files call it get. The 1st `get` is what other files will use to call the function. 
module.exports.get = get;
