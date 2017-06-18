"use strict";

app.controller("ListCtrl", function(DataFactory, AuthFactory, $routeParams, $location, $scope){

    $scope.user = AuthFactory.getUser();
    $scope.suitKey = $routeParams.suitcaseKey;
    console.log("key on lists page", $routeParams.suitcaseKey, $routeParams);


    $scope.menuItems = ["tops", "bottoms", "shoes"];
    $scope.imageArray = [];
    $scope.topArray = [];
    $scope.bottomArray = [];
    $scope.shoeArray = [];


$(document).ready(function() {
    $('select').material_select();
  });


$(document).ready(function(){
    $('.collapsible').collapsible();
  });


//    let getAllPhotos = function () {
//        $scope.menuItems.forEach(function(collectionType){
//            DataFactory.retrievePhotos($scope.suitKey, collectionType)
//            .then((response) => {
////                console.log("check response", response);
//                response.forEach(function(allObjs){
////                    console.log("What is all", allObjs);
//                    if (allObjs.type === $scope.menuItems[0]) {
//                        console.log("do I have array with tops collection", allObjs);
//                        holdObj.collection = $scope.menuItems[0];
//                        $scope.imageArray.tops = (holdObj);
//                    }else if (allObjs.type === $scope.menuItems[1]) {
//                        allObjs.collection = $scope.menuItems[1];
//                        $scope.imageArray.bottoms = (allObjs);
//                    }else if (allObjs.type === $scope.menuItems[2]) {
//                        allObjs.collection = $scope.menuItems[2];
//                        $scope.imageArray.shoes = (allObjs);
//
//                    }
//                });
//
//            });
//        });
//
//    };

    let getAllPhotos = function () {
        $scope.menuItems.forEach(function(collection){
            DataFactory.retrievePhotos($scope.suitKey, collection)
            .then((response) => {
                console.log("Any response?", response);
                response.forEach(function(objects){
                    if (objects.type === $scope.menuItems[0]) {
//                    console.log("checking for tops", objects);
                    $scope.topArray.push(objects);
                    }else if (objects.type === $scope.menuItems[1]) {
                        $scope.bottomArray.push(objects);
                    }else if (objects.type === $scope.menuItems[2]) {
                        $scope.shoeArray.push(objects);
                    }
                });

            });
        });
    };

    getAllPhotos();

});
