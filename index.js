const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());
const publicVapIdKey = 'BEBja5FklXnAzuOGoExG-FXevC3lMkvtvOjIDISSQ3cKl5yKqlMCp4x4N0fnYmlKH2-peZC5cXBR00Xb4fpnf2w';
const secretVapIdKey = 'aqAWyW4b3Vb_xzQVNM-EaN_yuyh569OJd1qYIpZWJEA';

webpush.setVapidDetails('mailto:igor.sms@gmail.com', publicVapIdKey, secretVapIdKey);

var idInDB = '[{"endpoint":"https://fcm.googleapis.com/fcm/send/esOQsKL_aw4:APA91bHwPdkmYaT9nCGSmSQmvciixfG1bm9eZfPCu1B7D_uN2SB-bL8kbOPmSuaxJqQJTohF1b2dx3sso78iMAxBmcXB6WUI6SQTBLejlco_NwACTpf4aiY35GV8oqdvoXHaI8IjNqk5","expirationTime":null,"keys":{"p256dh":"BO2zZsP4IliQ3eg35LBsL7LuIFe7RrDmxNs3IMt686TGRccoPsqjuTUV61UdpHXwLCE0ppnIbREd1h4wqKaLRwI","auth":"0gcQiBrYu7onySenVt4vwQ"}},{"endpoint":"https://fcm.googleapis.com/fcm/send/c7iVPCFspZ8:APA91bFgHQsfTXpuQRnxs_MGVH2V2KrkhVaNGk9bbPgGFIKzoKXuQWtcovw3z1QvmSBOAQynUZQkZQAxZJKOjNF7HxrSdn8YkMM-K6RfRGlBv_2qPzDqbOgzl_ocFSqOLh9IEAXeabnw","expirationTime":null,"keys":{"p256dh":"BFiCxmgTSmhoEtlRbKcfdbBfIaGgcJDFxCjvPoNhptG51HbfL86TExHMD6MtjkSuizt1MixefKQnITRr9SxAnwg","auth":"UVgJPJdyHNwKTFQl7CoAVg"}}]';

var ids = [];

ids = eval('('+idInDB+')');

app.get('/sendmessages', (req,resp) => {
    var payload = {
        title : 'Titulo',
        body : 'MEnsagem'
    };
    for(var e in ids)
        webpush.sendNotification(ids[e], JSON.stringify(payload)).catch((error) => {
            console.error(error);
        });

    resp.status(200).json({});
});

app.post('/register', (req,resp) => {
    const fcm = req.body;
    var found = false;
    for(var i in ids)
    {
        if(ids[i].endpoint.indexOf(fcm.endpoint) > -1)
        {
            found = true;
        }
    }
    if(!found)
    {
        ids.push(fcm);
    }
    resp.status(200).json({});
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