/**
 * Get base url
 * @readonly
 */
module.exports.baseUrl = ( path = null ) => {
    let url = `${ process.env.BASE_URL}:${process.env.PORT}`;
    if(process.env.ENV !== "production") {
        url = `${process.env.BASE_URL}:${process.env.PORT}`;
    }

    return url + ( path ? `/${path}` : "" );
}


// module.exports.apiBaseUrl = (path = null) => {
//     let url = `http://${process.env.HOST}:${process.env.PORT}/api/v1`;
//     if (process.env.isSSLEnable === 'true') {
//         url = `https://${process.env.HOST}/api/v1`;
//     }
//     return url + (path ? `/${path}` : '');
// }

// /**
//  * Enum platform type
//  * @readonly
//  * @enum
//  */
// module.exports.PLATFORM = Object.freeze({
//     ANDROID: "Android",
//     IOS: "iOS",
//   });