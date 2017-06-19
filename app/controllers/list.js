"use strict";

app.controller("ListCtrl", function(DataFactory, AuthFactory, $routeParams, $location, $scope, $route){

    $scope.user = AuthFactory.getUser();
    $scope.suitKey = $routeParams.suitcaseKey;
    console.log("key on lists page", $routeParams.suitcaseKey, $routeParams);


    $scope.menuItems = ["tops", "bottoms", "shoes"];
    $scope.imageArray = [];
    $scope.topArray = [];
    $scope.bottomArray = [];
    $scope.shoeArray = [];
    $scope.addLabelText = false;
    $scope.newLabel = {title: ""};
    $scope.labelObj = {};
    $scope.label = "label";
    $scope.list = "list";
    $scope.listObj = {title: ""};
    $scope.listArray = [];


    $scope.addNewLabel = function () {
        $("#label-modal").modal("close");
        $scope.newLabel.suitcase = $scope.suitKey;
        $scope.newLabel.uid = $scope.user;
        DataFactory.createLabel($scope.newLabel)
        .then((response) => {
            $scope.newKey = response.data.name;
        })
        .then((response) => {
            DataFactory.getlabel($scope.newKey)
            .then((response) => {
                $scope.labelObj.title = response.data.title;
                $route.reload();
            });
        });
    };

    let getLabels = function () {
        DataFactory.getAllLabels($scope.suitKey, $scope.label)
        .then((response) => {
            console.log("all labels", response);
            $scope.labelObj = response;
            allLists();
        });
    };



    $scope.deleteLabel = function (labelKey) {
        console.log("anything?");
        DataFactory.deletePhoto(labelKey, $scope.label)
        .then((response) => {
            let labelIndex = $scope.labelObj.indexOf(labelKey);
            $scope.labelObj.splice(labelIndex, 1);
            $route.reload();

        });
    };

    $scope.addListItem = function (labelKey) {
        $scope.listObj.uid = $scope.user;
        $scope.listObj.suitcase = $scope.suitKey;
        $scope.listObj.label_key= labelKey;
        console.log("check ng model", $scope.listObj);
        DataFactory.postListItem($scope.listObj)
        .then((response) => {
            let newListObjObj = {};
            newListObjObj.list_key = response;
            newListObjObj.label_key = labelKey;
            newListObjObj.title = $scope.listObj.title;
            newListObjObj.suitcase = $scope.suitKey;
            $scope.listArray.push(newListObjObj);
            $scope.listObj.title = "";
        });
    };

    let allLists = function () {
        DataFactory.getAllLists($scope.suitKey, $scope.list)
        .then((response) => {
            console.log("What came back line 82", response);
            $scope.listArray = response;
            console.log("check array", $scope.listArray);
        });
    };

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
//    allLists();
    getLabels();

});
