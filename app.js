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
    ipcMain.handle('connect', (event, clientId, activityData) => {
        let __connect = new Promise((resolve, reject) => {
            try{
                __rpcClient.login({clientId}).then(c => {
                    resolve(c);
                });
            }catch(e){
                let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
                console.log(`[${date}] The application could not connect to the client.`);
                console.log(`[${date}] The error simplified: ${e.message}`);
                console.log(`[${date}] The unsimplified error:`);
                console.log(e);
                return;
            }
        });
        __connect.then(r => {
            if(r == 'Could not connect'){
                return 'Could not connect';
            }else if(r == 'connection closed'){
                return 'connection closed';
            }else if(r == 'RPC_CONNECTION_TIMEOUT'){
                return 'RPC_CONNECTION_TIMEOUT';
            }else{
                let _register = new Promise((resolve, reject) => {
                    try{
                        __rpcClient.setActivity({
                            details: (activityData.details) ? activityData.details : '',
                            state: (activityData.state) ? activityData.state : '',
                            startTimestamp: (activityData.timestamp == true) ? new Date().getTime() : null,
                            largeImageKey: (activityData.largeImageKey) ? activityData.largeImageKey : null,
                            largeImageText: (activityData.largeImageText) ? activityData.largeImageText : null,
                            smallImageKey: (activityData.smallImageKey) ? activityData.smallImageKey : null,
                            smallImageText: (activityData.smallImageText) ? activityData.smallImageText : null,
                            instance: false,
                        });
                        resolve(true);
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
                        return true;
                    }else{
                        return _r.message;
                    }
                });
            }
        });
    });
    ipcMain.handle('sendNotification', (event, message) => {
        let notification = new Notification({
            title: 'DiscordRPC - Made by Klout',
            icon: './appIcon.png',
            body: message
        });
    
        notification.show();
    });

});