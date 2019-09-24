if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').then((res) => {
        //console.log("Registered", res);
    }).catch(() => {
       // console.log("Not registered");
    })
}