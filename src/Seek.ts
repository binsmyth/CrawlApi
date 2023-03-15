import { Job } from "./crawl";
import { curry } from "./lib/curry";
import { getData, getDataFirebase, getJobDetails, insertIntoDb, insertNotesIntoDb, insertTechStackIntoDb, loadCheerio } from './crawl';
import { pipe } from "fp-ts/lib/function";

export class Seek{
    constructor(){}
    async extractSeekDetails(loadedCheerio:Promise<cheerio.Root>) : Promise<Job[]> {
        const $ = await loadedCheerio;
        const jobtitle = $('[data-automation="normalJob"]');
        return Array.from(jobtitle).map((elem) => {
            const jobCompany = $(elem).find('[data-automation="jobCompany"]');
            const jobTitle = $(elem).find('[data-automation="jobTitle"]');
            return {
                company: jobCompany.text(),
                title: jobTitle.html(),
                href: jobTitle.attr('href')
            };
        });
    }
    getSeek(url: string){
        const insertSeekIntoDb = curry(insertIntoDb)('seek');//
        pipe(
          url,
          getData,
          loadCheerio,
          this.extractSeekDetails,
          insertSeekIntoDb
        );
      }
}