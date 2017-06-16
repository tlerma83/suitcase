"use strict";

//var app = angular.module("Suitcase", ["angularFileUpload", "ngRoute"]);
//
//app.controller('AppController', function($scope, FileUploader) {
//    $scope.uploader = new FileUploader();
//});


var app = angular.module('Suitcase', ['webcam', 'ngRoute', "ui.materialize"]);


// stackoverFlow solution for angular ng-repeat to finish loading before applying materialize   // function to create it and style
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    };
});


let isAuth = (AuthFactory) => new Promise( (resolve, reject) => {
    AuthFactory.isAuthorized()
    .then((ifUserTrue) => {
        if (ifUserTrue) {
            console.log("User is true");
            resolve();
        }else {
            console.log("No user");
            reject();
        }

    });
});



app.config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl: "partials/auth.html",
        controller: "AuthCtrl"
    })
    .when("/navigation", {
        templateUrl: "partials/nav.html",
        controller: "NavCtrl",
        resolve: {isAuth}
    })
    .when("/tops", {
        templateUrl: "partials/tops.html",
        controller: "TopsCtrl",
        resolve: {isAuth}
    })
    .when("/camera", {
        templateUrl: "partials/sideNav.html",
        controller: "CamCtrl",
        resolve: {isAuth}
    })
    .when("/bottoms", {
        templateUrl: "partials/bottoms.html",
        controller: "BottomsCtrl",
        resolve: {isAuth}
    })
    .when("/shoes", {
        templateUrl: "partials/shoes.html",
        controller: "ShoesCtrl",
        resolve: {isAuth}
    })
    .otherwise("/");
});




app.run(($location, FBCreds) => {
    let authCreds = {
        apiKey: FBCreds.apiKey,
        authDomain: FBCreds.authDomain,
        databaseURL: FBCreds.databaseURL,
        projectId: FBCreds.projectId,
        storageBucket: FBCreds.storageBucket,
        messagingSenderId: FBCreds.messagingSenderId
    };

    firebase.initializeApp(authCreds);
});
