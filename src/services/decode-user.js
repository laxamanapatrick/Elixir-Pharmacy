import CryptoJS from 'crypto-js'
import { saltkey } from '../saltkey';


export const decodeUser = () => {
    let userDatadecrypted;
    if (localStorage.getItem('userData')) {
        const userData = localStorage.getItem('userData');
        const deciphertext = CryptoJS.AES.decrypt(userData, saltkey)
        userDatadecrypted = JSON.parse(deciphertext.toString(CryptoJS.enc.Utf8))
    }

    return userDatadecrypted
}
