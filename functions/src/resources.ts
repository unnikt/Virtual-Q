import admin = require('firebase-admin');
import functions = require('firebase-functions');
import express = require('express');
import hbEngine = require('express-handlebars');
import corsMod = require('cors');
import { getBusinesses } from './common';

const resources = express();
const db = admin.firestore();

//Set up view engine
resources.set('views', './views'); //Set the views folder
resources.set('view engine', 'hbs'); //view the engine
resources.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format
resources.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "mainb",
    layoutsDir: './views/layouts'
}));
const cors = corsMod({ origin: true });

resources.get('/resources', (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid?.toString(); //const bid = data.bid;
        const bid = req.query.bid?.toString(); //const bid = data.bid;
        if (uid) getBusinesses(uid)
            .then(bus => res.render('resources', { uid: uid, bid: bid, bus: bus }))
            .catch(err => res.render('error', { code: -1, loc: "get/resources", msg: 'getBusiness failed..' }))
        else res.render('error', { code: -1, loc: "get/resources", msg: 'UID is missing...' });
    }));

resources.post('/addResType', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid; const resType = data.resType;
        if ((bid) && (resType))
            db.collection('business').doc(bid).collection('restypes').doc().set({ rtype: resType })
                .then(snap => res.redirect(['/resources?uid=', req.body.uid, '&bid=', bid].join('')))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

resources.post('/delResType', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid; const tid = data.tid;
        if ((bid) && (tid))
            db.collection('business').doc(bid).collection('restypes').doc(tid).delete()
                .then(snap => res.redirect(['/resources?uid=', req.body.uid, '&bid=', bid].join('')))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

resources.get('/getResTypes', (request, response) =>
    cors(request, response, () => {
        const bid = (request.query.bid) ? request.query.bid.toString() : "";
        if (bid) {
            const payload: { tid: string, rtype: string }[] = [];
            db.collection('business').doc(bid).collection('restypes').get()
                .then(snaps => {
                    snaps.forEach(doc => payload.push({ tid: doc.id, rtype: doc.data().rtype }));
                    response.json(payload);
                })
                .catch(err => response.json({ title: "Get resTypes - ", err: err }))
        }
        else response.json({ title: "Get resTypes - ", err: 'No bid received' });
    }));

resources.post('/addResource', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid;
        const resource = { rcode: data.code, rname: data.name, rtype: data.type };
        if ((bid) && (resource))
            db.collection('business').doc(bid).collection('resources').doc().set(resource)
                .then(snap => res.redirect(['/resources?uid=', req.body.uid, '&bid=', bid].join('')))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

resources.get('/getResources', (request, response) =>
    cors(request, response, () => {
        const bid = (request.query.bid) ? request.query.bid.toString() : "";
        if (bid) {
            const payload: { rid: string, rcode: string, rname: string, rtype: string }[] = [];
            db.collection('business').doc(bid).collection('resources').get()
                .then(snaps => {
                    snaps.forEach(doc => payload.push({ rid: doc.id, rcode: doc.data().rcode, rname: doc.data().rname, rtype: doc.data().rtype }));
                    response.json(payload);
                })
                .catch(err => response.json({ title: "Get resTypes - ", err: err }))
        }
        else response.json({ title: "Get resTypes - ", err: 'No bid received' });
    }));
resources.get('/getresmap', (request, response) =>
    cors(request, response, () => {
        const bid = (request.query.bid) ? request.query.bid.toString() : "";
        if (bid) {
            const attached: { mid: string, sid: string, required: boolean, tid: string, rtype: string }[] = [];
            const rtypes: { mid: string, sid: string, required: boolean, tid: string, rtype: string }[] = [];
            const payload = { Ra: attached, Rtypes: rtypes };
            db.collection('business').doc(bid).collection('resmap').get()
                .then(resmaps => {
                    resmaps.forEach(resmap => {
                        const d = resmap.data();
                        attached.push({ mid: resmap.id, sid: d.sid, required: true, tid: d.tid, rtype: d.rtype })
                    });
                    db.collection('business').doc(bid).collection('restypes').get()
                        .then(snaps => {
                            snaps.forEach(res => {
                                const dres = res.data();
                                rtypes.push({ mid: '', sid: '', required: false, tid: res.id, rtype: dres.rtype })
                            })
                            payload.Ra = attached;
                            payload.Rtypes = rtypes;
                            response.json(payload);
                        }
                        )
                        .catch(err => response.json({ title: "Get resTypes - ", err: err }));
                })
                .catch(err => response.json({ title: "Get resTypes - ", err: err }))
        }
        else response.json({ title: "Get resTypes - ", err: 'No bid received' });
    }));

resources.post('/saveresmap', (req, res) =>
    cors(req, res, () => {
        const payload = JSON.parse(req.body);
        const bid = payload.bid;
        const Rn: { sid: string, tid: string, rtype: string, required: boolean }[] = payload.Rn;
        const Rd: { mid: string }[] = payload.Rd;
        const batch = db.batch();
        if ((bid)) {
            Rn.forEach(itm => batch.set(db.collection('business').doc(bid).collection('resmap').doc(), itm));
            Rd.forEach(itm => batch.delete(db.collection('business').doc(bid).collection('resmap').doc(itm.mid)));
        }
        batch.commit()
            .then(snaps => res.json({ code: 1, msg: 'Changes were saved successfully...' }))
            .catch(err => res.json({ code: -1, msg: err }))
    }));

resources.post('/delResource', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid; const rid = data.rid;
        if ((bid) && (rid))
            db.collection('business').doc(bid).collection('resources').doc(rid).delete()
                .then(snap => res.redirect(['/resources?uid=', req.body.uid, '&bid=', bid].join('')))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

// resources.post('/blockResource', (req, res) =>
//     cors(req, res, () => {
//         return db.runTransaction(transaction => {
//             const bid = req.body.bid; const rev = req.body.revent;
//             if ((bid) && (rev)) {
//                 const reventsRef = db.collection('business').doc(bid).collection('revents');
//                 return transaction.get(reventsRef.where('rid', '==', rev.rid).where('start', '<=', rev.start).where('end', '>=', rev.end))
//                     .then(doc => {
//                         if (doc) throw "Resource not available";
//                         else reventsRef.doc().set(rev)
//                             .then(doc => { return doc })
//                             .catch(err => { throw err});
//                     })
//                     .catch(err => { throw err })
//             }
//             else { throw "Missing data"; }
//         })
//             .then(rslt => { res.json({ code: 1, reid: rslt }) })
//             .catch(err => res.json({ code: 0, msg: err }));
//         //     reventsRef.doc().create(revent)
//         //         .then(snap => res.json({ code: 1, msg: 'Resource blocked...' }))
//         //         .catch(err => res.json({ code: 0, msg: 'Failed to block resource...' + err }))
//         // else res.json({ code: -1, msg: 'Failed to release resource. Missing Data...' });
//     }));
// resources.post('/rlsResource', (req, res) =>
//     cors(req, res, () => {
//         const data = req.body; const bid = data.bid; const reid = data.reid;
//         const reventsRef = db.collection('business').doc(bid).collection('revents');
//         if ((bid) && (reid))
//             reventsRef.doc(reid).delete()
//                 .then(snap => res.json({ code: 1, msg: 'Resource released...' }))
//                 .catch(err => res.json({ code: 0, msg: 'Failed to release resource...' + err }))
//         else res.json({ code: -1, msg: 'Failed to release resource. Missing Data...' });
//     }));


exports.resources = functions.https.onRequest(resources);