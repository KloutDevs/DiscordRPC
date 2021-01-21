const { ipcRenderer, Notification, remote} = require('electron');

document.querySelector('#btn-minimize').addEventListener('click', () => {
    if(remote.getCurrentWindow().isMinimized() == false){
        remote.getCurrentWindow().minimize();
    }
});
document.querySelector('#btn-close').addEventListener('click', () => {
    remote.getCurrentWindow().close();
});

document.querySelector('.connectButton').addEventListener('click', () => {
    if(document.querySelector('.clientId').value.length < 5){
        ipcRenderer.invoke('sendNotification', 'You have entered an invalid ID, the client could not be connected.');
    }else if(document.querySelector('.details').value.length < 1){
        ipcRenderer.invoke('It is necessary that minimally, write something in the field "Details"');
    }else{
        console.log(document.querySelector('.state').value.length);
        let clientId = document.querySelector('.clientId').value, activityData = {
            details: document.querySelector('.details').value,
            state: (document.querySelector('.state').value.length > 1) ? document.querySelector('.state').value : null,
            largeImageKey: document.querySelector('.largeImageKey').value,
            largeImageText: document.querySelector('.largeImageText').value,
            smallImageKey: document.querySelector('.smallImageKey').value,
            smallImageText: document.querySelector('.smallImageText').value,
            timestamp: false,
        }

        if(document.querySelector('.timestamp-checkbox').style.backgroundColor == '#e23f17'){
            timestamp = true;
        }
        
        ipcRenderer.invoke('connect', clientId, activityData).then(r => {
            if(r == 'Could not connect'){
                ipcRenderer.invoke('sendNotification', 'An error occurred in the course of creating the activity: '+r);
            }else if(r == 'connection closed'){
                ipcRenderer.invoke('sendNotification', 'An error occurred in the course of creating the activity: '+r);                
            }else if(r == 'RPC_CONNECTION_TIMEOUT'){
                ipcRenderer.invoke('sendNotification', 'An error occurred in the course of creating the activity: '+r);                
            }else if(r == 'Failed in register activity'){
                ipcRenderer.invoke('sendNotification', 'An error occurred in the course of creating the activity: '+r);                
            }else if(r == true){
                ipcRenderer.invoke('sendNotification', 'The client was successfully connected, and the activity was recorded.');                
            }
        });
    }

});
