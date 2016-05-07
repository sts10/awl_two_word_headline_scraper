var http = require('http');
var cheerio = require('cheerio');
var baseUrl = "http://www.theawl.com/page/";
var csv = require('ya-csv'),  
fs = require('fs');

var allPostTitles = [];

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
      console.log("childen:");
      console.log(posts[1]["attribs"]['href']);

      var post_titles = [];
      var i = 0;
      while(i < posts.length){
        var postTitle = posts[i]['children'][0]['data'];
        if (postTitle.split(" ").length == 2 && postTitle.split(' ')[1].indexOf('"') == -1) {
          var postURL = posts[i]['attribs']['href'];
          var postInfo = [postTitle, postURL];

          writer.writeRecord(postInfo);
          post_titles.push(postTitle);
        }
        i = i + 1;
      }
      // console.dir(post_titles);
      allPostTitles.concat(post_titles);
    });

  });
}

var i = 1;
var totalPagesToScrape = 2000;
while (i < totalPagesToScrape){
  var thisPagePostTitles = getPage(i);
  i = i + 1;
}


console.log("bottom of the file");
// console.log(allPostTitles);
