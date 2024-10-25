import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/rendezvous';

// Fonction pour récupérer la liste des patients
export const  listeRendezvous= () => axios.get(REST_API_BASE_URL);

export const ajouterRendezVous = (rendezvousData) => {
    return axios.post(REST_API_BASE_URL, rendezvousData)
        .then(response => response.data) // Retourne les données de la réponse
        .catch(error => {
            console.error('Erreur lors de l\'ajout du rendez-vous :', error);
            throw error; // Rejette l'erreur pour la gérer ailleurs
        });
};

// Fonction pour mettre à jour un patient existant
export const updateRendezVous = (id, rendezvous) => {
    return axios.put(`${REST_API_BASE_URL}/${id}`, rendezvous); // Met à jour le patient avec l'ID donné
};

// Fonction pour supprimer un patient
// export const deletePatient = (id) => {
//     return axios.delete(`${REST_API_BASE}/${id}`); // Supprime le patient avec l'ID donné
// };
