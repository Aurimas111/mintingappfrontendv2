import axios from 'axios';

const MINTING_API_BASE_URL = "http://localhost:8080/api/v1/test";
const MINTING_API_PROGRESS_URL = "http://localhost:8080/api/v1/progress";
class AmountService {

    /*createAmount(amount, stakeKey){
        console.log(stakeKey)
        return axios.post(MINTING_API_BASE_URL, {
            amount: amount,
            stakeKey: stakeKey,
            headers: {         'Content-Type': 'application/json'     }
        })
    }*/
    getAmount(amountId){
        return axios.get(MINTING_API_BASE_URL, amountId, {     headers: {         'Content-Type': 'application/json'     } })
    }

    getSoldOutProgress(){
        return axios.get(MINTING_API_PROGRESS_URL,  {     headers: {         'Content-Type': 'application/json'     } })
    }

    sendOrder(amount, stakeKey){
        return axios.post("http://localhost:8080/api/v1/test", {
            amountReserved: amount,
            userStakeKey: stakeKey,
            headers: {         'Content-Type': 'application/json'     }
        })
    }

    getActiveOrder(stakeKey){
        return axios.post("http://localhost:8080/api/v1/activeOrder",{     
            stakeKey
        })
    }

}

export default new AmountService()