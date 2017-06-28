"use strict";

app.factory("DataFactory", function($q, $http, FBCreds, AuthFactory){

    let addNewUser = function (newUser) {
       return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/user.json`, newUser)
           .then((response) => {
                resolve(response);
            })
           .catch((error) => {
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
                let newObj = {};
                newObj.key = response.data.name;
                newObj.title = suitcase.title;
                resolve(newObj);
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
                    suitcaseObj[key].key = key;
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
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    /************ suitcase ************/
    let editSuitTitle = function (key, titleObj) {
        let newobj = {};
        newobj.title = titleObj;
        return $q((resolve, reject) => {
            $http.patch(`${FBCreds.databaseURL}/suitcase/${key}.json`, newobj)
            .then((response) => {
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
                newPhotoObject.type = collectionName;
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


    let createLabel = function (labelObj) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/label.json`, labelObj)
            .then((response) => {
                resolve(response.data.name);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let getlabel = function (labelKey) {
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/label/${labelKey}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    let getAllLabels = function (suitKey, collectionName) {
        let labeArray = [];
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/${collectionName}.json?orderBy="suitcase"&equalTo="${suitKey}"`)
            .then((response) => {
                let labelObj = response.data;
                Object.keys(labelObj).forEach(function(key){
                    labelObj[key].label_key = key;
                    labeArray.push(labelObj[key]);
                });
                resolve(labeArray);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    // List Items inside Labels
    let postListItem = function (listObj) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/list.json`, listObj)
            .then((response) => {
                resolve(response.data.name);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };



    let getAllLists = function (suitKey) {
        let listArray = [];
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/list.json?orderBy="suitcase"&equalTo="${suitKey}"`)
            .then((response) => {
                let listObj = response.data;
                Object.keys(listObj).forEach(function(key){
                    listObj[key].list_key = key;
                    listArray.push(listObj[key]);
                });
                resolve(listArray);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };





//    let getSingleList = function (labelKey) {
//        let newArr = [];
//        let titleObj = {};
//        return $q((resolve, reject) => {
//            $http.get(`${FBCreds.databaseURL}/list.json?orderBy="label_key"&equalTo="${labelKey}"`)
//
//            .then((response) => {
//                resolve(response.data);
//            })
//            .catch((error) => {
//                reject(error);
//            });
//        });
//    };

    let deleteListItem = function (labelKey) {
        return $q((resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/list/${labelKey}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };



    let getListsByLabel = function (labelKey) {
        let newArr = [];

        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/list.json?orderBy="label_key"&equalTo="${labelKey}"`)
            .then((response) => {
                let holdObj = response.data;
                Object.keys(holdObj).forEach(function(object){
                    let newObj = {};
                    newObj.list_key = object;
                    newObj.label_key = holdObj[object].label_key;
                    newObj.list_title = holdObj[object].list_title;
                    newObj.uid = holdObj[object].uid;
                    newArr.push(newObj);
                });
                resolve(newArr);
            });
        });
    };


    let postSavedList = function (object) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/packedlist.json`, object)
            .then((response) => {
                resolve(response.data.name);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };



    let getSavedPackList = function (user) {
        let newArr = [];
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/packedlist.json?orderBy="uid"&equalTo="${user}"`)
            .then((response) => {
                let holdObj = response.data;
                Object.keys(holdObj).forEach(function(key){
                    holdObj[key].packedlist_key = key;
                    newArr.push(holdObj[key]);
                });
                resolve(newArr);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let createPackedLabel = function (object) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/packedlabel.json`, object)
            .then((response) => {
                resolve(response.data.name);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    let getSavedPackLabels = function (user) {
        let newArr = [];
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/packedlabel.json?orderBy="uid"&equalTo="${user}"`)
            .then((response) => {
                let holdMe = response.data;
                Object.keys(holdMe).forEach(function(item){
                    let newObj = holdMe[item];
                    newArr.push(newObj);
                });
                resolve(newArr);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let patchToPackedLabel = function (key, obj) {
        return $q((resolve, reject) => {
            $http.patch(`${FBCreds.databaseURL}/packedlabel/${key}.json`, obj)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let deleteSavedLabel = function (objKey) {
        return $q((resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/packedlabel/${objKey}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };



    let deleteInPacklist = function (objKey) {
        return $q((resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/packedlist/${objKey}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };




    //closet
    let addToCloset = function (imgObject) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/closet.json`, imgObject)
            .then((response) => {
                resolve(response.data.name);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    let getCloset = function (user) {
        let closetKey = [];
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/closet.json?orderBy="uid"&equalTo="${user}"`)
            .then((response) =>{
                let closetObj = response.data;
                Object.keys(closetObj).forEach(function(key){
                    closetObj[key].closet_key = key;
                    closetKey.push(closetObj[key]);
                });
                resolve(closetKey);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let addClosetToSuitcase = function (imgObj) {

        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/${imgObj.type}.json`, imgObj)
            .then((response) => {
                resolve(response.data.name);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    let deleteFromCloset = function (closetKey) {
        return $q((resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/closet/${closetKey}.json`)
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
        deletePhoto,
        editSuitTitle,
        createLabel,
        getlabel,
        getAllLabels,
        postListItem,
        getAllLists,
        deleteListItem,
        addToCloset,
        getCloset,
        addClosetToSuitcase,
        deleteFromCloset,
//        getSingleList,
        getSavedPackList,
        deleteInPacklist,
        getListsByLabel,
        postSavedList,
        getSavedPackLabels,
        patchToPackedLabel,
        deleteSavedLabel,
        createPackedLabel
    };
});
