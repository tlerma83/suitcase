"use strict";

app.factory("ShoeFactory", function($q, $http, FBCreds, AuthFactory, KeyFactory){

    let saveShoesImage = function (imageBlob, user, date) {
        let storageReference = firebase.storage().ref();
        let newPhotoObject = {};
        return $q( (resolve, reject) => {
            storageReference.child(`"images/${date}${user}.png"`).put(imageBlob)
            .then((response) => {
                return storageReference.child(`"images/${date}${user}.png"`).getDownloadURL();
            })
            .then( (picObj) => {
                newPhotoObject.url = picObj;
                newPhotoObject.uid = user;
                return $http.post(`${FBCreds.databaseURL}/shoes.json`, newPhotoObject);
            })
            .then( (key) => {
                newPhotoObject.key = key.data.name;
                console.log("checkig topsKey", newPhotoObject);
                resolve(newPhotoObject);
            })
            .catch( (error) => {
                reject(error);
            });
        });
    };

    let retrieveShoesPhotos = function (userUid) {
        let shoesImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/shoes.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {

                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key_id = key;
                    shoesImages.push(imageObj[key]);
                });
                console.log("do we have an image object?", shoesImages);
                resolve(shoesImages);
            })
            .catch( (error) => {
                reject(error);
            });
        });
    };


    let deleteShoeImage = function (photoKey) {
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/shoes/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    return {
        saveShoesImage,
        retrieveShoesPhotos,
        deleteShoeImage
    };
});
