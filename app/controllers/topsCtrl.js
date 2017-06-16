"use strict";

app.controller("TopsCtrl", function($scope, $window, $location, $route, AuthFactory, $q, $compile, KeyFactory, TopFactory, DataFactory){

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.carousel').carousel();
    });


    $scope.suitObj = KeyFactory;

    if($scope.suitObj.key !== "") {
       $scope.currentKey = $scope.suitObj.key;
    }else {
        $scope.currentKey = KeyFactory.existingKey;
    }

    $scope.imageArrayOfObj = [];

    var _video = null,
        patData = null;

    $scope.patOpts = {x: 25, y: 25, w: 25, h: 25};
    $scope.user = AuthFactory.getUser();
    $scope.hideCamDiv = true;

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
        _video = $scope.channel.video;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;

        });
    };


	$scope.makeSnapshot = function() {


        $scope.hideDiv = true;
        $scope.hideCamDiv = false;

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
//changed
    $scope.addToCarousel = function () {
        $scope.counter += 1;
        $scope.hideCamDiv = true;
        $scope.hideDiv = false;
        let date = new Date().getTime();

        TopFactory.saveTopsImage($scope.blob, $scope.user, date , $scope.currentKey)
        .then((response) => {
            $scope.imageArrayOfObj.push(response);
            let cardDiv = document.createElement("div");
            cardDiv.className = "carousel-item row";
            cardDiv.setAttribute("id", `card--${response.key}`);
            let columnSetDiv = document.createElement("div");
            columnSetDiv.className = "col s12 m6";
            let newImg = document.createElement("img");
            newImg.src = response.url;
            let newAnchor = document.createElement("a");
            newAnchor.setAttribute("ng-click", `deleteTops('${response.key}')`);
            newAnchor.className = "btn-floating halfway-fab waves-effect waves-light red";
            let icon = document.createElement("i");
            icon.className = "material-icons";
            icon.innerHTML = "delete";

            newAnchor.appendChild(icon);
            columnSetDiv.appendChild(newImg);
            columnSetDiv.appendChild(newAnchor);
            cardDiv.appendChild(columnSetDiv);

            let compiledCard = $compile(cardDiv.outerHTML)($scope);
            angular.element(document.getElementsByClassName("carousel")[0]).append(compiledCard);

            if ($('.carousel').hasClass("initialized")) {
                $('.carousel').removeClass("initialized");
            }
            $('.carousel').carousel();

        });
    };
//changed
    let getPhotos = function () {
        $scope.counter = 0;
        TopFactory.retrieveTopsPhotos(KeyFactory.existingKey)
        .then((response) => {
            console.log("Checking response in getPhotos", response);
            for (let i = 0; i < response.length; i++) {
                $scope.counter = i + 1;
            }
            $scope.imageArrayOfObj = response;

        });
    };
//changed
    $scope.deleteTops = function (photoKey) {
        let imageCount = angular.element(document.getElementsByClassName("carousel-item")).length;
        return TopFactory.deleteTopImage(photoKey)
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
//changed
    $scope.deleteSuitcase = function (suitKey) {
        DataFactory.deleteSuitcase(suitKey);
            console.log("I deleted your tops");
            $scope.imageArrayOfObj.forEach(function(topArray){
                $scope.deleteTops(topArray.key);
            });
    };

    getPhotos();

});
