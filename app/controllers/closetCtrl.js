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


    $scope.menuItems = [
        {name: "tops"},
        {name: "bottoms"},
        {name: "shoes"}
    ];




    $scope.addToCloset = function (item) {
        if($scope.toast === true) {
            Materialize.toast('Saved to Closet', 3000);
            $('.tooltipped').tooltip('remove');
        }
//        Materialize.toast('Saved to Closet', 3000);

        let closet = {};
        console.log("what is type", item);
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
        DataFactory.getCloset($scope.user)
        .then((response) => {
            $scope.closetObject = response;
//            console.log("closet contents", $scope.closetObject);
        });
    };


    $scope.fromClosetToSuitCase = function (imgObj) {
        imgObj.suitcase = $scope.suitKey;
//        console.log("did suitcase key transfer", imgObj);
        DataFactory.addClosetToSuitcase(imgObj)
        .then((response) => {
//            console.log("what happend to photo", response);
        });
    };


    //retrieves all photos for suitcase
    $scope.addAllToCloset = function () {
        $scope.taost = false;
        Materialize.toast('Saved to Closet!', 3000, 'rounded');
        console.log("was I clicked");
        $scope.menuItems.forEach(function(item){
            console.log("type", item.name);
            DataFactory.retrievePhotos($scope.suitKey, item.name)
            .then((response) => {
                console.log("response", response);
                response.forEach(function(object){
                    $scope.addToCloset(object);
//                    $scope.closetObject.push(object);
//                    if(object.type === "tops") {
//                        $scope.topsArray.push(object);
//                        $scope.topsArray.forEach(function(thingy){
//                            $scope.addToCloset(thingy);
//                            console.log("this happened");
//                        });
//                    }else if(object.type === "bottoms") {
//                        $scope.bottomsArray.push(object);
//                        $scope.bottomsArray.forEach(function(thingy){
//                            $scope.addToCloset(thingy);
//                        });
//                    }else if (object.type === "shoes") {
//                        $scope.shoesArray.push(object);
//                        $scope.shoesArray.forEach(function(thingy){
//                            $scope.addToCloset(thingy);
//                        });
//                    }
                });
            });
        });
    };


    $scope.deleteFromCloset = function (data) {
        DataFactory.deleteFromCloset(data.closet_key)
        .then((response) => {
            let closetIndex = $scope.closetObject.indexOf(data);
            $scope.closetObject.splice(closetIndex, 1);
        });
    };


    getCloset();

});
