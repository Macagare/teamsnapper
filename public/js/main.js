app = (function(win, doc, undefined) {
	var timer
		, webcamEnabled = false
		, SNAP_TIMEOUT = 3000
		, takeSnapshot = function() {
			console.log("takeSnapshot");
			if (!webcamEnabled) {
	  			Webcam.on("live", function() {
	  				setTimeout(function() {
	  					webcamEnabled = true;
	  					createSnapshot();
	  					turnOffCamera();
	  				}, SNAP_TIMEOUT);
	  			});
	  			Webcam.on("error", function(error) {
	  				alert(error);
	  			});
	  			startCapture();
	  		} else {
	  			Webcam.snap( setPreview );
	  		}
    	}
    	, createSnapshot = function() {
    		Webcam.snap( setPreview );
    	}
    	, startCapture = function(){
    		Webcam.attach( '#my_camera' );
    	}
    	, setPreview = function(data_uri) {
    		$("#my_result").html('<img src="'+data_uri+'"/>');
    	}
    	, turnOffCamera = function() {
    		webcamEnabled = false;
    		Webcam.reset();
    	};

	$(doc).ready(function(){
		
	});

	return {
		takePhoto: function() {
			takeSnapshot();
		}
	};
})(window, document);