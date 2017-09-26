const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const querystring = require('querystring')


const path = require('path')
const url = require('url')

var vid = {
    id: 'Mpsd6xS-FbQ',
    playList: 'PLG0dCKMzEcuzH1amINM-ptsvVEnZv-iyr'
}
const filter = {
    urls: ['https://www.youtube.com/watch?v=*', 'https://www.youtube.com/',  'https://www.youtube.com/watch?time_continue=*', 'https://www.youtube.com/watch?list=*']
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let vidWindow


function createWindow (isVid) {    // Create the browser window.
    var screenElectron = electron.screen;
    var mainScreen = screenElectron.getPrimaryDisplay();
    var dimensions = mainScreen.size;
    if (isVid) {
	vidWindow = new BrowserWindow({width: 428, height: 250, x: dimensions.width-428, y: dimensions.height-250, alwaysOnTop: true, focusable: false, transparent: true, frame: false, backgroundColor: '#000'})
    } else {
	mainWindow = new BrowserWindow({width: 800, height: 600, x: dimensions.width-800, y: dimensions.height-600, alwaysOnTop: true})
    }
    //mainWindow = new BrowserWindow({width: 428, height: 250, x: dimensions.width-428, y: dimensions.height-250, alwaysOnTop: true, focusable: false, transparent: true,  backgroundColor: '#000'})
    
    // and load the index.html of the app.
    
    
    
    if (isVid) {
	if (vid.playList == null) {
	    vidWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		search: 'v=' + vid.id,
		slashes: true
	    }))
	    console.log(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		search: 'v=' + vid.id,
		slashes: true
	    }))
	} else {
	    vidWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		search: 'v=' + vid.id + '&list=' + vid.playList,
		slashes: true
	    }))
	    console.log(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		search: 'v=' + vid.id + '&list=' + vid.playList,
		slashes: true
	    }))
	}
	
    } else {
	mainWindow.loadURL('https://www.youtube.com/');
    }
    //let contents = mainWindow.webContents
    //console.log(contents)
    
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    
    // Emitted when the window is closed.
    /*
    mainWindow.on('closed', function () {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null
    })
     vidWindow.on('closed', function () {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	vidWindow = null
    })
    */
}




    
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow(false)
    const session = electron.session
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
	var newUrl = details.url
	console.log(newUrl)
	var query = querystring.parse(newUrl.substr(30))
	console.log(query)
	var newId = ''
	var newPlaylist = ''
	if (query.v != undefined) {
	    newId = query.v
	}
	
	if (query.list != undefined) {
	    newPlaylist = query.list
	}    
	//var newId = parsevid('v', newUrl)
	//console.log(newId)
	if (newId == vid.id || (newPlaylist == vid.playList && vid.playList != '')) {
	    newId = ''
	}
	if (newId == '') {
	    console.log('Je suis une patate')
	    vid.id = null
	    vid.playList = null
	    if (mainWindow == null) {
		createWindow(false)
	    }
	    if (vidWindow != null) {
		vidWindow.destroy()
		vidWindow = null;
	    }
	    //createWindow()
	    callback({cancel: false, requestHeaders: details.requestHeaders})
	} else {
	    console.log('Je suis une carotte')
	    callback({cancel: true, requestHeaders: details.requestHeaders})
	    vid.id = newId
	    vid.playList = newPlaylist
	    //mainWindow.setVisibleOnAllWorkspaces(false)
	    if (vidWindow != null) {
		vidWindow.destroy()
		vidWindow = null;
	    }
	    createWindow(true)
	    if (mainWindow != null) {
		mainWindow.destroy()
		mainWindow = null
	    }
	}
    })
    
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
	app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
	createWindow()
    }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

