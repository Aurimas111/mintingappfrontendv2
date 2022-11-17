import axios from 'axios';

const MINTING_API_BASE_URL = "http://localhost:8080/api/v1/test";

class AmountService {

    createAmount(amount){
        /*const response = axios.post(EMPLOYEE_API_BASE_URL, amount, {     headers: {         'Content-Type': 'application/json'     } })
        .then(function(response){
            //console.log(response.data['amountToSend']);
            return response;
        });*/
        //console.log(response)
        //console.log(response.toString)
        return axios.post(MINTING_API_BASE_URL, amount, {     headers: {         'Content-Type': 'application/json'     } })
    }
    getAmount(amountId){
        return axios.get(MINTING_API_BASE_URL, amountId, {     headers: {         'Content-Type': 'application/json'     } })
    }
}

export default new AmountService()