"use strict";

app.controller("ListCtrl", function(DataFactory, AuthFactory, $routeParams, $location, $scope, $route){

    $scope.user = AuthFactory.getUser();
    $scope.suitKey = $routeParams.suitcaseKey;
    $scope.menuItems = ["tops", "bottoms", "shoes"];
    $scope.imageArray = [];
    $scope.topArray = [];
    $scope.bottomArray = [];
    $scope.shoeArray = [];
    $scope.listArray = [];
    $scope.labelObj = {};
    $scope.addLabelText = false;
    $scope.newLabel = {title: ""};
    $scope.label = "label";
    $scope.list = "list";
    $scope.listObj = {title: ""};



    $(document).ready(function(){
        $('.collapsible').collapsible();
    });


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
        $scope.listObj.uid = $scope.user;
        $scope.listObj.suitcase = $scope.suitKey;
        $scope.listObj.label_key= labelKey;
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
            $scope.listArray = response;
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
        $scope.menuItems.forEach(function(collection){
            DataFactory.retrievePhotos($scope.suitKey, collection)
            .then((response) => {
                response.forEach(function(objects){
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

    getAllPhotos();
    getLabels();
});
