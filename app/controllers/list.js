"use strict";

app.controller("ListCtrl", function(DataFactory, AuthFactory, $routeParams, $location, $scope, $route){

    $scope.user = AuthFactory.getUser();
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.suitName = $routeParams.suitTitle;
    $scope.menuItems = ["tops", "bottoms", "shoes"];
    $scope.imageArray = [];
    $scope.topArray = [];
    $scope.bottomArray = [];
    $scope.shoeArray = [];
    $scope.listArray = [];
    $scope.counterArray = [];
    $scope.packListArray = [];
    $scope.labelObj = {};
    $scope.addLabelText = false;
    $scope.newLabel = {title: ""};
    $scope.label = "label";
    $scope.list = "list";
    $scope.listObj = {list_title: ""};
//    $scope.counter = 0;



    $(document).ready(function(){
        $('.collapsible').collapsible();
    });


    $scope.addNewLabel = function () {
        if ($scope.newLabel.title === "") return;
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
            $scope.labelObj = response;
            allLists();
        });
    };


    $scope.deleteLabel = function (labelKey) {
        DataFactory.deletePhoto(labelKey, $scope.label)
        .then((response) => {
            let labelIndex = $scope.labelObj.indexOf(labelKey);
            $scope.labelObj.splice(labelIndex, 1);
            $scope.listArray.forEach(function(item){
                $scope.deleteListItem(item);
            });
        });
    };

    $scope.addListItem = function (labelKey) {
        console.log("label, key", labelKey);
        $scope.listObj.uid = $scope.user;
        $scope.listObj.suitcase = $scope.suitKey;
        $scope.listObj.label_key= labelKey.label_key;
        DataFactory.postListItem($scope.listObj)
        .then((response) => {
            let newListObjObj = {};
            newListObjObj.list_key = response;
            newListObjObj.label_key = labelKey.label_key;
            newListObjObj.list_title = $scope.listObj.list_title;
            newListObjObj.suitcase = $scope.suitKey;
            $scope.listArray.push(newListObjObj);
            $scope.listObj.list_title = "";
        });
    };

    let allLists = function () {
        DataFactory.getAllLists($scope.suitKey, $scope.list)
        .then((response) => {
            $scope.listArray = response;
            console.log("allllll", $scope.listArray);
        });
    };

    $scope.deleteListItem = function (listObj) {
        DataFactory.deleteListItem(listObj.list_key)
        .then((response) => {
            let listIndex = $scope.listArray.indexOf(listObj.list_key);
            $scope.listArray.splice(listIndex, 1);
        });
    };



    let getAllPhotos = function () {
        $scope.counter = 0;
        $scope.menuItems.forEach(function(collection){
            DataFactory.retrievePhotos($scope.suitKey, collection)
            .then((response) => {
                response.forEach(function(objects){
                    $scope.counter++;
                    if (objects.type === $scope.menuItems[0]) {
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

    //get single label
    $scope.saveLabelAndList = function (object) {
        $scope.labelListObj = {};
        DataFactory.getSingleList(object.label_key)
        .then((response) => {
            $scope.labelListObj.title = object.title;
            $scope.labelListObj.uid = object.uid;
            $scope.labelListObj.list_title = response.list_title;
            console.log("new lablist obj", $scope.labelListObj);
            DataFactory.postSavedPackList($scope.labelListObj);
        })
        .then((response) => {
            console.log("success with new list", response);
        });

    };

    let getAllPackLists = function () {
        DataFactory.getSavedPackList($scope.user)
        .then((response) =>{
            console.log("everything after DF and FB", response);
            response.forEach(function(item){
                $scope.packListArray.push(item);
            });
        });
    };






    allLists();
    getAllPhotos();
    getLabels();
    getAllPackLists();
});












//"use strict";
//
//app.controller("ListCtrl", function(DataFactory, AuthFactory, $routeParams, $location, $scope, $route){
//
//    $scope.user = AuthFactory.getUser();
//    $scope.suitKey = $routeParams.suitcaseKey;
//    $scope.suitName = $routeParams.suitTitle;
//    $scope.menuItems = ["tops", "bottoms", "shoes"];
//    $scope.imageArray = [];
//    $scope.topArray = [];
//    $scope.bottomArray = [];
//    $scope.shoeArray = [];
//    $scope.listArray = [];
//    $scope.counterArray = [];
//    $scope.packListArray = [];
//    $scope.labelObj = {};
//    $scope.addLabelText = false;
//    $scope.newLabel = {title: ""};
//    $scope.label = "label";
//    $scope.list = "list";
//    $scope.listObj = {title: ""};
////    $scope.counter = 0;
//
//
//
//    $(document).ready(function(){
//        $('.collapsible').collapsible();
//    });
//
//
//    $scope.addNewLabel = function () {
//        if ($scope.newLabel.title === "") return;
//        $("#label-modal").modal("close");
//        $scope.newLabel.suitcase = $scope.suitKey;
//        $scope.newLabel.uid = $scope.user;
//        DataFactory.createLabel($scope.newLabel)
//        .then((response) => {
//            $scope.newKey = response.data.name;
//        })
//        .then((response) => {
//            DataFactory.getlabel($scope.newKey)
//            .then((response) => {
//                $scope.labelObj.title = response.data.title;
//                $route.reload();
//            });
//        });
//    };
//
//    $scope.AddToCurrentList= function (list) {
//        list.suitcase = $scope.suitKey;
//        DataFactory.createLabel(list)
//        .then((response) => {
//            $scope.newKey = response.data.name;
//            DataFactory.getlabel($scope.newKey)
//            .then((response) => {
//                $scope.labelObj.title = response.data.title;
//                $route.reload();
//            });
//        });
//
//    };
//
//
//
//
//    let getLabels = function () {
//        DataFactory.getAllLabels($scope.suitKey, $scope.label)
//        .then((response) => {
//            $scope.labelObj = response;
//            allLists();
//        });
//    };
//
//
//    $scope.deleteLabel = function (labelKey) {
//        DataFactory.deletePhoto(labelKey, $scope.label)
//        .then((response) => {
//            let labelIndex = $scope.labelObj.indexOf(labelKey);
//            $scope.labelObj.splice(labelIndex, 1);
//            $scope.listArray.forEach(function(item){
//                $scope.deleteListItem(item);
//            });
//        });
//    };
//
//    $scope.addListItem = function (labelKey) {
//        $scope.listObj.uid = $scope.user;
//        $scope.listObj.suitcase = $scope.suitKey;
//        $scope.listObj.label_key= labelKey;
//        DataFactory.postListItem($scope.listObj)
//        .then((response) => {
//            let newListObjObj = {};
//            newListObjObj.list_key = response;
//            newListObjObj.label_key = labelKey;
//            newListObjObj.list_title = $scope.listObj.list_title;
//
//            newListObjObj.suitcase = $scope.suitKey;
//            $scope.listArray.push(newListObjObj);
//            console.log("is list title coming", $scope.listArray);
////            $scope.listObj.list_title = "";
//        });
//    };
//
//    let allLists = function () {
//        DataFactory.getAllLists($scope.suitKey, $scope.list)
//        .then((response) => {
//            $scope.listArray = response;
//            console.log("response from list array", response);
//        });
//    };
//
//    $scope.deleteListItem = function (listObj) {
//        DataFactory.deleteListItem(listObj.list_key)
//        .then((response) => {
//            let listIndex = $scope.listArray.indexOf(listObj.list_key);
//            $scope.listArray.splice(listIndex, 1);
//        });
//    };
//
//
//
//    let getAllPhotos = function () {
//        $scope.counter = 0;
//        $scope.menuItems.forEach(function(collection){
//            DataFactory.retrievePhotos($scope.suitKey, collection)
//            .then((response) => {
//                response.forEach(function(objects){
//                    $scope.counter++;
//                    if (objects.type === $scope.menuItems[0]) {
//                    $scope.topArray.push(objects);
//                    }else if (objects.type === $scope.menuItems[1]) {
//                        $scope.bottomArray.push(objects);
//                    }else if (objects.type === $scope.menuItems[2]) {
//                        $scope.shoeArray.push(objects);
//                    }
//                });
//            });
//
//        });
//    };
//
////    //get single label
////    $scope.saveLabelAndList = function (object) {
////        console.log("What is object", object);
////        $scope.packedListObj = {};
////        DataFactory.getSingleList(object.label_key)
////        .then((response) => {
////            console.log("response for single list", response);
////            $scope.packedListObj.title = object.title;
////            $scope.packedListObj.uid = object.uid;
////            $scope.packedListObj.list_title = response.list_title;
////            console.log("new lablist obj", $scope.packedListObj);
////            DataFactory.postSavedPackList($scope.labelListObj);
////        })
////        .then((response) => {
//////            console.log("success with new list", response);
////        });
////
////    };
//
//    let getAllPackLists = function () {
//        DataFactory.getSavedPackList($scope.user)
//        .then((response) =>{
//            console.log("everything after DF and FB", response);
//            response.forEach(function(item){
//                $scope.packListArray.push(item);
//            });
//            console.log("check list array", $scope.packListArray);
//        });
//    };
//
//
//
//
//
//
//
//    getAllPhotos();
//    getLabels();
//    getAllPackLists();
//});
