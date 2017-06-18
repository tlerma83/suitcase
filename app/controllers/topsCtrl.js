"use strict";

app.controller("TopsCtrl", function($scope, $window, $location, AuthFactory, $q, DataFactory, $route, $routeParams){

    $scope.suitName = $routeParams.suitTitle;
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.imageArrayOfObj = [];
    $scope.channel = {};
    $scope.patOpts = {x: 25, y: 25, w: 25, h: 25};
    $scope.user = AuthFactory.getUser();
    $scope.hideCamDiv = true;
    $scope.webcamError = false;
    $scope.tops = "tops";

    let _video = null,
        patData = null;

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        if ($('.carousel').hasClass("initialized")) {
            $('.carousel').removeClass("initialized");
        }
            $('.carousel').carousel();
    });


//    $(".button-collapse").sideNav();
      $('.button-collapse').sideNav({
      menuWidth: 400, // Default is 300
      edge: 'right', // Choose the horizontal origin
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    }
  );


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


    let getVideoData = function getVideoData(x, y, w, h) {
        let hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        let ctx = hiddenCanvas.getContext('2d');
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

        DataFactory.saveImage($scope.blob, $scope.user, date, $routeParams.suitcaseKey, $scope.tops)
        .then((response) => {
            $scope.imageArrayOfObj.push(response);
        });
    };


    let getPhotos = function () {
        $scope.counter = 0;
        DataFactory.retrievePhotos($routeParams.suitcaseKey, $scope.tops)
        .then((response) => {
            $scope.counter = response.length;
            $scope.imageArrayOfObj = response;
        });
    };


    $scope.deleteTops = function (photoObj) {
        let imageCount = angular.element(document.getElementsByClassName("carousel-item")).length;
        return DataFactory.deletePhoto(photoObj.key, $scope.tops)
        .then((response) => {
            $scope.counter--;
            let photoIndex = $scope.imageArrayOfObj.indexOf(photoObj);
            if (imageCount !== 0) {
                $scope.imageArrayOfObj.splice(photoIndex, 1);
                $route.reload();
            }
        });
    };


    $scope.deleteSuitcase = function (suitKey) {
        DataFactory.deleteSuitcase(suitKey)
        .then((response) => {
            $scope.imageArrayOfObj.forEach(function(photoObj){
                $scope.deleteTops(photoObj);
            });
            $window.location.href = "#!/navigation";
        });
    };

    getPhotos();

});
