import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { db } from './lib/connectfirestore';
import { collection, getDocs, QuerySnapshot } from 'firebase/firestore/lite';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { curry } from './lib/curry';
import 'firebase/firestore';
import { connectfirestoreadmin } from './lib/connectfireadmin'

const dbadmin = connectfirestoreadmin();

export interface Job {
    company: string;
    title: string | null;
    href: string | undefined;
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
  
  //Inserting job details into Database
export async function insertIntoDb(site: string, jobs: Promise<Job[]>): Promise<void> {
    const alljobs = await jobs;
    const insertFireDb = async({company, title, href, site} : any) => await dbadmin.collection('jobs').doc(`${href}`.replace(/\D/g, "")).set({'company':company, 'title': title, 'href': href, 'site': site});
    //This puts job details into firebase store
    const jobadd  = alljobs.map(async({ company, title, href })=>{
        return (
            pipe(
                    {company, title, href, site},
                    insertFireDb
                )
        )
    });
    await Promise.all(jobadd);
}



//For viewing all database from firebase
export function getDataFirebase (): Promise<any> {
    const jobCollection = (database:any , collectid:any) => collection(database, collectid);
    const curriedJobCollection = curry(jobCollection)(db);
    const querySnapshot = async (jobCollection:any):Promise<QuerySnapshot<unknown>> => await getDocs(jobCollection);
    const alljobs = async (querySnapshot:any) => (await querySnapshot).docs.map((snapshot:any) => snapshot.data());
    return pipe(
        'jobs',
        curriedJobCollection,
        querySnapshot,
        alljobs
    )
}
