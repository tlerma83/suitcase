"use strict";

//var app = angular.module("Suitcase", ["angularFileUpload", "ngRoute"]);
//
//app.controller('AppController', function($scope, FileUploader) {
//    $scope.uploader = new FileUploader();
//});


var app = angular.module('Suitcase', ['webcam', 'ngRoute']);


let isAuth = (AuthFactory) => {
    return new Promise((resolve, reject) => {
        AuthFactory.isAuthorized()
        .then((ifUserTrue) => {
            console.log("line 18 ifusertrue", ifUserTrue);
            if (ifUserTrue) {
                console.log("User is true");
                resolve(true);
            }else {
                console.log("No user");
                reject(false);
            }

        });
    });
};


app.config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl: "partials/auth.html",
        controller: "AuthCtrl"
    })
    .when("/suitcase", {
        templateUrl: "partials/suitcase.html",
        controller: "mainController",
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
