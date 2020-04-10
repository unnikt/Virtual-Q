import { firestore } from 'firebase-admin';

export function getCollections(path: string):any {
        firestore().collection(path).get()
        .then(querySnapshot=>{
            const colDocs:any = [];
            querySnapshot.forEach(item =>{
                const doc = item.data();
                doc.id = item.id;
                colDocs.push(doc);
            });
            console.log("dbhelper: " + JSON.stringify(colDocs));
            return(colDocs);
        })
        .catch(error=>{
            return(error);
        });
    };
