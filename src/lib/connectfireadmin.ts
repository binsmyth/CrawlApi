import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
let serviceAccount = require('../keys/crawl-jobs.json');

export function connectfirestoreadmin() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://crawl-jobs-5b75b.australia-southeast1.firebasio.com'
  });
  return getFirestore();
}