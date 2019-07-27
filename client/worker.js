console.log('Service worker carregado');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push recebido');
    self.registration.showNotification(data.title, {
        body : data.body,
        icon : 'https://image.shutterstock.com/image-vector/tm-letter-logo-vector-circle-260nw-1128566666.jpg'
    });
});