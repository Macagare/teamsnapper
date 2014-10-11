app = (function(win, doc, undefined) {
	var webcamEnabled = false
		, SNAP_TIMEOUT = 2000
        , userId = 0
        , refreshTimer = 0
        , TIMER_DELAY = 10000

		, takeSnapshot = function() {
            if ( webcamEnabled ) {
    			setTimeout(function(){
    				Webcam.snap( setPreview );
    			}, SNAP_TIMEOUT);
            }
    	}
    	, startWebcamStream = function(){
            Webcam.on("live", function() {
                webcamEnabled = true;
                $("#btnSnap").prop( "disabled", !webcamEnabled )
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
            $("#btnSnap").prop( "disabled", !webcamEnabled )
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
            $("#snapshotContainer").on("mouseover", onMouseOverSnapshotContainer);
            $("#snapshotContainer").on("mouseout", onMouseOutSnapshotContainer);
        }
        , onMouseOverSnapshotContainer = function() {
            console.log("onMouseOverSnapshotContainer");
            $("#actions").show();
        }
        , onMouseOutSnapshotContainer = function() {
            console.log("onMouseOutSnapshotContainer");
            $("#actions").hide();
        }
        , startRefreshUserImagesTimer = function() {
            stopRefreshUserImagesTimer();
            refreshTimer = setInterval( function() {
                refreshUserImages(userId);
                takeSnapshot();
            }, TIMER_DELAY );
        }
        , stopRefreshUserImagesTimer = function() {
            clearInterval(refreshTimer);
        }
        , init = function() {
            $("#btnSnap").prop( "disabled", !webcamEnabled )
            userId = getQueryParamByName("id");
            startWebcamStream();
            addListeners();
            refreshUserImages(userId);
            startRefreshUserImagesTimer();
        };

    $(doc).ready(function(){
        init();
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