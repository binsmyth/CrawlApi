"use strict";
//Get clicked url string and site from -> build the url from provided string -> crawl the url -> send back to frontend
exports.__esModule = true;
exports.buildUrlString = void 0;
function buildUrlString(href, site) {
    return site === 'linkedin'
        ? "https://www.".concat(site, ".com/jobs/view/").concat(href, "/?originalSubdomain=au")
        : site === 'seek'
            ? "https://www.".concat(site, ".com.au").concat(href)
            : '';
}
exports.buildUrlString = buildUrlString;
