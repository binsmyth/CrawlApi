import * as fs from 'fs';
async function writeToFile(content: any){
    const c = await content;
    await fs.writeFile('./file.html', c, err=>{
      if(err){
        console.log(err);
      }
    });
}