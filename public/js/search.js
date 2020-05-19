// const firebaseConfig = {
//     apiKey: "AIzaSyDhCQUGfNJpo5U2V-briauPI7qjwzMLRTA",
//     authDomain: "virq-app.firebaseapp.com",
//     databaseURL: "https://virq-app.firebaseio.com",
//     projectId: "virq-app",
//     storageBucket: "virq-app.appspot.com",
//     messagingSenderId: "164615998565",
//     appId: "1:164615998565:web:bcacf809a8198edd7aca8c",
//     measurementId: "G-S0YTXTZ0BM"
// };

// firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
const business = db.collection('business');
get('iSearch').addEventListener('click', ev => {
    const searchText = get('inpSearch').value;
    const divResults = get('divResults'); divResults.innerHTML = "";
    business.get()
        .then(qSnaps => {
            qSnaps.forEach(doc => {
                const result = newel('div'); result.addEventListener('click',e=> window.location='vwservices?bid=' + doc.id);
                const title = newel('p'); title.setAttribute('class', 'title'); title.innerText = doc.data().bname;
                const desc = newel('p'); desc.setAttribute('class', 'details'); desc.innerText = doc.data().desc;
                result.appendChild(title); result.appendChild(desc);
                divResults.appendChild(result)
        })
    })
})

function get(el) { return document.getElementById(el) }
function newel(el) {return document.createElement(el)}