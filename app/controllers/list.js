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
    $scope.list = "list";
    $scope.listObj = {list_title: ""};
    $scope.label = "label";



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
            $scope.newKey = response;
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


    $scope.deleteLabel = function (object) {
        DataFactory.deletePhoto(object.label_key, "label")
        .then((response) => {
            let labelIndex = $scope.labelObj.indexOf(object);
            if (labelIndex !== -1) {
                $scope.labelObj.splice(labelIndex, 1);
                $scope.listArray.forEach(function(item){
                    if (item.label_key === object.label_key) {
                        $scope.deleteListItem(item);
                    }
                });
            }
        });
    };

    $scope.addListItem = function (labelKey) {
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
        });
    };

    $scope.deleteListItem = function (listObj) {
        DataFactory.deleteListItem(listObj.list_key)
        .then((response) => {
            let listIndex = $scope.listArray.indexOf(listObj);
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



    allLists();
    getAllPhotos();
    getLabels();
});


