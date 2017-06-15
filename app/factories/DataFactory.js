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


    //// For Tops Controller
    let saveTopsImage = function (imageBlob, user, date) {
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

    //Retrieves Tops images only
    let retrieveTopsPhotos = function (userUid) {
        let topsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/tops.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {
                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key_id = key;
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

    //delete top
    let deleteTopImage = function (photoKey, storageRef) {
//        let storeTest = JSON.stringify(storageRef);
//        let workalready = firebase.storage().ref();
//         let workalready2 = workalready.child(storeTest);
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/tops/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
//                return workalready2.delete();
            })
//            .then((response) => {
//                console.log("something deleted", response);
//                resolve(response);
//            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    // create and add Bottoms Image
    let saveBottomsImage = function (imageBlob, user, date) {
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
                return $http.post(`${FBCreds.databaseURL}/bottoms.json`, newPhotoObject);
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


//    function to call one image down, return that image object, then call it in controller, and restart carousel function



    // retrieve Bottoms image only
    let retrieveBottomsPhotos = function (userUid) {
        let bottomsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/bottoms.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {

//                console.log("What image came back line 72", response);

                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key_id = key;
                    bottomsImages.push(imageObj[key]);
                });
                console.log("do we have an image object?", bottomsImages);
                resolve(bottomsImages);
            })
            .catch( (error) => {
                reject(error);
            });


        });
    };

     // create and add Shoes Image
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

    // retrieve Shoes image only
    let retrieveShoesPhotos = function (userUid) {
        let shoesImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/shoes.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {

//                console.log("What image came back line 72", response);

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

    //delete bottoms
    let deleteBottomsImage = function (photoKey) {
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/bottoms/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    //delete shoes
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





    return{addNewUser, saveTopsImage, retrieveTopsPhotos, saveBottomsImage, retrieveBottomsPhotos, saveShoesImage, retrieveShoesPhotos, deleteBottomsImage, deleteShoeImage, deleteTopImage, getUserInfo};
});
