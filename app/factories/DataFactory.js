"use strict";

app.factory("DataFactory", function($q, $http, FBCreds, AuthFactory){

    let addNewUser = function (newUser) {
       return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/user.json`, newUser)
           .then((response) => {
                console.log("new user added");
                resolve(response);
            })
           .catch((error) => {
                console.log("Error adding new user");
                reject(error);
            });
        });
    };

    let getUserInfo = function(userUid) {
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/user.json?orderBy="uid"&equalTo="${userUid}"`)
            .then((response) => {
                let userName = [];
                for (let items in response.data) {
                    let name = response.data;
                    userName.push(name[items].firtsName);
                }
                resolve(userName);
            })
            .catch((error) => {
                reject(error);
            });

        });
    };

    let addSuitCase = function(suitcase) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/suitcase.json`, suitcase)
            .then((response) => {
                console.log("added a new suitcase", response);
                let suitKey = response.data.name;
                resolve(suitKey);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let getAllSuitcases = function(userUid) {
        let suitArray = [];
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/suitcase.json?orderBy="uid"&equalTo="${userUid}"`)
            .then((response) => {
                let suitcaseObj = response.data;
                Object.keys(suitcaseObj).forEach((key) => {
                    suitcaseObj[key].suitKey = key;
                    suitArray.push(suitcaseObj[key]);
                });
                resolve(suitArray);

            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    let deleteSuitcase = function (suitKey) {
        return $q((resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/suitcase/${suitKey}.json`)
            .then((response) => {
                console.log("suitcase deleted successfully");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    return{
        addNewUser,
        getUserInfo,
        addSuitCase,
        getAllSuitcases,
        deleteSuitcase
    };
});
