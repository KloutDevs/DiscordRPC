const { ipcRenderer, Notification, remote} = require('electron');
var timestamp = false;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.title-bar').classList.add('animate__animated');
    document.querySelector('.title-bar').classList.add('animate__backInLeft');
    document.querySelector('.title').classList.add('animate__animated');
    document.querySelector('.title').classList.add('animate__backInDown');
    document.querySelector('hr').classList.add('animate__animated');
    document.querySelector('hr').classList.add('animate__backInRight');
    document.querySelector('.clientId').classList.add('animate__animated');
    document.querySelector('.clientId').classList.add('animate__backInLeft');
    document.querySelector('.details').classList.add('animate__animated');
    document.querySelector('.details').classList.add('animate__backInLeft');
    document.querySelector('.state').classList.add('animate__animated');
    document.querySelector('.state').classList.add('animate__backInRight');
    document.querySelector('.largeImageKey').classList.add('animate__animated');
    document.querySelector('.largeImageKey').classList.add('animate__backInLeft');
    document.querySelector('.largeImageText').classList.add('animate__animated');
    document.querySelector('.largeImageText').classList.add('animate__backInRight');
    document.querySelector('.smallImageKey').classList.add('animate__animated');
    document.querySelector('.smallImageKey').classList.add('animate__backInLeft');
    document.querySelector('.smallImageText').classList.add('animate__animated');
    document.querySelector('.smallImageText').classList.add('animate__backInRight');
    document.querySelector('.timestamp').classList.add('animate__animated');
    document.querySelector('.timestamp').classList.add('animate__backInRight');
    document.querySelector('.connectButton').classList.add('animate__animated');
    document.querySelector('.connectButton').classList.add('animate__backInUp');
});
document.querySelector('#btn-minimize').addEventListener('click', () => {
    if(remote.getCurrentWindow().isMinimized() == false){
        remote.getCurrentWindow().minimize();
    }
});
document.querySelector('#btn-close').addEventListener('click', () => {
    remote.getCurrentWindow().close();
});
document.querySelector('.timestamp').addEventListener('click', (e) => {
    let __tClassList = document.querySelector('.timestamp').classList;
    if(document.querySelector('.timestamp').childNodes[1].checked == false){
        __tClassList.remove('checkbox-active');
    }else{
        __tClassList.add('checkbox-active');
    }
});
document.querySelector('.connectButton').addEventListener('click', async () => {
    if(document.querySelector('.clientId').value.length < 5){
        ipcRenderer.invoke('sendNotification', 'You have entered an invalid ID, the client could not be connected.');
    }else if(document.querySelector('.details').value.length < 1){
        ipcRenderer.invoke('sendNotification', 'It is necessary that minimally, write something in the field "Details"');
    }else{
        let clientId = document.querySelector('.clientId').value, activityData = {
            details: document.querySelector('.details').value,
            state: document.querySelector('.state').value,
            largeImageKey: document.querySelector('.largeImageKey').value,
            largeImageText: document.querySelector('.largeImageText').value,
            smallImageKey: document.querySelector('.smallImageKey').value,
            smallImageText: document.querySelector('.smallImageText').value,
            startTimestamp: false,
        }
        if(document.querySelector('.timestamp').classList.contains('checkbox-active')){
            activityData.startTimestamp = new Date().getTime();
        }
        await ipcRenderer.invoke('connect', clientId, activityData);
    }

});
