import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { db } from './lib/connectfirestore';
import { collection, getDocs, QuerySnapshot, setDoc, doc, CollectionReference, DocumentData } from 'firebase/firestore/lite';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { curry } from './lib/curry';
import 'firebase/firestore';
import * as d from 'fp-ts/Date';

export interface Job {
    company: string;
    title: string | null;
    href: string | undefined;
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
   return curry((database:any, collectid: any) => collection(database, collectid))(db);
}
  
  //Inserting job details into Database
export async function insertIntoDb(site: string, jobs: Promise<Job[]>): Promise<void> {
    const curriedJobCollection = getJobCollection();
    const date = d.create();
    const insertFireDb = (date: Date) => async({company, title, href, site}: jobsite) => await setDoc(doc(curriedJobCollection('jobs'),`${href}`.replace(/\D/g, "")), {'company':company, 'title': title, 'href': href, 'site': site, 'crawled_date': date});

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

//For viewing all database from firebase
export function getDataFirebase (): Promise<any> {
    // const jobCollection = (database:any , collectid:any) => collection(database, collectid);
    // const curriedJobCollection = curry(jobCollection)(db);
    const curriedJobCollection = getJobCollection();
    const querySnapshot = async (jobCollect:any):Promise<QuerySnapshot<unknown>> => await getDocs(jobCollect);
    const alljobs = async (querySnapshot:any) => (await querySnapshot).docs.map((snapshot:any) => snapshot.data());
    return pipe(
        'jobs',
        curriedJobCollection,
        querySnapshot,
        alljobs
    )
}
