import axios from "axios";

const createAPIService = (baseUrl, headers = {}) => {
    const config = {
        baseURL: baseUrl,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    }
    return axios.create(config);
}

export default createAPIService;