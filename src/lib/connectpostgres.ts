import { Pool } from "pg"; //@ts-ignore

interface PgLogin{
    user: string;
    host: string;
    database: string;
    password: string;
    port : number;
  }

export function connectpostgres(){
  //Login details for local postgres
  const pgDetail: PgLogin = {
    user : 'node',
    host: 'localhost',
    database: 'node',
    password: 'vin',
    port: 5432,
  }

  const pool = new Pool(pgDetail);
  return pool;
}

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