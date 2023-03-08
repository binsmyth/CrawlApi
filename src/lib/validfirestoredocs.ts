export function validfirestoredocs(href : string|undefined){
    return `${href}`.replace(/\D/g,"");
}