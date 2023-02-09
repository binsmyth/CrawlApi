const cheerio = require('cheerio');
const axios = require('axios');
const { Pool, Client } = require('pg');
 
const pool = new Pool({
  user: 'node',
  host: 'localhost',
  database: 'node',
  password: 'vin',
  port: 5432,
})

async function getSeek(num){
    const response = await axios.get(`https://www.seek.com.au/react-jobs-in-information-communication-technology/in-All-Melbourne-VIC?page=${num}`);
    const $ = cheerio.load(response.data);
    const jobtitle = $('[data-automation="normalJob"]');
    jobtitle.each((i, elem) => {
        let jobCompany = $(elem).find('[data-automation="jobCompany"]');
        let jobTitle = $(elem).find('[data-automation="jobTitle"]');
        pool.query(`INSERT INTO job VALUES(\'${jobCompany.html()}\',\'${jobTitle.html()}\',\'${jobTitle.attr('href')}\','seek')`, (err,res) => {
          console.log(err,res);
        })
        console.log(jobCompany.html(),' ' ,jobTitle.attr('href'));
    })
}
async function getLinkedIn(){
    const response = await axios.get('https://au.linkedin.com/jobs/search?keywords=react&location=Victoria%2C%20Australia&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0');
    const $ = cheerio.load(response.data);
    const jobtitle = $('.jobs-search__results-list').find('.base-search-card__title');
    jobtitle.each((i,elem)=>{
      console.log($(elem));
    })
}
getLinkedIn();
let twirlTimer = (function() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 250);
  })();

// setTimeout(()=>{
//     clearInterval(twirlTimer);
//     getSeek(1); 
// }, 5000);
