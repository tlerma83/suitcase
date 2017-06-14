"use strict";

app.controller("TopsCtrl", function($scope, $window, $location, $route, DataFactory, AuthFactory, $q){

    /** creates an eventlestener in angular to call materialize carousel function when ng-peat
    /** ...cycle has finished .....the $(document).ready(function(){}); provided by materialize /** does NOT work with ng-repeat*/
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.carousel').carousel();
    });

    var _video = null,
        patData = null;

    $scope.patOpts = {x: 25, y: 25, w: 25, h: 25};
    $scope.user = AuthFactory.getUser();


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
                DataFactory.saveTopsImage(imageBlobStuff, $scope.user, date)
                .then((response) => {
                    //create new element to carousel so it will update correctly after the page //loads, gives the ability to take multiple phtos without rewriting them
                    let newAnchor = document.createElement("a");
                    newAnchor.className = "carousel-item";

                    // create new img element to append to new anachor element, set the src
                    // attribute to the url that is given back in response.url
                    let newImg = document.createElement("img");
                    newImg.src = response.url;

                    newAnchor.appendChild(newImg);

                    // append new elements to carousel, jquery required the $ before the
                    // newAnchor variable
                    $('.carousel').append($(newAnchor));
                    // the carousel() had to be called again to update with new information

                    if ($('.carousel').hasClass("initialized")) {
                        $('.carousel').removeClass("initialized");
                    }
                    $('.carousel').carousel();
                });

            });

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


    let getPhotos = function () {
        console.log("anything????????");
        DataFactory.retrievePhotos($scope.user)
        .then((response) => {
            console.log("Is there a object line 98", response);
            $scope.imageArrayOfObj = response;

        });
    };

    getPhotos();


});
