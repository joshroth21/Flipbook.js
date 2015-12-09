function hasClass(e,t){return e.className.search(t)>=0?!0:!1}function isVisible(e){var t=getComputedStyle(progressHover).getPropertyValue("visibility");return"hidden"===t?!1:!0}function toggleClass(e,t){var o=e.className.split(" "),r=o.indexOf(t);hasClass(e,t)?r>-1&&o.splice(r,1):hasClass(e,t)||o.push(t);var a=o.join(" ");e.className=a}function addClass(e,t){var o=e.className.split(" ");hasClass(e,t)||o.push(t);var r=o.join(" ");e.className=r}function showHide(e){var t=e.className,o=isVisible(e);o?addClass(e,"visible"):addClass(e,"hidden"),toggleClass(e,"hidden"),toggleClass(e,"visible")}function getCurrentFrame(){for(var e=Math.floor(24*video.currentTime).toString();e.length<3;)e="0"+e;return e}function getTimelineFrame(e){var t=playerOuter.offsetLeft+progressBar.offsetLeft,o=(e-t)/progress.offsetWidth,r=o*video.duration;return Math.floor(24*r)}function bigPlay(){video.paused?(video.play(),bigPlayWrap.setAttribute("class","hidden")):(video.pause(),bigPlayWrap.setAttribute("class","visible"))}function playPause(){video.paused||video.ended?video.play():video.pause(),1!==video.playbackRate&&(video.playbackRate=1)}function frameForward(e){var t=24,o=1/t,r=o*e;video.paused?video.currentTime+=r:video.pause()}function frameBackward(e){var t=24,o=1/t,r=o*e;video.paused?video.currentTime-=r:video.pause()}function keyForward(){var e=video.currentTime,t,o;keyFrames.push(e),keyFrames.sort(function(e,t){return e-t}),o=keyFrames.indexOf(e),t=keyFrames[o+1],t===e&&(t=keyFrames[o+2]),keyFrames.splice(o,1),t&&(video.currentTime=t)}function keyBackward(){var e=video.currentTime,t,o;keyFrames.push(e),keyFrames.sort(function(e,t){return e-t}),o=keyFrames.indexOf(e),t=keyFrames[o-1],t===e&&(t=keyFrames[o+2]),keyFrames.splice(o,1),t&&(video.currentTime=t)}function addKeyFrame(){var e=video.currentTime;-1===keyFrames.indexOf(e)&&keyFrames.push(e);var t=document.createElement("div"),o=e/progress.max*100;t.style.left=o.toFixed(3)+"%",t.style.left=o.toFixed(3)+"%",t.dataset.timecode=e,keyframesOuter.appendChild(t)}function toggleLoop(){video.loop?video.loop=!1:(video.loop=!0,loopBtn.className="btn inactive"),"btn"===loopBtn.className?loopBtn.className="btn inactive":loopBtn.className="btn"}function setVolume(e){e?video.volume=e:0===video.volume?video.volume=1:video.volume=0}function updateTimecode(){timecode.innerHTML=getCurrentFrame()}function toggleFullScreen(){video.requestFullscreen?video.requestFullscreen():video.msRequestFullscreen?video.msRequestFullscreen():video.mozRequestFullScreen?video.mozRequestFullScreen():video.webkitRequestFullscreen&&video.webkitRequestFullscreen()}function jogForward(){video.paused&&playPause(),1===video.playbackRate?video.playbackRate=2:video.playbackRate+=1}var supportsVideo=!!document.createElement("video").canPlayType,playerWrap=document.getElementById("flipbook-js"),playerOuter=document.getElementById("player-outer"),playerControls=document.getElementById("controls-wrap"),controlsOuter=document.getElementById("controls-outer"),controlsInner=document.getElementById("controls-inner"),video=document.getElementById("video"),playpause=document.getElementById("play-pause"),playIcon=document.getElementById("i-play"),pauseIcon=document.getElementById("i-pause"),bigplay=document.getElementById("big-play"),bigPlayWrap=document.getElementById("big-play-wrap"),frameforward=document.getElementById("frame-forward"),framebackward=document.getElementById("frame-backward"),loopBtn=document.getElementById("loop"),audioBtn=document.getElementById("audio"),timecodeBtn=document.getElementById("time"),timecode=document.getElementById("timecode"),fullscreenBtn=document.getElementById("fullscreen"),keyframesOuter=document.getElementById("keyframes-outer"),addKeyFrameBtn=document.getElementById("keyframe"),progressOuter=document.getElementById("progress-outer"),progress=document.getElementById("progress"),progressBar=document.getElementById("progress-bar"),progressHover=document.getElementById("progress-hover"),keyBackBtn=document.getElementById("keyleft"),keyForwardBtn=document.getElementById("keyright"),keyFrames=[];playerOuter.addEventListener("mouseenter",function(){""===playerControls.className&&"visible"!=bigPlayWrap.className&&(playerControls.className=playerControls.className+"active")}),playerOuter.addEventListener("mouseleave",function(){"active"===playerControls.className&&(playerControls.className="")}),supportsVideo&&(video.controls=!1,playerOuter.addEventListener("keydown",function(e){32===e.keyCode||75===e.keyCode?(e.preventDefault(),playPause()):37===e.keyCode||189===e.keyCode?(e.preventDefault(),frameBackward(1)):39===e.keyCode||187===e.keyCode?(e.preventDefault(),frameForward(1)):38===e.keyCode?(e.preventDefault(),keyForward()):40===e.keyCode?(e.preventDefault(),keyBackward()):76===e.keyCode?jogForward():70===e.keyCode||191===e.keyCode?addKeyFrame():68===e.keyCode?keyBackward():73===e.keyCode&&keyForward()}),bigPlayWrap.addEventListener("click",function(){bigPlay()}),video.addEventListener("click",function(){playPause()}),playpause.addEventListener("click",function(){playPause()}),frameforward.addEventListener("click",function(){frameForward(1)}),framebackward.addEventListener("click",function(){frameBackward(1)}),loopBtn.addEventListener("click",function(){toggleLoop()}),audioBtn.addEventListener("click",function(){setVolume()}),video.addEventListener("volumechange",function(){1===video.volume?audioBtn.className="btn":0===video.volume&&(audioBtn.className="btn inactive")}),timecodeBtn.addEventListener("click",function(){"timecode visible"===timecode.className?(timecode.className="timecode hidden",timecodeBtn.className="btn inactive"):(timecode.className="timecode visible",timecodeBtn.className="btn")}),window.setInterval(updateTimecode,24),fullscreenBtn.addEventListener("click",function(){toggleFullScreen()}),video.addEventListener("loadedmetadata",function(){progress.setAttribute("max",video.duration)}),video.addEventListener("timeupdate",function(){progress.getAttribute("max")||progress.setAttribute("max",video.duration),progress.value=video.currentTime,progressBar.style.width=Math.floor(video.currentTime/video.duration*100)+"%",video.paused||video.ended?(playIcon.setAttribute("class","visible"),pauseIcon.setAttribute("class","hidden")):(pauseIcon.setAttribute("class","visible"),playIcon.setAttribute("class","hidden"))}),progressOuter.addEventListener("click",function(e){var t=playerOuter.offsetLeft+progressBar.offsetLeft,o=(e.pageX-t)/progress.offsetWidth,r=o*video.duration;video.currentTime=r}),progressOuter.addEventListener("mouseenter",function(e){showHide(progressHover)}),progressOuter.addEventListener("mouseleave",function(e){showHide(progressHover)}),progressOuter.addEventListener("mousemove",function(e){progressHover.innerHTML=getTimelineFrame(e.pageX);var t=playerOuter.offsetLeft+progressBar.offsetLeft,o=(e.pageX-t)/progress.offsetWidth,r=Math.floor(100*o)-1.5+"%";progressHover.style.left=r}),keyForwardBtn.addEventListener("click",function(){keyForward()}),keyBackBtn.addEventListener("click",function(){keyBackward()}),addKeyFrameBtn.addEventListener("click",function(){addKeyFrame()}));