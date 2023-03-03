import { Job } from "./crawl";
export class LinkedIn {
    constructor(){}
    
    async extractLinkedInDetails(loadedCheerio:Promise<cheerio.Root>) : Promise<Job[]> {
        const $ = await loadedCheerio;
        const jobtitle = $('.jobs-search__results-list>li');
        return Array.from(jobtitle).map((elem) => {
            const jobCompany = $(elem).find('.base-search-card__info>h4').text().replace(/[\n]/g,'').trim();
            const jobTitle = $(elem).find('.base-search-card__info>h3').text().replace(/[\n]/g,'').trim();
            const url = $(elem).find('.base-card__full-link').attr('href');
            const splitUrl = url?.split('view/')[1].split('?')[0];
            return {
                company: jobCompany,
                title: jobTitle,
                href: splitUrl
            };
        });
    }

    async extractLinkedInJobDescriptions(loadedCheerio:Promise<cheerio.Root>) : Promise<any>{
        const $ = await loadedCheerio;
        const jobdescription=$('.description__text').children().children().html();
        return jobdescription;
    }
}