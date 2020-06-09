import * as express from 'express';
import * as hbEngine from 'express-handlebars';
import * as corsMod from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const dbstore = express();
const cors = corsMod({ origin: true });
const db = admin.firestore();

//Set up view engine
dbstore.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
dbstore.set('views', './views'); //Set the views folder
dbstore.set('view engine', 'hbs'); //view the engine
dbstore.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

dbstore.post('/add', (req, res) =>
    cors(req, res, () => {
        const location = getlocation(req.body.type.toString());
        const doc = req.body.doc;
        res.set('content-type', 'text/html');
        //Add document to collection
        db.collection(location).add(doc)
            .then(result => res.send("01-Document added successfully"))
            .catch(err => res.send("00-Err:[dbstore.post - /add] " + err));
    }));

dbstore.get('/delete', (req, res) =>
    cors(req, res, () => {
        const location = (req.query.type) ? getlocation(req.query.type.toString()) : null;
        const docid = req.query.id;
        res.set('content-type', 'text/html');
        if ((!location) || (!docid))
            res.send("doctype or docid is missing..");
        else db.doc(location + docid).delete()
            .then(result => { res.send("Deletion succeeded.") })
            .catch(error => { res.send("Deletion failed..." + error); })
    }));

dbstore.post('/finduser', (req, res) =>
    cors(req, res, () => {
        const payload = JSON.parse(req.body); //convert string to JSON
        if (payload.mode === 'find') {
            const data: { results: { fname: String, sname: String, email: String, phone: String, uid: String }[] } = { results: [] };
            db.collection('/users').where(payload.field, "==", payload.value).get()
                .then(results => {
                    results.forEach(doc => data.results.push({ fname: doc.data().fname, sname: doc.data().sname, email: doc.data().email, phone: doc.data().phone, uid: doc.id }));
                    res.json(data);
                })
                .catch(err => res.render('error', { title: 'Search user', msg: err }));
        }
        else if (payload.mode === 'create')
            db.collection('users').where('email', '==', payload.email).get()
                .then(qEmail => {
                    if (qEmail.size > 0) res.json({ code: 0, msg: 'User with the same email exists..Please use search..' });
                    else db.collection('users').where('phone', '==', payload.phone).get()
                        .then(qPhone => {
                            if (qPhone.size > 0) res.json({ code: 0, err: 'User with the same number exisits..Please use search..' })
                            else res.json({ code: 1, err: 'No user found..' })
                        })
                        .catch(err => res.json({ err: err }));
                })
                .catch(err => res.json({ err: 'Create failed while validating...' + err }));
        else
            res.json({ code: -1, err: 'Invalid request...' });
    }));

dbstore.get('/getbid', (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid;
        const data: { bid: string, bname: string }[] = [];
        if (uid)
            db.collection('providers').where('uid', '==', uid).get()
                .then(querySnaps => {
                    querySnaps.forEach(doc => data.push({ bid: doc.id, bname: doc.data().orgname }))
                    res.json(JSON.stringify(data));
                }
                )
                .catch(err => res.render('error', { title: 'dbstore/getbid:-', msg: err }))
    }))

function getlocation(doctype: string) {
    switch (doctype) {
        case ('appointment'): return ("/appointments/");
        case ('service'): return ('/services/');
        case ('provider'): return ('/providers/');
    }
    return ("");
}

exports.dbstore = functions.https.onRequest(dbstore);

//Create a record in the users collection
exports.registerUser = functions.auth.user().onCreate(user => {
    return db.collection('users').doc(user.uid).set({
        fname: 'First Name',
        sname: 'Sur Name',
        phone: 'First Name',
        email: user.email,
        business: false,
        notify: 'email'
    });
})

//Create a record in the users collection when an appointment is created for a new customer
// exports.createUser = functions.firestore.document('/appointments/{doc}').onCreate((snap, context) => {
//     const data = snap.data();
//     if (data)
//         if (!data.uid) {
//             db.collection('users').add({
//                 fname: data.user.fname,
//                 sname: data.user.sname,
//                 phone: data.user.phone,
//                 email: data.user.email,
//                 business: false,
//                 notify: data.user.notify
//             })
//                 .then(res => {
//                     data.uid = res.id;
//                     return db.collection('appointments').doc(snap.id).set(data.event);
//                 })
//                 .catch(err => console.log("dbstore/createUser:-", err));
//         }
//         else {
//             return db.collection('appointments').doc(snap.id).set(data.event);            
//     }

// });

//Firestore trigger that creates a default walk in service when the user registers as a service provider
exports.createDefaultService = functions.firestore.document('/providers/{doc_id}')
    .onCreate((snap, context) => {
        const pid = context.params.doc_id;
        const pdata = snap.data();
        const default_Services = { sname: 'Walk in', desc: 'Default Walk in service' }

        let uid: string = "";
        if (pdata) uid = pdata.uid;

        //Create the default service for the new provider created
        return db.collection('/providers/' + pid + '/services').doc(pid).set(default_Services)
            .then(result_svc => {
                // update the user doc - set business flag to true
                const user = db.collection('users').doc(uid);
                return user.update({ business: true })
            })
            .catch(err => console.log("CreateDefaultService (User update):-" + err))
    });