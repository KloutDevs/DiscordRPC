const __path = require('path');
const __url = require('url');
const __rpc = require('discord-rpc')
const __rpcClient = new __rpc.Client({transport: 'ipc'});
const { app, BrowserWindow, remote, Notification, ipcMain } = require('electron');

if(app.isPackaged == false){
    require('electron-reload')(__dirname, {
        electron: __path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}


app.on('ready', function(){
    let window = new BrowserWindow({
        width: 352,
        height: 453,
        frame: false,
        icon: __path.join(__dirname, './appIcon.png'),
        show: false,
        resizable: true,
        closable: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    window.setMenu(null);
    window.webContents.loadURL(__url.format({
        pathname: __path.join(__dirname, 'views/main.html'),
        protocol: 'file',
        slashes: true,
    }));
    window.on('ready-to-show', () => {
        window.show();
    });
    ipcMain.handle('connect', async (event, clientId, activityData) => {
        let __connect = new Promise(async (resolve, reject) => {
            try{
                await __rpcClient.login({clientId}).then(c => {
                    resolve(c);
                });
            }catch(e){
                await sendNotification('An error occurred in the course of creating the activity: '+e.message);
                let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
                console.log(`[${date}] The application could not connect to the client.`);
                console.log(`[${date}] The error simplified: ${e.message}`);
                console.log(`[${date}] The unsimplified error:`);
                console.log(e);
                return;
            }
        });
        __connect.then(r => {
            let time;
            if(r == 'Could not connect'){
                time = 1000;
            }else if(r == 'connection closed'){
                time = 1000;
            }else if(r == 'RPC_CONNECTION_TIMEOUT'){
                time = 1000;
            }else if(r == undefined){
                time = 15000;
            }else{
                time = 1000;
            }
            setTimeout(function(){
                let _register = new Promise(async (resolve, reject) => {
                    try{
                        let x = {};
                        for(const _d in activityData){
                            if(activityData[_d].length > 2){
                                x[_d] = activityData[_d];
                            }else if(typeof activityData[_d] == 'number'){
                                x.startTimestamp = new Date().getTime();
                            }
                        }
                        await __rpcClient.setActivity(x)
                        await sendNotification('The client was successfully connected, and the activity was recorded.');
                    }catch(e){
                        let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
                        console.log(`[${date}] The application could not register a new activity in the client.`);
                        console.log(`[${date}] The error simplified: ${e.message}`);
                        console.log(`[${date}] The unsimplified error:`);
                        console.log(e);
                        let _e = {
                            e: e,
                            message: 'Failed in register activity'
                        }
                        resolve(_e);
                    }
                });
                _register.then(_r => {
                    if(_r == true){
                        console.log(_r);
                        return 'Succesfully';
                    }else{
                        console.log(_r);
                        return _r.message;
                    }
                });
            }, time);
        });
    });
    ipcMain.handle('sendNotification', (event, message) => {
        sendNotification(message);
    });

    function sendNotification(message){
        let notification = new Notification({
            title: 'DiscordRPC - Made by Klout',
            icon: './appIcon.png',
            body: message
        });
    
        notification.show();
    }

});
