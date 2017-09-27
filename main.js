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
    urls: ['https://www.youtube.com/watch?v=*',
	   'https://www.youtube.com/',
	   'https://www.youtube.com/watch?time_continue=*',
	   'https://www.youtube.com/watch?list=*',
	   'https://www.youtube.com/playlist*',
	   'https://www.youtube.com/feed*',
	   'https://www.youtube.com/channel*',
	   'https://www.youtube.com/results*'
	  ]
}

// playlist
// feed
// channel
// results

var youtube_url = 'https://www.youtube.com/'

var vidWidth = 428
var vidHeight = 250
var mainWidth = 800
var mainHeight = 600


var vidPos = null
var mainPos = null


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let vidWindow


function createWindow (isVid) {    // Create the browser window.
    var screenElectron = electron.screen;
    var mainScreen = screenElectron.getPrimaryDisplay();
    var dimensions = mainScreen.size;
    if (vidPos == null) {
	vidPos = [
	    dimensions.width-vidWidth,
	    dimensions.height-vidHeight
	]
    }
    if (mainPos == null) {
	mainPos = [
	    dimensions.width-mainWidth,
	    dimensions.height-mainHeight
	]
    }
    
    if (isVid) {
	vidWindow = new BrowserWindow({
	    width: vidWidth,
	    height: vidHeight,
	    x: vidPos[0],
	    y: vidPos[1],
	    alwaysOnTop: true,
	    focusable: false,
	    frame: false,
	    backgroundColor: '#000',
	    resizable: false,
	    movable: true
	})
    } else {
	mainWindow = new BrowserWindow({
	    width: mainWidth,
	    height: mainHeight,
	    x: mainPos[0],
	    y: mainPos[1],
	    alwaysOnTop: true,
	    webPreferences: {
		zoomFactor: 0.75
	    }
	})
    }
    
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
	mainWindow.loadURL(youtube_url);
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
	console.log(details)
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
	    if (query.v == undefined) {
		if (newUrl.indexOf('&pbj') != -1) {
		    var idpbj = newUrl.indexOf('&pbj')
		    youtube_url = newUrl.substring(0, idpbj)
		}
	    }
	    console.log('youtube url = ' + youtube_url)
	    console.log('Je suis une patate')
	    vid.id = null
	    vid.playList = null
	    if (mainWindow == null) {
		createWindow(false)
	    }
	    if (vidWindow != null) {
		vidPos = vidWindow.getPosition()
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
		console.log(vidWindow.getPosition())
		vidPos = vidWindow.getPosition()
		vidWindow.destroy()
		vidWindow = null;
	    }
	    createWindow(true)
	    if (mainWindow != null) {
		mainWidth = (mainWindow.getSize())[0]
		mainHeight = (mainWindow.getSize())[1]
		mainPos = mainWindow.getPosition()
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


