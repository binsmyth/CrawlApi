import { Job } from "./crawl";

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
}