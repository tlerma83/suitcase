"use strict";

app.controller('mainController', function($scope, DataFactory, AuthFactory) {
    var _video = null,
        patData = null;

    $scope.patOpts = {x: 25, y: 25, w: 25, h: 25};

    $scope.user = AuthFactory.getUser();
//    console.log("This is user", user);

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

        });
    };


	$scope.makeSnapshot = function() {
        $scope.hideDiv = true;
        $scope.hideCamDiv = false;
        let date = new Date().getTime();

        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;
            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            patCanvas.toBlob((imageBlobStuff, user) => {
                // toBlog returned an object and set type to "image/png"
            DataFactory.saveWebCamImage(imageBlobStuff, $scope.user, date);
            });

//            patData = idata;
        }
    };


    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };


    $scope.hideCanvas = function () {
        $scope.hideCamDiv = true;
        $scope.hideDiv = false;
    };
});
