app = (function(win, doc, undefined) {
	var timer
		, webcamEnabled = false
		, SNAP_TIMEOUT = 2000
		, takeSnapshot = function() {
			setTimeout(function(){
				Webcam.snap( setPreview );
			}, SNAP_TIMEOUT);
    	}
    	, startWebcamStream = function(){
            Webcam.on("live", function() {
                webcamEnabled = true;
            });
            Webcam.on("error", function(error) {
                alert(error);
            })
    		Webcam.attach( '#my_camera' );
    	}
    	, setPreview = function(data_uri) {
    		$("#my_result").html('<img src="'+data_uri+'"/>');
    		upload( data_uri );
    	}
    	, stopWebcamStream = function() {
    		webcamEnabled = false;
    		Webcam.reset();
    	}
    	, freezeStream = function() {
    		Webcam.freeze();
    	}, upload = function(data_uri) {
    		Webcam.upload( data_uri, '/upload/123', function(code, text) {
		        console.log(code, text);
		    } );
    	}
        , refreshUserImages = function() {
            $.get( "/images", function( data ) {
                deleteUserImages();
                addUserImages(data);
            }, "json" );
        }
        , deleteUserImages = function() {
            $("#imageGrid .snapshot").remove();
        }
        , addUserImages = function(filenames) {
            for (var i = filenames.length - 1; i >= 0; i--) {
                $( "#imageGrid" ).append( '<div class="snapshot"><img src="images/' + filenames[i] + '"></div>' );
            };
        };

	$(doc).ready(function(){
		startWebcamStream();
        refreshUserImages();
	});

	return {
		takePhoto: function() {
			takeSnapshot();
		},
        reloadImages:function() {
            refreshUserImages();
        }
	};
})(window, document);