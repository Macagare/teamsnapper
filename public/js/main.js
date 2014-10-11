app = (function(win, doc, undefined) {
	var timer
		, webcamEnabled = false
		, SNAP_TIMEOUT = 2000
        , userId = 0
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
    	, upload = function(data_uri) {
    		Webcam.upload( data_uri, '/upload/' + userId, function(code, text) {
                if ( code != 200 ) {
                    alert("failed to upload snapshot");
                }
		    } );
    	}
        , refreshUserImages = function(id) {
            $.get( "/images", function( data ) {
                deleteUserImages();
                addUserImages(data, id);
            }, "json" );
        }
        , deleteUserImages = function() {
            $("#imageGrid .snapshot").remove();
        }
        , getUserImage = function(id) {
            return id + ".jpg";
        }
        , addUserImages = function(filenames, excludeId) {
            for (var i = filenames.length - 1; i >= 0; i--) {
                if (filenames[i] != getUserImage(excludeId)) {
                    $( "#imageGrid" ).append( '<div class="snapshot"><img src="images/' + filenames[i] + '"></div>' );
                }
            };
        }
        , getQueryParamByName = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        , addListeners = function() {
            $("#snapshotContainer").on("click", takeSnapshot);
        };

	$(doc).ready(function(){
        userId = getQueryParamByName("id");
        startWebcamStream();
        addListeners();
        refreshUserImages(userId);
	});

	return {
		takePhoto: function() {
			takeSnapshot();
		},
        reloadImages:function() {
            refreshUserImages(userId);
        }
	};
})(window, document);