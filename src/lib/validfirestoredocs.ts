export function validfirestoredocs(href : string | any){
    return `${decodeURIComponent(href)}`.replace(/\D/g,"");
}