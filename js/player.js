var supportsVideo = !!document.createElement('video').canPlayType;
// Get the elements
var playerOuter = document.getElementById('player-outer');
var playerControls = document.getElementById('controls-outer');
var video = document.getElementById('video');
var playpause = document.getElementById('play-pause');
var bigplay = document.getElementById('bigplay');
var frameforward = document.getElementById('frame-forward');
var framebackward = document.getElementById('frame-backward');
var loop = document.getElementById('loop');
var fullscreen = document.getElementById('fullscreen');
var indicator = document.getElementById('indicator');
var addKeyFrameBtn = document.getElementById('keyframe');
// var keyList = document.getElementById('keyframe-list');
var keyTicks = document.getElementById('keyframe-ticks');
var progressOuter = document.getElementById('progress-outer');
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
var keyBackBtn = document.getElementById('keyleft');
var keyForwardBtn = document.getElementById('keyright');
var keyFrames = [];
// Show/hide controls
playerOuter.addEventListener("mouseenter", function() {
	if (playerControls.className === '') {
		playerControls.className = playerControls.className + 'active';
	}
});
playerOuter.addEventListener("mouseleave", function() {
	if (playerControls.className === 'active') {
		playerControls.className = '';
	}
});
// ACTIONS
function showHide(element, timeout) {
	element.className = 'visible';
	setTimeout(function() {
		element.className = 'hidden';
	}, timeout);
}
function bigPlay() {
	if (video.paused || video.ended) {
		bigplay.innerHTML = "||";
		showHide(bigplay, 250);
	} else {
		bigplay.innerHTML = ">";
		showHide(bigplay, 250);
	}
}
function playPause() {
	// Check video state
	if (video.paused || video.ended) {
		video.play();
		// playpause.innerHTML = "Pause";
	} else {
		video.pause();
		// playpause.innerHTML = "Play";
	}
	// Reset play speed
	if (video.playbackRate !== 1) {
		video.playbackRate = 1;
	}
	// Always hide speed indicator
	if(indicator.className === 'visible') {
		indicator.className = 'hidden';
	}
}
function frameForward(frames) {
	var frameRate = 24;
	var oneFrame = 1 / frameRate;
	var framesMoved = oneFrame * frames;
	if(video.paused){
		video.currentTime += framesMoved;
		indicator.innerHTML = "+";
		showHide(indicator, 1000);
	} else {
		video.pause();
	}
}
function frameBackward(frames) {
	var frameRate = 24;
	var oneFrame = 1 / frameRate;
	var framesMoved = oneFrame * frames;
	if(video.paused){
		video.currentTime -= framesMoved;
		indicator.innerHTML = "-";
		showHide(indicator, 1000);
	} else {
		video.pause();
	}
}
function keyForward() {
	var k = video.currentTime;
	var nextKey;
	var thisKeyIndex;
	// Push the new keyframe in the array
	keyFrames.push(k);
	// Sort keyframes
	keyFrames.sort(function(a, b) {
		return a - b;
	});
	thisKeyIndex = keyFrames.indexOf(k);
	nextKey = keyFrames[thisKeyIndex+1];
	// Don't skip to the same key
	if(nextKey === k) {
		nextKey = keyFrames[thisKeyIndex+2];
	}
	// Remove the temporary key
	keyFrames.splice(thisKeyIndex,1);
	if(nextKey) {
		video.currentTime = nextKey;
	}
}
function keyBackward() {
	var k = video.currentTime;
	var prevKey;
	var thisKeyIndex;
	keyFrames.push(k);
	keyFrames.sort(function(a, b) {
		return a - b;
	});
	thisKeyIndex = keyFrames.indexOf(k);
	prevKey = keyFrames[thisKeyIndex-1];
	if(prevKey === k) {
		prevKey = keyFrames[thisKeyIndex+2];
	}
	keyFrames.splice(thisKeyIndex,1);
	if(prevKey) {
		video.currentTime = prevKey;
	}
}
function addKeyFrame() {
	var k = video.currentTime;
	// Add keyframe to list if it doesn't already exist
	if(keyFrames.indexOf(k) === -1){
		keyFrames.push(k);
	}
	// Add keyframe tick to timeline
	var newKeyTick =  document.createElement("div");
	var newKeyTickOffset = (k / progress.max) * 100; // Calculate left margin percent
	newKeyTick.style.marginLeft  = newKeyTickOffset.toFixed(3) + '%';
	newKeyTick.style.marginLeft  = newKeyTickOffset.toFixed(3) + '%';
	newKeyTick.dataset.timecode = k;
	keyTicks.appendChild(newKeyTick);
}
function toggleLoop() {
	if(!video.loop) {
		video.loop = true;
		loop.className = 'active';
	} else {
		video.loop = false;
	}
	if (loop.className === 'btn') {
		loop.className = 'btn active';
	} else {
		loop.className = 'btn';
	}
}
function toggleFullScreen() {
	if (video.requestFullscreen) {
	  video.requestFullscreen();
	} else if (video.msRequestFullscreen) {
	  video.msRequestFullscreen();
	} else if (video.mozRequestFullScreen) {
	  video.mozRequestFullScreen();
	} else if (video.webkitRequestFullscreen) {
	  video.webkitRequestFullscreen();
	}
}
function jogForward() {
	if(video.paused) {
		playPause();
	}
	if(video.playbackRate === 1) {
		video.playbackRate = 2;
	} else {
		video.playbackRate += 1;
	}
	indicator.innerHTML = "x" + video.playbackRate;
	indicator.className = 'visible';
}
if (supportsVideo) {
	// Hide the default controls
	video.controls = false;
	// Key actions
	document.addEventListener("keydown", function (event) {
	    if (event.keyCode === 32 || event.keyCode === 75) {
	        // Spacebar, K key
			event.preventDefault();
	        playPause();
	        bigPlay();
	    } else if (event.keyCode === 37 || event.keyCode === 189) {
			event.preventDefault();
	       // left arrow, - key
	       frameBackward(1);
	    } else if (event.keyCode === 39 || event.keyCode === 187) {
			event.preventDefault();
	       // right arrow, + key
	       frameForward(1);
			 } else if (event.keyCode === 38) {
 	       // up arrow
				 event.preventDefault();
				 keyForward();
			 } else if (event.keyCode === 40) {
 	       // down arrow
				 event.preventDefault();
 	       keyBackward();
	    } else if (event.keyCode === 76) {
	    	// L key
	    	jogForward();
	    } else if (event.keyCode === 70 || event.keyCode === 191) {
	    	// F key, / key
				addKeyFrame();
	    } else if (event.keyCode === 68) {
	    	// D key
				keyBackward();
	    } else if (event.keyCode === 73) {
	    	// G key
				keyForward();
	    }
	});
	// Play/pause button
	playpause.addEventListener('click', function() {
		playPause();
	});
	// Frame forward button
	frameforward.addEventListener('click', function() {
		frameForward(1);
	});
	// Frame backward button
	framebackward.addEventListener('click', function() {
		frameBackward(1);
	});
	// Loop button
	loop.addEventListener('click', function() {
		toggleLoop();
	});
	// Fullscreen button
	fullscreen.addEventListener('click', function() {
		toggleFullScreen();
	});
	// Progress bar
	video.addEventListener('loadedmetadata', function() {
	   progress.setAttribute('max', video.duration);
	});
	video.addEventListener('timeupdate', function() {
	   if (!progress.getAttribute('max')) { progress.setAttribute('max', video.duration); }
	   progress.value = video.currentTime;
	   progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
	});
	progressOuter.addEventListener('click', function(e) {
	   var left = progress.offsetLeft;
	   var pos = (e.pageX - left) / progress.offsetWidth;
	   console.log(e.pageX);
	   video.currentTime = pos * video.duration;
	});
	// Keyframes
	keyForwardBtn.addEventListener('click', function() {
		keyForward();
	});
	keyBackBtn.addEventListener('click', function() {
		keyBackward();
	});
	// Add keyframe on button click
	addKeyFrameBtn.addEventListener('click', function() {
		addKeyFrame();
	});
}