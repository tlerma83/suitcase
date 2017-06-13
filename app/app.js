"use strict";

//var app = angular.module("Suitcase", ["angularFileUpload", "ngRoute"]);
//
//app.controller('AppController', function($scope, FileUploader) {
//    $scope.uploader = new FileUploader();
//});


var app = angular.module('Suitcase', ['webcam', 'ngRoute']);


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
    .when("/tops", {
        templateUrl: "partials/tops.html",
        controller: "TopsCtrl",
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
