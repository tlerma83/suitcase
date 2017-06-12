"use strict";

app.controller("AuthCtrl", function ($scope, $location, AuthFactory, DataFactory) {

    $scope.auth = {
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    };


    $scope.login = function () {
        AuthFactory.loginUser($scope.auth)
        .then(() =>{
            console.log("user is logged in");
//            $location.path("suitcase");
        });
    };

    $scope.register = function () {
        AuthFactory.createUser({
            email: $scope.auth.email,
            password: $scope.auth.password
        })
        .then(function(newUser){
            DataFactory.addNewUser({
                uid: newUser.uid,
                firtsName: $scope.auth.firstName,
                lastName: $scope.auth.lastName
            });
        })
        .then((userData) => {
            $scope.login();

        });
    };




});
