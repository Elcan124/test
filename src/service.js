import axios from "axios";
import {baseUrl} from "./config";
const API_URL = baseUrl+'/';
class Service {
    getHistogramData(params){
        return axios.get(API_URL +"descriptorScalarGraphById/"+params["selected"].text, {});
    }




}
export default new Service();