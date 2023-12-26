import {pipe} from 'fp-ts/lib/function';
import * as path from 'path';
import { curry } from './lib/curry';
import express, {Request, Response} from 'express';
import { connectpostgres } from './lib/connectpostgres';
import { getData, getDataFirebase, getJobDetails, insertIntoDb, insertNotesIntoDb, insertTechStackIntoDb, loadCheerio } from './crawl';
import { LinkedIn } from './LinkedIn';
import { Seek } from './Seek';
import { matchKeywords, uniqueKeywords } from './lib/techstackwords';
import { Hono } from 'hono';


const cors = require('cors');

const PORT: number = 5002; //port number for express

const app1 = new Hono();
const app = express();  
const linkedin = new LinkedIn();
const seek = new Seek();

app.listen(PORT, ()=> console.log(`app running at ${PORT}`));
app.use(express.static('public'), cors())

app1.get('/app',(c) => {
  // const { id } = c.req.param();
  // seek.getSeek(`https://www.seek.com.au/react-jobs-in-information-communication-technology/in-All-Melbourne-VIC?page=${id}`);
  return c.text('hello');
})

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Route for crawling data from seek
app.get('/seek/:id?', (req: Request, res: Response) => {
  res.send('seek called');
  seek.getSeek(`https://www.seek.com.au/react-jobs-in-information-communication-technology/in-All-Melbourne-VIC?page=${req.params.id}`);
});

app.get('/linkedin/:id?', (req: Request, res: Response) => {
  res.send('LinkedIn Called');
  linkedin.getLinkedIn(`https://au.linkedin.com/jobs/search?keywords=react&location=Victoria%2C%20Australia&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=${req.params.id === '1' ? req.params.id : (Number(req.params.id) * 25).toString()}`);
});

//To view all datas stored in firebase
app.get('/view', async (req: Request, res: Response) => {
  const data = await getDataFirebase();
  res.send(data)
})

//To edit notes for jobs
app.get('/edit/notes', (req: Request, res: Response) =>{
  insertNotesIntoDb(req.query.href,req.query.value);
  res.send('added notes');
})

//Get Clicked Job Detail
app.get('/view/detail', async (req:Request, res:Response) =>{
  const data = getJobDetails(req);
  const html = await data;
  res.send(html);
})

//This is for getting tech stack when user clicks. It also inserts into firebase
app.get('/get/tech-stack', async(req:Request, res:Response)=>{
  const data = getJobDetails(req);
  const html = await data;
  //insert tech-stack into friebase ...function needed
  setTimeout(()=>console.log('for 1 second limitation of firestore because '), 2000)
  insertTechStackIntoDb(req,pipe(html, matchKeywords,uniqueKeywords));
  res.send(matchKeywords(html));
})