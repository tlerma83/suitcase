"use strict";

app.controller("BottomsCtrl", function($scope, $window, $location, $route, DataFactory, AuthFactory, $q, $compile){

    /** creates an eventlestener in angular to call materialize carousel function when ng-peat
    /** ...cycle has finished .....the $(document).ready(function(){}); provided by materialize /** does NOT work with ng-repeat*/
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.carousel').carousel();
    });

    var _video = null,
        patData = null;

    $scope.patOpts = {x: 25, y: 25, w: 25, h: 25};
    $scope.user = AuthFactory.getUser();
    $scope.hideCamDiv = true;


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
                $scope.blob = imageBlobStuff;
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

    $scope.addToCarousel = function () {
        $scope.counter += 1;
        $scope.hideCamDiv = true;
        $scope.hideDiv = false;
        let date = new Date().getTime();
        DataFactory.saveBottomsImage($scope.blob, $scope.user, date)
        .then((response) => {
//            step 1
                    let cardDiv = document.createElement("div");
                    cardDiv.className = "carousel-item row";
                    cardDiv.setAttribute("id", `card--${response.key}`);

//           step 2
                    let columnSetDiv = document.createElement("div");
                    columnSetDiv.className = "col s12 m6";

//           step 3
                    let newImg = document.createElement("img");
                    newImg.src = response.url;

//           step 4
                    let newAnchor = document.createElement("a");
                    newAnchor.setAttribute("ng-click", `deleteBottoms('${response.key}')`);
                    newAnchor.className = "btn-floating halfway-fab waves-effect waves-light red";

//           step 5
                    let icon = document.createElement("i");
                    icon.className = "material-icons";
                    icon.innerHTML = "delete";

// append icon to "a" tag, now anchor element containing icon button
                    newAnchor.appendChild(icon);
//
//  append newImg and newAnchor to it's parent div , columnSetDiv
                    columnSetDiv.appendChild(newImg);
                    columnSetDiv.appendChild(newAnchor);
//                    cardDiv.appendChild(newImg);
//                    cardDiv.appendChild(newAnchor);
//
//  now append all of this to the caontainer div that has ng-repeat attached to it
                    cardDiv.appendChild(columnSetDiv);
                    let compiledCard = $compile(cardDiv.outerHTML)($scope);

                    angular.element(document.getElementsByClassName("carousel")[0]).append(compiledCard);

// append new elements to carousel, jquery required the $ before the newAnchor variable
//                    $('.carousel').append($(cardDiv));
// the carousel() had to be called again to update with new information

                    if ($('.carousel').hasClass("initialized")) {
                        $('.carousel').removeClass("initialized");
                    }
                    $('.carousel').carousel();
        });
    };


    let getPhotos = function () {
        $scope.counter = 0;
        DataFactory.retrieveBottomsPhotos($scope.user)
        .then((response) => {
            console.log("Is there a object line 149", response);
            for (let i = 0; i < response.length; i++) {
                $scope.counter = i + 1;
            }
            $scope.imageArrayOfObj = response;
        });
    };


    /******   Delete Single Bottoms Image ******/
    $scope.deleteBottoms = function (photoKey) {
        let imageCount = angular.element(document.getElementsByClassName("carousel-item")).length;
        return DataFactory.deleteBottomsImage(photoKey)
        .then((response) => {
            $scope.counter--;
            console.log("WHOOOO", response);
            angular.element(document.getElementById(`card--${photoKey}`)).remove();
            if ($('.carousel').hasClass("initialized")) {
                $('.carousel').removeClass("initialized");
            }
            if (imageCount !== 1) {
                $('.carousel').carousel();
            }
        });
    };

    getPhotos();
});
