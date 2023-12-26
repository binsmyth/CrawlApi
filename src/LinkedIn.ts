import { pipe } from "fp-ts/lib/function";
import { getData, insertIntoDb, Job, loadCheerio } from "./crawl";
import { curry } from "./lib/curry";
export class LinkedIn {
    constructor(){}
    
    async extractLinkedInDetails(loadedCheerio:Promise<cheerio.Root>) : Promise<Job[]> {
        const $ = await loadedCheerio;
        const jobtitle = $('.jobs-search__results-list>li');
        const jobCompany = () => $(jobtitle).map((index, elem)=> $(elem).find('.base-search-card__info>h4').text().replace(/[\n]/g,'').trim())
        const jobTitle = () => $(jobtitle).map((index, elem)=>$(elem).find('.base-search-card__info>h3').text().replace(/[\n]/g,'').trim());
        const url = () => $(jobtitle).map((index,elem)=>$(elem).find('.base-card__full-link').attr('href')?.split('view/')[1].split('?')[0]);
        return Array.from(jobCompany()).map((value, index)=>{
            return {
                company: jobCompany()[index],
                title:jobTitle()[index],
                href:url()[index]
            }
        })
    }

    async extractLinkedInJobDescriptions(loadedCheerio:Promise<cheerio.Root>) : Promise<any>{
        const $ = await loadedCheerio;
        const jobdescription=$('.description__text').children().children().html();
        return jobdescription;
    }

    getLinkedIn(url:string){
        const insertLinkedinIntoDb = curry(insertIntoDb)('linkedin');
        pipe(
          url,
          getData,
          loadCheerio,
          this.extractLinkedInDetails,
          insertLinkedinIntoDb
        );
      }
}