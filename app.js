var http = require("http");
var cheerio = require('cheerio');
var baseUrl = "http://www.theawl.com/page/";

var allPostTitles = [];

function getPage(pageNum){
  var request = http.get(baseUrl+pageNum, function(response){
    var body = "";
    response.on('data', function(chunk){
      body += chunk;
    });

    response.on('end', function(){
      var page = cheerio.load(body);
      var posts = page("div.reverse-chron__post h2 a");
      // console.log(posts[1]['children'][0]['data']);

      var post_titles = [];
      var i = 0;
      while(i< posts.length){
        post_titles.push(posts[i]['children'][0]['data']);
        i = i + 1;
      }
      console.dir(post_titles);
      allPostTitles.concat(post_titles);
    });

  });
}

var i = 1;
var totalPagesToScrape = 10;
while (i < totalPagesToScrape){
  var thisPagePostTitles = getPage(i);
  i = i + 1;
}


// console.log(allPostTitles);
