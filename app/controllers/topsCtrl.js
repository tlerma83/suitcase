"use strict";

app.controller("TopsCtrl", function($scope, $window, $location, AuthFactory, $q, DataFactory, $route, $routeParams){

    $scope.suitName = $routeParams.suitTitle;
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.imageArrayOfObj = [];
    $scope.user = AuthFactory.getUser();
    $scope.hideCamDiv = true;
    $scope.webcamError = false;
    $scope.tops = "tops";

    let _video = null;

    //this sets the size of the webcam view, videoWidth is the parameter name set by author of this install
    $scope.channel = {videoWidth: 500};

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        if ($('.carousel').hasClass("initialized")) {
            $('.carousel').removeClass("initialized");
        }
            $('.carousel').carousel();
    });


//    $(".button-collapse").sideNav();
      $('.button-collapse').sideNav({
      menuWidth: 550, // Default is 300
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
    };


	$scope.makeSnapshot = function() {
        $scope.hideDiv = true;
        $scope.hideCamDiv = false;

        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return; //this acts like a break within the function
            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            //grabs innards of canvas so it can be drawn to, returns drawing context of canvas
            // need this before canvas can be drawn on
            let contextofCanvas = patCanvas.getContext('2d');

            //drawImage() requires the source it draws from, ex. _video...this is first arg
            // next two arguments represent the x and y coordinates, starts at the top of a square, 0, 0
            //4th arg gets width of patCanvas.width object, 5th arg gives height
            //now this will draw to the canvas element with #snapshot ID
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
