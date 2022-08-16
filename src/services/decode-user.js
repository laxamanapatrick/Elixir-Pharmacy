import CryptoJS from 'crypto-js'
import { saltkey } from '../saltkey';


export const decodeUser = () => {
    let userDatadecrypted;
    if (sessionStorage.getItem('userData')) {
        const userData = sessionStorage.getItem('userData');
        const deciphertext = CryptoJS.AES.decrypt(userData, saltkey)
        userDatadecrypted = JSON.parse(deciphertext.toString(CryptoJS.enc.Utf8))
    }

    return userDatadecrypted
}
