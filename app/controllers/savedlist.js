"use strict";

app.controller("SavedlistCtrl", function($scope, $window, $location, AuthFactory, DataFactory, $q, $route, $routeParams){

    $scope.suitName = $routeParams.suitTitle;
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.menuItems = ["tops", "bottoms", "shoes"];
    $scope.user = AuthFactory.getUser();
    $scope.packListArray = [];
    $scope.labelArray = [];




    let getAllPackLists = function () {
        DataFactory.getSavedPackList($scope.user)
        .then((response) =>{
            response.forEach(function(item){
                $scope.packListArray.push(item);
            });
        });
    };


    let getAllPackLabels = function () {
        DataFactory.getSavedPackLabels($scope.user)
        .then((response) => {
            response.forEach(function(item){
                $scope.labelArray.push(item);
            });
        });
    };


    $scope.savePackedLabel = function (object) {
        console.log("what is object", object);
        let savedPackedLabel = {};
        savedPackedLabel.title = object.title;
        savedPackedLabel.uid = object.uid;
        DataFactory.createPackedLabel(savedPackedLabel)
        .then((response) => {
            $scope.newKey = response;
            DataFactory.getListsByLabel(object.label_key)
            .then((response) => {
                response.forEach(function(obj){
                    let newObj = {};
                    newObj.title = object.title;
                    newObj.packedlabel_key = $scope.newKey;
                    newObj.list_title = obj.list_title;
                    newObj.uid = $scope.user;
                    $scope.packListArray.push(newObj);
                    DataFactory.postSavedList(newObj)
                    .then((response) =>{
                        newObj.packedlist_key = response;
                        $scope.packListArray.push(newObj);
                        savedPackedLabel.title = object.title;
                        savedPackedLabel.uid = object.uid;
                        savedPackedLabel.packedlabel_key = $scope.newKey;
                        DataFactory.patchToPackedLabel($scope.newKey, savedPackedLabel);
                    });
                });
            });
        });
    };



    $scope.AddToCurrentList= function (list) {
        let newArr = [];
        $scope.createLabel = {};
        $scope.createLabel.title = list.title;
        $scope.createLabel.uid = list.uid;
        $scope.createLabel.suitcase = $scope.suitKey;
        DataFactory.createLabel($scope.createLabel)
        .then((response) => {
            $scope.packListArray.forEach(function(object){
                if (list.packedlabel_key === object.packedlabel_key) {
                    let newObj = {};
                    newObj.label_key = response;
                    newObj.suitcase = $scope.suitKey;
                    newObj.title = object.title;
                    newObj.list_title = object.list_title;
                    newObj.uid = object.uid;
                    DataFactory.postListItem(newObj);
                }
            });
        });
    };



    $scope.deleteListItem = function (listObj) {
        DataFactory.deleteInPacklist(listObj.packedlist_key)
        .then((response) => {
            let listIndex = $scope.packListArray.indexOf(listObj);
            if (listIndex !== -1) {
                $scope.packListArray.splice(listIndex, 1);
            }
        });
    };


    $scope.deleteLabel = function (lableObj) {
        DataFactory.deleteSavedLabel(lableObj.packedlabel_key)
        .then((response) => {
            console.log("Are you reading?", $scope.packListArray);
            $scope.packListArray.forEach(function(object){

                if (object.packedlabel_key === lableObj.packedlabel_key) {
                    $scope.deleteListItem(object);
                }
            });


            let indexOf = $scope.labelArray.indexOf(lableObj);
            console.log("labelArray indexof", indexOf);
            if (indexOf !== -1) {
                $scope.labelArray.splice(indexOf, 1);
                console.log("ok");
            }


        });
    };


    let getAllPhotos = function () {
        $scope.counter = 0;
        $scope.menuItems.forEach(function(collection){
            DataFactory.retrievePhotos($scope.suitKey, collection)
            .then((response) => {
                response.forEach(function(objects){
                    $scope.counter++;
                });
            });
        });
    };





    getAllPackLists();
    getAllPackLabels();
    getAllPhotos();
});
