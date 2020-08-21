import admin = require('firebase-admin');
const db = admin.firestore();

export async function getBusinesses(uid: string) {
    const busdata: { bid: string, bname: string }[] = [];
    await db.collection('business').where('uid', '==', uid).get()
        .then(snaps => snaps.forEach(doc => busdata.push({ bid: doc.id, bname: doc.data().bname })))
        .catch(err => console.log(err));
    return busdata;
}
export async function getServices(bid: string) {
    const data: { sid: string, sname: string }[] = [];
    await db.collection('business').doc(bid).collection('services').get()
        .then(snaps => snaps.forEach(doc => data.push({ sid: doc.id, sname: doc.data().sname })))
        .catch(err => console.log(err));
    return data;
}
export async function addDoc(loc: string, doc: admin.firestore.DocumentData) {
    await db.collection(loc).add(doc)
        .then(newDoc => { return newDoc })
        .catch(err => { console.log(err); return null });
}
