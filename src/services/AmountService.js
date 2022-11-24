import axios from 'axios';

const MINTING_API_BASE_URL = "http://localhost:8080/api/v1/test";
const MINTING_API_PROGRESS_URL = "http://localhost:8080/api/v1/progress";
class AmountService {

    createAmount(amount, stakeKey){
        /*const response = axios.post(EMPLOYEE_API_BASE_URL, amount, {     headers: {         'Content-Type': 'application/json'     } })
        .then(function(response){
            //console.log(response.data['amountToSend']);
            return response;
        });*/
        //console.log(response)
        //console.log(response.toString)
        console.log(stakeKey)
        return axios.post(MINTING_API_BASE_URL, {
            amount: amount,
            stakeKey: stakeKey,
            headers: {         'Content-Type': 'application/json'     }
        })
    }
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
}

export default new AmountService()