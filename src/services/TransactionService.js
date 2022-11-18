import axios from 'axios';

const MINTING_API_BASE_URL = "http://localhost:8080/api/v1/testt";

class TransactionService {

    txSubmitted(amount){
        return axios.post(MINTING_API_BASE_URL, amount, {     headers: {         'Content-Type': 'application/json'     } })
    }
}

export default new TransactionService()