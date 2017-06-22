"use strict";

app.controller("ClosetCtrl", function($scope, $window, $location, AuthFactory, DataFactory, $q, $route, $routeParams){

    $scope.suitName = $routeParams.suitTitle;
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.user = AuthFactory.getUser();
    $scope.closet = "closet";
    $scope.topsArray = [];
    $scope.bottomsArray = [];
    $scope.shoesArray = [];
    $scope.toast = true;
    $scope.tops = "tops";
    $scope.bottoms = "bottoms";
    $scope.shoes = "shoes";

    $scope.menuItems = [
        {name: "tops"},
        {name: "bottoms"},
        {name: "shoes"}
    ];




    $scope.addToCloset = function (item) {
        $scope.counter++;
        if($scope.toast === true) {
            Materialize.toast('Saved to Closet', 2000, 'rounded');
            $('.tooltipped').tooltip('remove');
        }
        let closet = {};
        closet.uid = item.uid;
//        closet.key = item.key;
        closet.storage_ref = item.storage_ref;
        closet.type = item.type;
        closet.url = item.url;
        DataFactory.addToCloset(closet)
        .then((response) => {
            $scope.closetKey = response;
        });
    };

    let getCloset = function () {
        $scope.counter = 0;
        DataFactory.getCloset($scope.user)
        .then((response) => {
            $scope.closetObject = response;
            $scope.counter = response.length;

        });
    };


    $scope.fromClosetToSuitCase = function (imgObj) {
        imgObj.suitcase = $scope.suitKey;
        DataFactory.addClosetToSuitcase(imgObj)
        .then((response) => {
        });
    };


    $scope.addTopsToCloset = function () {
        $scope.toast = false;
        Materialize.toast('Saved to Closet!', 2000, 'rounded');
        DataFactory.retrievePhotos($scope.suitKey, $scope.tops)
        .then((response) => {
            $scope.topsArray = response;
            console.log("what came back from tops", $scope.topsArray);
            $scope.topsArray.forEach(function(object){
                $scope.addToCloset(object);
            });
        });
    };

    $scope.addBottomsToCloset = function () {
        $scope.toast = false;
        Materialize.toast('Saved to Closet!', 2000, 'rounded');
        DataFactory.retrievePhotos($scope.suitKey, $scope.bottoms)
        .then((response) => {
            $scope.bottomsArray = response;
            $scope.bottomsArray.forEach(function(object){
                $scope.addToCloset(object);
            });
        });
    };

    $scope.addShoesToCloset = function () {
        $scope.toast = false;
        Materialize.toast('Saved to Closet!', 2000, 'rounded');
        DataFactory.retrievePhotos($scope.suitKey, $scope.shoes)
        .then((response) =>{
            $scope.shoesArray = response;
            $scope.shoesArray.forEach(function(object){
                $scope.addToCloset(object);
            });
        });
    };


    //retrieves all photos for suitcase
    $scope.addAllToCloset = function () {

        console.log("was I clicked");
        $scope.menuItems.forEach(function(item){
            DataFactory.retrievePhotos($scope.suitKey, item.name)
            .then((response) => {
                console.log("response", response);
                response.forEach(function(objects){
                    $scope.addToCloset(objects);
//                    $scope.closetObject.push(objects);
                    if(response.type === "tops") {
//                        $scope.topsArray.push(objects);
                        $scope.addToCloset(objects);
                    }else if(response.type === "bottoms") {
//                        $scope.bottomsArray.push(objects);
                            $scope.addToCloset(objects);
                    }else if (response.type === "shoes") {
//                        $scope.shoesArray.push(objects);
                            $scope.addToCloset(objects);
                    }
                });
            });
        });
    };


    $scope.deleteFromCloset = function (data) {
        DataFactory.deleteFromCloset(data.closet_key)
        .then((response) => {
            let closetIndex = $scope.closetObject.indexOf(data);
            $scope.closetObject.splice(closetIndex, 1);
            $scope.counter--;
        });
    };





    getCloset();

});
