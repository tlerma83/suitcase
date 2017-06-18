"use strict";

app.controller("NavCtrl", function($scope, $q, DataFactory, AuthFactory, $location, $window, $routeParams, $route){


    $scope.user = AuthFactory.getUser();
    $scope.newSuitcase = {title: ""};

    $scope.menuItems = [
        {url: `tops/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Tops"},
        {url: `bottoms/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Bottoms"},
        {url: `shoes/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Shoes"},
        {url: `packlist/${$routeParams.suitcaseKey}${$routeParams.suitTitle}`, name: "Pack List"}
    ];


    $scope.logout = function () {
        AuthFactory.logout();
    };


    let getUserName = function () {
        DataFactory.getUserInfo($scope.user)
        .then((response) => {
            $scope.firstName = response[0];
        });
    };


    $scope.addNewSuitcase = function () {
        $("#createNew").modal('close');
        $scope.newSuitcase.uid = $scope.user;
        console.log("new title", $scope.newSuitcase);
        DataFactory.addSuitCase($scope.newSuitcase)
        .then((response) => {
            $window.location.href = "#!tops/" + response.key + "/"  + response.title;
        });
    };

    let allSuitcases = function () {
        DataFactory.getAllSuitcases($scope.user)
        .then((response) => {
            $scope.select = response;
        });
    };

    $scope.openSuitcase = function(suitKey, title) {
        $window.location.href = "#!tops/" + suitKey + "/"  + title;
    };

    $scope.editSuitcaseTitle = function () {
        $("#edit-mode-modal").modal("close");
        DataFactory.editSuitTitle($routeParams.suitcaseKey, $scope.newSuitcase.title)
        .then((response) =>{
            $routeParams.suitTitle = $scope.newSuitcase.title;
            angular.forEach($scope.select, function(poop){
                let newTitle = poop.key;
                if(newTitle === $routeParams.suitcaseKey){
                    DataFactory.getAllSuitcases($scope.user)
                    .then((response) => {
                        console.log("poop response", response);
                        $scope.select = response;
                        $routeParams.suitTitle = $scope.newSuitcase.title;
                        $scope.openSuitcase($routeParams.suitcaseKey, $scope.newSuitcase.title);
                    });
                }
            });
        });
    };


    getUserName();
    allSuitcases();

});
