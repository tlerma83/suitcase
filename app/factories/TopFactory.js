"use strict";

app.factory("TopFactory", function($q, $http, FBCreds, AuthFactory, KeyFactory){



    let deleteTopsinSuitcase = function (photoKey) {
        return $q((resolve, reject) => {
         $http.delete(`${FBCreds.databaseURL}/tops/${photoKey}.json`)
            .then((response) => {
                console.log("all tops in suitcase deleted", response);
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    let saveTopsImage = function (imageBlob, user, date, suitcaseKey) {
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
                return $http.post(`${FBCreds.databaseURL}/tops.json`, newPhotoObject);
            })
            .then( (key) => {
                newPhotoObject.key = key.data.name;
                console.log("what is newPhotoObj", newPhotoObject);
                resolve(newPhotoObject);
            })
            .catch( (error) => {
                reject(error);
            });

        });
    };

    let retrieveTopsPhotos = function (suitcase) {
        let topsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/tops.json?orderBy="suitcase"&equalTo="${suitcase}"`)
            .then( (response) => {
                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key = key;
                    topsImages.push(imageObj[key]);
                });
                console.log("do we have an image object?", topsImages);
                resolve(topsImages);
            })
            .catch( (error) => {
                reject(error);
            });
        });
    };


    let deleteTopImage = function (photoKey) {
        console.log("Delete Top: " + photoKey);
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/tops/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    return{
        deleteTopsinSuitcase,
        saveTopsImage,
        retrieveTopsPhotos,
        deleteTopImage
    };
});
