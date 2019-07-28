const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const mongoclient = require('mongodb');

const mongoUri = 'x';

const app = express();
app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());
const publicVapIdKey = 'x';
const secretVapIdKey = 'x';

webpush.setVapidDetails('x', publicVapIdKey, secretVapIdKey);
var db = null;
mongoclient.connect(mongoUri, { useNewUrlParser : true }, (err, client)=>{
    if(err) return console.error(err);

    db = client.db('Cluster0');
});

// var ids = [];

// ids = eval('('+idInDB+')');

app.get('/sendmessages', (req,resp) => {
    var payload = {
        title : 'Titulo',
        body : 'Mensagem'
    };
    db.collection('Clients').find().toArray((err, result) => {
        if(err)
        {
            resp.status(400).json({ error : err});
            return console.error(err);
        }
        for(var e in result)
        {
            webpush.sendNotification(result[e], JSON.stringify(payload))
            .catch((error) => {
                console.error(error);
            });
        }
    });

    resp.status(200).json({});
});

app.post('/register', (req,resp) => {
    const fcm = req.body;
    var found = false;
    // for(var i in ids)
    // {
    //     if(ids[i].endpoint.indexOf(fcm.endpoint) > -1)
    //     {
    //         found = true;
    //     }
    // }
    // if(!found)
    // {
        db.collection('Clients').find({ endpoint : fcm.endpoint}).toArray((err, results) => {

            if(err)
            {
                resp.status(400).json({error : err});
                return console.log(err);
            }

            if(results.length == 0)
            {
                db.collection('Clients').insertOne(fcm, (err, result) => {
                    if(err){
                        resp.status(400).json({error : err})
                        return console.error(err);                
                    } 
                });
                resp.status(200).json({});
            }
            else {
                resp.status(200).json({});
            }
        });
        
    // }
    // resp.status(200).json({});
});

app.post('/subscribe', (req,resp) => {
    const subscription = req.body.subscription;
    const texto = req.body.texto;
    
    resp.status(201).json({});

    //create payload
    setTimeout(() => {
        const payload = JSON.stringify({'title' : 'Push Teste', 'body' : texto, TTL: 10000});
        webpush.sendNotification(subscription, payload).catch((error) => {
            console.error(error);
        });
    }, 5000);
    
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});