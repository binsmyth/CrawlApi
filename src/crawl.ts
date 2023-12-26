import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { db } from './lib/connectfirestore';
import { collection, getDocs, QuerySnapshot, setDoc, doc, CollectionReference, DocumentData, updateDoc, addDoc, Firestore, Query } from 'firebase/firestore/lite';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { curry } from './lib/curry';
import 'firebase/firestore';
import * as d from 'fp-ts/Date';
import { Request } from 'express';
import { buildUrlString } from './lib/getDescription';
import { LinkedIn } from './LinkedIn';
import { validfirestoredocs } from './lib/validfirestoredocs';
import { ParsedQs } from 'qs';

const linkedin = new LinkedIn();

export interface Job {
    company: string | cheerio.Element ;
    title: string | null | cheerio.Element;
    href: string | undefined | cheerio.Element;
}
interface jobsite extends Job{
    site: string;
}

//A function to getdata from url provided.
export async function getData(url: string) : Promise<E.Either<Error,AxiosResponse<any,any>>>{
    const getjobs = await TE.tryCatch(
        () => axios.get(url),
        (reason)=>new Error(`Couldn't Fetch ${reason}`)
    );
    const result = pipe(getjobs, TE.map((resp) => resp))();
    console.log(await result);
    return result
}

//Takes the response from the url and loads it in cheerio
export async function loadCheerio(response : Promise<E.Either<Error,AxiosResponse<any,any>>>): Promise<cheerio.Root>{
    const res =  await response;
    const htmlForCheerio = pipe(
        res,
        E.match(
            (err) => `Error is ${err}`, // onLeft handler
            (head) => head.data// onRight handler
        )
    )
    return cheerio.load(htmlForCheerio);
}
//Function to get job collection
function getJobCollection(): (A: string)=> CollectionReference<DocumentData>{
   return curry((database:Firestore, collectid: string) => collection(database, collectid))(db);
}
  
  //Inserting job details into Database
export async function insertIntoDb(site: string, jobs: Promise<Job[]>): Promise<void> {
    const curriedJobCollection = getJobCollection();
    const date = d.create();
    const insertFireDb = (date: Date) => async({company, title, href, site}: jobsite) => await setDoc(doc(curriedJobCollection('jobs'),validfirestoredocs(href)), {'company':company, 'title': title, 'href': href, 'site': site, 'crawled_date': date});

    //This puts job details into firebase store
    const jobadd  = (await jobs).map(({ company, title, href })=>{
        return (
            pipe(
                    {company, title, href, site},
                    insertFireDb(date),
                )
        )
    });
    await Promise.all(jobadd);
}

//This is for inserting tech stack into db
export async function insertTechStackIntoDb(req : any, data : any):Promise<void>{
    const curriedJobCollection = getJobCollection();
    const insertFireDb = async(url:string) => await updateDoc(doc(curriedJobCollection('jobs'),validfirestoredocs(url)),{techkeywords:data});
    pipe( 
        req.query.href,
        insertFireDb,
    )
}

//This is for inserting notes into db
export async function insertNotesIntoDb(url: string | string[] | ParsedQs | ParsedQs[] | undefined, data: string | string[] | ParsedQs | ParsedQs[] | undefined){
    const curriedJobCollection = getJobCollection();
    const insertFireDb = async(url:string) => await updateDoc(doc(curriedJobCollection('jobs'),validfirestoredocs(url)),{notes:data});
    pipe(
        url,
        validfirestoredocs,
        insertFireDb
    )
}

//For viewing all database from firebase
export function getDataFirebase (): Promise<any> {
    const curriedJobCollection = getJobCollection();
    const querySnapshot = async (jobCollect: Query<unknown>):Promise<QuerySnapshot<unknown>> => await getDocs(jobCollect);
    const alljobs = async (querySnapshot: Promise<QuerySnapshot<unknown>>) => (await querySnapshot).docs.map((snapshot) => snapshot.data());
    return pipe(
        'jobs',
        curriedJobCollection,
        querySnapshot,
        alljobs
    )
}
//For viewing detail of each jobs
export function getJobDetails (req: Request){
    const href = req.query.href;
    const site = req.query.site;
    const url : string = buildUrlString(href, site);
    const data = pipe(
        url,
        getData,
        loadCheerio,
        linkedin.extractLinkedInJobDescriptions
    )
    return data;
}
