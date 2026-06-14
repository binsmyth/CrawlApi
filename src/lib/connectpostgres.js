"use strict";
exports.__esModule = true;
exports.connectpostgres = void 0;
var pg_1 = require("pg"); //@ts-ignore
function connectpostgres() {
    //Login details for local postgres
    var pgDetail = {
        user: 'node',
        host: 'localhost',
        database: 'node',
        password: 'vin',
        port: 5432
    };
    var pool = new pg_1.Pool(pgDetail);
    return pool;
}
exports.connectpostgres = connectpostgres;
//For inserting into postgres (deprecated in favor of firebase for now)
// function insertIntoPostgres(alljobs: { company: any; title: any; href: any; }[], site: any) {
//   //This puts job details into postgres
//   alljobs.forEach(({ company, title, href }) => {
//       pool.query(`INSERT INTO job VALUES(\'${company}\',\'${title}\',\'${href}\','${site}')`, (error : NodeJS.ErrnoException, res) => {
//       if(error){
//           console.log(error?.code);
//       }
//       if(res){
//           console.log(res);
//       }
//       });
//   });
// }
