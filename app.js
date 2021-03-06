var http = require('http');
var cheerio = require('cheerio');
var csv = require('ya-csv'),  
fs = require('fs');

var baseUrl = "http://www.theawl.com/page/";

var writer = csv.createCsvStreamWriter(fs.createWriteStream('test_headlines.csv', {'flags': 'a'}));  

function getPage(pageNum){
  var request = http.get(baseUrl+pageNum, function(response){
    var body = "";
    response.on('data', function(chunk){
      body += chunk;
    });

    response.on('end', function(){
      var page = cheerio.load(body);
      var posts = page("div.reverse-chron__post h2 a");

      var i = 0;
      while(i < posts.length){
        if (posts[i]['children'][0] && posts[i]['children'][0]['data']){
          var postTitle = posts[i]['children'][0]['data'];
          if (postTitle.split(" ").length == 2 && postTitle.split(' ')[1].indexOf('"') == -1) {
            var postURL = posts[i]['attribs']['href'];
            var postInfo = [postTitle, postURL];

            writer.writeRecord(postInfo);
          }
        }
        i = i + 1;
      }
    });

  });
}

var i = 1;
var totalPagesToScrape = 2705;

var interval = setInterval(function(pageToScrape){
  getPage(i);
  console.log("ran the interval for the " + i + " time.");
  i = i + 1;
  if (i == totalPagesToScrape){
    clearInterval(interval);
  }
}, 1000, i);


