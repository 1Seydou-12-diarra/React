import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/medecins';
// const REST_API_BASE = 'http://localhost:8082/patients';

// Fonction pour récupérer la liste des medecins
export const listeMedecins = () => axios.get(REST_API_BASE_URL);

// Fonction pour ajouter un nouveau medecin
export const ajouterMedecins = (medecin) => {
    return axios.post(REST_API_BASE_URL, medecin);
};

// Fonction pour mettre à jour un patient existant
export const updateMedecins = (id, medecin) => {
    return axios.put(`${REST_API_BASE_URL}/${id}`, medecin); // Met à jour le patient avec l'ID donné
};


