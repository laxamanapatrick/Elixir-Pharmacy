import axios from 'axios';
import { decodeUser } from './decode-user';

const user = decodeUser()


// Local Backend

export default axios.create({
    baseURL: "https://localhost:44342/api/",
    headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+user?.token
    }
})


// Jaypee Backend

// export default axios.create({
//     baseURL: "http://10.10.13.16:45458/api/",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": 'Bearer '+user?.token
//     }
// })















// Live

// export default axios.create({
//     baseURL: "http://10.10.2.31:82/api/",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": 'Bearer '+user?.token
//     }
// })




//Depot Version

// export default axios.create({
//     baseURL: "http://10.10.2.6:8002/api",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": 'Bearer '+user?.token
//     }
// })
