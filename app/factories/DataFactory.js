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


    /************ suitcase ************/
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

    /************ suitcase ************/
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

    /************ suitcase ************/
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

    /************ Photos ************/
    let saveImage = function (imageBlob, user, date, suitcaseKey, collectionName) {
        // initiate storage reference
        let storageReference = firebase.storage().ref();
        let newPhotoObject = {};
        // store reference to a variable to later delete  item in storagebucket
        let holdStorageChild = storageReference.child(`"images/${date}${user}.png"`);
        newPhotoObject.storage_ref = holdStorageChild.location.path;
        return $q( (resolve, reject) => {
            holdStorageChild.put(imageBlob)
            .then((response) => {
                return holdStorageChild.getDownloadURL();
            })
            .then( (picObj) => {
                newPhotoObject.url = picObj;
                newPhotoObject.uid = user;
                newPhotoObject.suitcase = suitcaseKey;
                return $http.post(`${FBCreds.databaseURL}/${collectionName}.json`, newPhotoObject);
            })
            .then( (key) => {
                newPhotoObject.key = key.data.name;
                resolve(newPhotoObject);
            })
            .catch( (error) => {
                reject(error);
            });

        });
    };
    /************ Photos ************/
    let retrievePhotos = function (suitcase, collectionName) {
        let topsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/${collectionName}.json?orderBy="suitcase"&equalTo="${suitcase}"`)
            .then( (response) => {
                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key = key;
                    topsImages.push(imageObj[key]);
                });
                resolve(topsImages);
            })
            .catch( (error) => {
                reject(error);
            });
        });
    };

    /************ Photos ************/
    let deletePhoto = function (photoKey, collectionName) {
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/${collectionName}/${photoKey}.json`)
            .then((response) => {
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
        deleteSuitcase,
        saveImage,
        retrievePhotos,
        deletePhoto
    };
});
