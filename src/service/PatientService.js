import axios from "axios";
const REST_API_BASE_URL = 'http://localhost:8082/patients/all';

const REST_API_BASE_Post = 'http://localhost:8082/patients/';


export const listePatient = () => axios.get(REST_API_BASE_URL);

export const ajouterPatient = () => axios.post(REST_API_BASE_Post, patient);

