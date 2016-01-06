var supportsVideo = !!document.createElement('video').canPlayType;
// Get the elements
var playerWrap = document.getElementById('flipbook-js');
var playerOuter = document.getElementById('player-outer');
var playerControls = document.getElementById('controls-wrap');
var controlsOuter = document.getElementById('controls-outer');
var controlsInner = document.getElementById('controls-inner');
var video = document.getElementById('video');
var playpause = document.getElementById('play-pause');
var playIcon = document.getElementById('i-play');
var pauseIcon = document.getElementById('i-pause');
var bigplay = document.getElementById('big-play');
var bigPlayWrap = document.getElementById('big-play-wrap');
var frameforward = document.getElementById('frame-forward');
var framebackward = document.getElementById('frame-backward');
var loopBtn = document.getElementById('loop');
var audioBtn = document.getElementById('audio');
var timecodeBtn = document.getElementById('time');
var timecode = document.getElementById('timecode');
var fullscreenBtn = document.getElementById('fullscreen');
// var indicator = document.getElementById('indicator');
var keyframesOuter = document.getElementById('keyframes-outer');
var addKeyFrameBtn = document.getElementById('keyframe');
var progressOuter = document.getElementById('progress-outer');
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
var progressHover = document.getElementById('progress-hover');
var keyBackBtn = document.getElementById('keyleft');
var keyForwardBtn = document.getElementById('keyright');
var keyFrames = [];
// Show/hide controls
playerOuter.addEventListener("mouseenter", function() {
	if (playerControls.className === '' && bigPlayWrap.className != 'visible') {
		playerControls.className = playerControls.className + 'active';
	}
});
playerOuter.addEventListener("mouseleave", function() {
	if (playerControls.className === 'active') {
		playerControls.className = '';
	}
});
// ACTIONS
function hasClass(e, c) {
	if(e.className.search(c) >= 0) {
		return true;
	} else {
		return false;
	}
}
function isVisible(element) {
	var vis = getComputedStyle(progressHover).getPropertyValue('visibility');
	if(vis === 'hidden') {
		return false;
	} else {
		return true;
	}
}
function toggleClass(e, c) {
	var arrayClass = e.className.split(' ');
	var index = arrayClass.indexOf(c);
	if(hasClass(e,c)) {
		if (index > -1) {
			arrayClass.splice(index,1);
		}
	} else if(!hasClass(e,c)) {
		arrayClass.push(c);
	}
	var newClass = arrayClass.join(' ');
	e.className = newClass;
}
function addClass(e, c) {
	var arrayClass = e.className.split(' ');
	if(!hasClass(e,c)) {
		arrayClass.push(c);
	}
	var newClass = arrayClass.join(' ');
	e.className = newClass;
}
function showHide(element) {
	var initClass = element.className;
	var vis = isVisible(element);
	if(vis) {
		addClass(element,'visible');
	} else {
		addClass(element,'hidden');
	}
	toggleClass(element, 'hidden');
	toggleClass(element, 'visible');
}
function getCurrentFrame() {
	var f = Math.floor(video.currentTime * 24).toString();
	while (f.length < 3) {
		f = "0" + f;
	};
	return f;
}
function getTimelineFrame(x) {
	var left = playerOuter.offsetLeft + progressBar.offsetLeft;
	var pos = (x - left) / progress.offsetWidth;
	var time = pos * video.duration;
	return Math.floor(time * 24);
}
function bigPlay() {
	if (video.paused) {
		video.play();
		bigPlayWrap.setAttribute('class','hidden');
	} else {
		video.pause();
		bigPlayWrap.setAttribute('class','visible');
	}
}
function playPause() {
	// Check video state
	if (video.paused || video.ended) {
		video.play();
	} else {
		video.pause();
	}
	// Reset play speed
	if (video.playbackRate !== 1) {
		video.playbackRate = 1;
	}
}
function frameForward(frames) {
	var frameRate = 24;
	var oneFrame = 1 / frameRate;
	var framesMoved = oneFrame * frames;
	if(video.paused){
		video.currentTime += framesMoved;
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
	newKeyTick.style.left  = newKeyTickOffset.toFixed(3) + '%';
	newKeyTick.style.left  = newKeyTickOffset.toFixed(3) + '%';
	newKeyTick.dataset.timecode = k;
	keyframesOuter.appendChild(newKeyTick);
}
function toggleLoop() {
	if(!video.loop) {
		video.loop = true;
		loopBtn.className = 'btn inactive';
	} else {
		video.loop = false;
	}
	if (loopBtn.className === 'btn') {
		loopBtn.className = 'btn inactive';
	} else {
		loopBtn.className = 'btn';
	}
}
function setVolume(v) {
	if(!v) {
		if(video.volume === 0) {
			video.volume = 1;
		} else {
			video.volume = 0;
		}
	} else {
		video.volume = v;
	}
}
function updateTimecode() {
	timecode.innerHTML = getCurrentFrame();
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
}
if (supportsVideo) {
	// Hide the default controls
	video.controls = false;
	// Key actions
	playerOuter.addEventListener("keydown", function (event) {
	    if (event.keyCode === 32 || event.keyCode === 75) {
	        // Spacebar, K key
			event.preventDefault();
	        playPause();
	        // bigPlay();
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
	    	// jogForward();
	    	toggleLoop();
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
	// Big play button
	bigPlayWrap.addEventListener('click', function() {
		bigPlay();
	});
	video.addEventListener('click', function() {
		playPause();
		// bigPlay();
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
	loopBtn.addEventListener('click', function() {
		toggleLoop();
	});
	// Audio
	audioBtn.addEventListener('click', function() {
		setVolume();
	});
	video.addEventListener('volumechange', function() {
	   if(video.volume === 1) {
		   audioBtn.className = 'btn';
	   } else if(video.volume === 0) {
		   audioBtn.className = 'btn inactive';
	   }
	});
	// Timecode
	timecodeBtn.addEventListener('click', function() {
		if(timecode.className === 'timecode visible') { // DRY THIS UP
			timecode.className = 'timecode hidden';
			timecodeBtn.className = 'btn inactive';
		} else {
			timecode.className = 'timecode visible';
			timecodeBtn.className = 'btn';
		}
	});
	window.setInterval(updateTimecode, 24);
	// Fullscreen button
	fullscreenBtn.addEventListener('click', function() {
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
	   if (video.paused || video.ended) {
		   playIcon.setAttribute('class','visible');
		   pauseIcon.setAttribute('class','hidden');
		} else  {
			pauseIcon.setAttribute('class','visible');
		   	playIcon.setAttribute('class','hidden');
	   }
   	});
	progressOuter.addEventListener('click', function(e) {
	   var left = playerOuter.offsetLeft + progressBar.offsetLeft;
	   var pos = (e.pageX - left) / progress.offsetWidth;
	   var time = pos * video.duration;
	   video.currentTime = time;
	});
	// Show/hide hover
	progressOuter.addEventListener('mouseenter', function(e) {
		showHide(progressHover);
	});
	progressOuter.addEventListener('mouseleave', function(e) {
		showHide(progressHover);
	});
	progressOuter.addEventListener('mousemove', function(e) {
		// Update current frame in hover
		progressHover.innerHTML = getTimelineFrame(e.pageX);
		// Make hover follow mouse
		var left = playerOuter.offsetLeft + progressBar.offsetLeft;
 	   	var pos = (e.pageX - left) / progress.offsetWidth;
		var css = (Math.floor(pos * 100) - 1.5) + '%';
		progressHover.style.left = css;
	})
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
