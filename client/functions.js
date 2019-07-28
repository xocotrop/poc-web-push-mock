function initialiseState() {
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      console.warn('Notificações não são suportadas');
      return;
    }
  
    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
      console.warn('Usuário bloqueou as notificações');
      return;
    }
  
    
    if (!('PushManager' in window)) {
      console.warn('Push não é suportado.');
      return;
    }
  
    
      register.pushManager.getSubscription()
        .then(function(subscription) {
    
          var pushButton = document.querySelector('.js-push-button');
          pushButton.disabled = false;
  
          if (!subscription) {
            
            return;
          }
  
          
          sendSubscriptionToServer(subscription);
  
          
          pushButton.textContent = 'Disable Push Messages';
          isPushEnabled = true;
        })
        .catch(function(err) {
          console.warn('Error during getSubscription()', err);
        });
    //});
  }

function unsubscribe() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;
  
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {

      serviceWorkerRegistration.pushManager.getSubscription().then(
        function(pushSubscription) {
          
          if (!pushSubscription) {
          
            isPushEnabled = false;
            pushButton.disabled = false;
            pushButton.textContent = 'Enable Push Messages';
            return;
          }
  
          var subscriptionId = pushSubscription.subscriptionId;
          
          pushSubscription.unsubscribe().then(function(successful) {
            pushButton.disabled = false;
            pushButton.textContent = 'Enable Push Messages';
            isPushEnabled = false;
          }).catch(function(e) {
            
  
            console.log('Unsubscription error: ', e);
            pushButton.disabled = false;
            pushButton.textContent = 'Enable Push Messages';
          });
        }).catch(function(e) {
          console.error('Error thrown while unsubscribing from push messaging.', e);
        });
    });
  }

async function subscribe() {
    
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;
  
    
      
        await register.pushManager.subscribe({
            userVisibleOnly : true,
            applicationServerKey : urlBase64ToUint8Array(publicVapIdKey)
        }).then(async function (subscr) {
            await fetch('/register', {
                method : 'POST',
                body : JSON.stringify(subscr),
                headers : {
                    'content-type' : 'application/json'
                }
            });
    
            isPushEnabled = true;
              pushButton.textContent = 'Disable Push Messages';
              pushButton.disabled = false;
        })
    //})
    .catch(err => {
        if (Notification.permission === 'denied') {
            
            console.warn('Permission for Notifications was denied');
            pushButton.disabled = true;
          } else {
            
            console.error('Unable to subscribe to push.', err);
            pushButton.disabled = false;
            pushButton.textContent = 'Enable Push Messages';
          }
    });
    
  }