// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var query = querystring.parse(global.location.search.substr(1))

//var vidId = global.location.search.substr(3)
var vidId = query.v
var pl = query.list

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    //var bloop = remote.getCurrentWindow().vidId.id
    //alert(bloop)
    var bloop = global.location.search
    if (pl == undefined) {
	player = new YT.Player('player', {
            height: '230',
            width: '408',
	    //videoId: '8LgFgojtJSw',
	    videoId: vidId,
	    //mediaContentUrl: 'https://www.youtube.com/watch?v=t98Tkz__kOg'
            events: {
		'onReady2': onPlayerReady,
		'onStateChange': onPlayerStateChange
            }
	})
    } else {
	player = new YT.Player('player', {
            height: '230',
            width: '408',
	    videoId: vidId,
	    //videoId: vidId,
	    //mediaContentUrl: 'https://www.youtube.com/watch?v=t98Tkz__kOg'
	    
            playerVars: {
		listType:'playlist',
		list: pl
            },
            events: {
		'onReady2': onPlayerReady,
		'onStateChange': onPlayerStateChange
            }
	})
    }
    player.cueVideoById("X3eDpsxdAZ8", 0, "large");
}

// 4. The API will call this function when the video player is ready.

var done = 0;
function onPlayerReady(event) {
    event.target.playVideo();
    done++;
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {

}

function stopVideo() {
    player.stopVideo();
}

vid.watch("id", function(prop,oldval,newval){
    //Your code
    alert(oldval)
    alert(newval)
    return newval;
});
