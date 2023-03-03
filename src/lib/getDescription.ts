//Get clicked url string and site from -> build the url from provided string -> crawl the url -> send back to frontend

import QueryString from "qs";
type QueryUrl = string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined;
export function buildUrlString(href : QueryUrl, site : QueryUrl): string {
    return site === 'linkedin' 
                ? `https://www.${site}.com/jobs/view/${href}/?originalSubdomain=au`
                : site === 'seek'
                ? `https://www.${site}.com.au/${href}`
                : '';
}