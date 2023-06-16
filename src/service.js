import axios from "axios";
import { baseUrl } from "./config";

const API_URL = baseUrl;

class Service {
  getHistogramData(nodeId) {
    return axios.get(`${API_URL}/descriptorScalarGraphById/${nodeId}`, {});
  }
}

export default new Service();
