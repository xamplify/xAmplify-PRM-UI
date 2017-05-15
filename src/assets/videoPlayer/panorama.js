var panoramaPlayer = (function(){
	function playVideo(videoId){
		var player = {};
		(function(window, videojs) {
	        player = videojs(videoId);
	        player.panorama({
	          autoMobileOrientation: true,
	          clickAndDrag: true,
	          clickToToggle: true,
	          callback: function () {
	            player.play();
	          }
	        });
	      }(window, window.videojs));
		return player;
	}
	
	
	return {
		playVideo : function(videoId){
			return playVideo(videoId);
		}
	}
})();
