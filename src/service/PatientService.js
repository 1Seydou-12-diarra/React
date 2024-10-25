import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/patients/all';
const REST_API_BASE = 'http://localhost:8082/patients';

// Fonction pour récupérer la liste des patients
export const listePatient = () => axios.get(REST_API_BASE_URL);

// Fonction pour ajouter un nouveau patient
export const ajouterPatient = (patient) => {
    return axios.post(REST_API_BASE, patient);
};

// Fonction pour mettre à jour un patient existant
export const updatePatients = (id, patient) => {
    return axios.put(`${REST_API_BASE}/${id}`, patient); // Met à jour le patient avec l'ID donné
};

// Fonction pour supprimer un patient
// export const deletePatient = (id) => {
//     return axios.delete(`${REST_API_BASE}/${id}`); // Supprime le patient avec l'ID donné
// };
