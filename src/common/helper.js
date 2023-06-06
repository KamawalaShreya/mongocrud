import { baseUrl } from "./config/constant.config";

/**
 * App logo
 * @returns
 */
export const logo = () => {
    return baseUrl("icons/logo.png");
};

export const randomStringGenerator = ( givenLength = 50 ) => {
    const characters =
    givenLength > 10 ?
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" :
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = givenLength;
    let randomStr = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * characters.length);
        randomStr += characters[randomNum];
    }
    return randomStr
}
  