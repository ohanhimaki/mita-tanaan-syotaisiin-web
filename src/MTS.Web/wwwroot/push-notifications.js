async function subscribeToNotifications() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BLDwqbF70Msb_vUJrTlXN2-atoWKVj9HM0LKLeMnlvaewOv8HpsrYqHf5tIcCmyWX2ulz3-OisO2CRazo-pLd44'
    });
    console.log(subscription.toJSON());
    return subscription.toJSON();
}
