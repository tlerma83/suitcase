"use strict";

app.controller("BottomsCtrl", function($scope, $window, $location, AuthFactory, DataFactory, $q, $route, $routeParams){

    $scope.suitName = $routeParams.suitTitle;
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.imageArrayOfObj = [];
    $scope.hideTitle = true;
    $scope.user = AuthFactory.getUser();
    $scope.hideCamDiv = true;
    $scope.webcamError = false;
    $scope.bottoms = "bottoms";
    $scope.emptyPhotosMessage = true;

    let _video = null;

    $scope.channel = {videoWidth: 500};


    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        if ($('.carousel').hasClass("initialized")) {
            $('.carousel').removeClass("initialized");
        }
            $('.carousel').carousel();
    });

    $('.button-collapse').sideNav({
      menuWidth: 550,
      edge: 'right',
      closeOnClick: false,
      draggable: true
    });



    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    $scope.onSuccess = function () {
        _video = $scope.channel.video;
    };


	$scope.makeSnapshot = function() {
        $scope.hideDiv = true;
        $scope.hideCamDiv = false;
        $scope.emptyPhotosMessage = true;

        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;
            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            let contextofCanvas = patCanvas.getContext('2d');
            contextofCanvas.drawImage(_video, 0, 0, patCanvas.width, patCanvas.height);
            patCanvas.toBlob((imageBlobStuff, user) => {
                $scope.blob = imageBlobStuff;
            });
        }
    };


    $scope.hideCanvas = function () {
        $scope.hideCamDiv = true;
        $scope.hideDiv = false;
    };


    $scope.addToCarousel = function () {
        Materialize.toast('Add to Suitcase!', 3000, 'rounded');
        $('.tooltipped').tooltip('remove');
        $scope.counter += 1;
        $scope.hideCamDiv = true;
        $scope.hideDiv = false;
        let date = new Date().getTime();

        DataFactory.saveImage($scope.blob, $scope.user, date, $routeParams.suitcaseKey, $scope.bottoms)
        .then((response) => {
            $scope.imageArrayOfObj.push(response);
        });
    };


    let getPhotos = function () {
        $scope.counter = 0;
        DataFactory.retrievePhotos($routeParams.suitcaseKey, $scope.bottoms)
        .then((response) => {
            $scope.counter = response.length;
            $scope.imageArrayOfObj = response;
            if($scope.counter < 1) {
                $scope.emptyPhotosMessage = false;
            }
        });
    };


    $scope.deleteBottoms = function (photoObj) {
        let imageCount = angular.element(document.getElementsByClassName("carousel-item")).length;
        return DataFactory.deletePhoto(photoObj.key, $scope.bottoms)
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
                $scope.deleteBottoms(photoObj);
            });
            $window.location.href = "#!/navigation";
        });
    };

    getPhotos();
});
