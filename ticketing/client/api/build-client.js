import axios from "axios";

const buildClient = ({ req }) => {
    const baseURL = typeof window === 'undefined' ? 
        'http://lilik-ticketing.ddns.net' : null;

    return axios.create(baseURL ? {baseURL, headers: req.headers} : {});
};

export default buildClient;