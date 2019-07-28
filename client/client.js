const publicVapIdKey = 'BEBja5FklXnAzuOGoExG-FXevC3lMkvtvOjIDISSQ3cKl5yKqlMCp4x4N0fnYmlKH2-peZC5cXBR00Xb4fpnf2w';

var register = null;
var isPushEnabled = false;
window.addEventListener('load', async () => {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.addEventListener('click', async function() {
        if(isPushEnabled)
        {
            await unsubscribe();
        }
        else {
            await subscribe();
        }
    });
    if('serviceWorker' in navigator)
    {
        register = await navigator.serviceWorker.register('/worker.js', {scope : '/'});
        initialiseState();
        // send().catch(err => console.error(err));
    }
    else {
        console.warn('Sem suporte a push notifications');
    }
});

async function registerBrowser()
{
    if(!register)
    {
        register = await navigator.serviceWorker.getRegistration()
        .then((e) => {

        });
    }
}



async function send(texto)
{
    console.log('Registrando o service worker');
    console.log('Service Worker registrado...');

    if(!register)
    {
        register = await navigator.serviceWorker.register('/worker.js', {
            scope : '/'
        });
        
        register.pushManager.getSubscription().then(function(subscription) {
            console.log("got subscription id: ", subscription.endpoint)
          });
    }

    
    //const subscription = 
    await register.pushManager.subscribe({
        userVisibleOnly : true,
        applicationServerKey : urlBase64ToUint8Array(publicVapIdKey)
    }).then(async (subscr) => {
        await fetch('/register', {
            method : 'POST',
            body : JSON.stringify(subscr),
            headers : {
                'content-type' : 'application/json'
            }
        });
        subscription = subscr;
        console.log(subscr);
    });
    const obj = {
        subscription : subscription,
        texto : texto
    };
    console.log('Push registrado');

    //enviando o push
    console.log('Enviando o push');
    await fetch('/subscribe', {
       method : 'POST', 
       body : JSON.stringify(obj) ,
       headers : {
           'content-type' : 'application/json'
       }
    });
    console.log('Push enviado');
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }