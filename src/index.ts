import {pipe} from 'fp-ts/lib/function';
import * as path from 'path';
import { curry } from './lib/curry';
import express, {Request, Response} from 'express';
import { connectpostgres } from './lib/connectpostgres';
import { getData, getDataFirebase, insertIntoDb, loadCheerio } from './crawl';
import { buildUrlString } from './lib/getDescription';
import { LinkedIn } from './LinkedIn';
import { Seek } from './Seek';

const cors = require('cors');

const PORT: number = 5002; //port number for express
const pool = connectpostgres()

const app = express();  
const linkedin = new LinkedIn();
const seek = new Seek();

app.listen(PORT, ()=> console.log(`app running at ${PORT}`));
app.use(express.static('public'), cors())

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

//Route for crawling data from seek
app.get('/seek/:id?', (req: Request, res: Response) => {
  res.send('seek called');
  getSeek(`https://www.seek.com.au/react-jobs-in-information-communication-technology/in-All-Melbourne-VIC?page=${req.params.id}`);
});

app.get('/linkedin/:id?', (req: Request, res: Response) => {
  res.send('LinkedIn Called');
  getLinkedIn(`https://au.linkedin.com/jobs/search?keywords=react&location=Victoria%2C%20Australia&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=${req.params.id === '1' ? req.params.id : (Number(req.params.id) * 25).toString()}`);
});

app.get('/view/seek', async (req: Request, res: Response) => {
  const data = await getDataFirebase();
  res.send(data)
})

//Get Clicked Job Detail
app.get('/view/detail', async (req:Request, res:Response) =>{
  const href = req.query.href;
  const site = req.query.site;
  const url : string = buildUrlString(href, site);
  const data = pipe(
    url,
    getData,
    loadCheerio,
    linkedin.extractLinkedInJobDescriptions
  )
  // res.setHeader('Content-Type', 'text/html')
  const html = await data;
  res.send(html);
})

function getSeek(url: string){
  const insertSeekIntoDb = curry(insertIntoDb)('seek');
  pipe(
    url,
    getData,
    loadCheerio,
    seek.extractSeekDetails,
    insertSeekIntoDb
  );
}

function getLinkedIn(url:string){
  const insertLinkedinIntoDb = curry(insertIntoDb)('linkedin');
  pipe(
    url,
    getData,
    loadCheerio,
    linkedin.extractLinkedInDetails,
    insertLinkedinIntoDb
  );
}


