"use strict";

app.controller('mainController', function($scope, DataFactory) {
    var _video = null,
        patData = null;

    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

    // Setup a channel to receive a video property
    // with a reference to the video element
    // See the HTML binding in main.html
    $scope.channel = {};

    $scope.webcamError = false;
    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    $scope.onSuccess = function () {
        // The video element contains the captured camera data
        _video = $scope.channel.video;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;
            //$scope.showDemos = true;
//            console.log("IS this showing data for imgs?", $scope.patOpts);
        });
    };

    $scope.onStream = function (stream) {
        // You could do something manually with the stream.
    };

	$scope.makeSnapshot = function() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');
            console.log("What is ctxPat line 56?", ctxPat);

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);
            console.log("What is patCanvas line 60?", patCanvas);
            // at this point patCanvas is return the canvas element that holds the snapshot and displays height and width

            patCanvas.toBlob((imageBlobStuff) => {
                // somehow the toBlog returned an object and gave it 2 key value pairs, one is size. This contains pixel amount, the other is type, this is "image/png"....that last part happened on its own
//               console.log("What does an image blob look like?", imageBlobStuff);
//                console.log("Current User?", currentUser);
                DataFactory.saveWebCamImage(imageBlobStuff);
            });



//            sendSnapshotToServer(patCanvas.toDataURL());
//            console.log("What is sendSnapshotToServer?", sendSnapshotToServer(patCanvas.toDataURL()));
//
//            patData = idata;
//            console.log("What is patData line 67?", patData);
        }
    };

    /**
     * Redirect the browser to the URL given.
     * Used to download the image by passing a dataURL string
     */
    $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
    };

    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);

        console.log("what is being returned after taking a picture?", ctx.getImageData(x ,y, w, h));
        return ctx.getImageData(x, y, w, h);
    };


//         var image = new Image();
//	       image.src = argument.toDataURL("image/png");
//            console.log("Is this a converted image?", image);
//	       return image;
    /**
     * This function could be used to send the image data
     * to a backend server that expects base64 encoded images.
     *
     * In this example, we simply store it in the scope for display.
     */
    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
//        console.log("What is $scope.snapshotData returning? line 96", $scope.snapshotData);
    };
});
