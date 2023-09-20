import axios from "axios";

const buildClient = ({ req }) => {
    const baseURL = typeof window === 'undefined' ? 
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local' : null;

    return axios.create(baseURL ? {baseURL, headers: req.headers} : {});
};

export default buildClient;