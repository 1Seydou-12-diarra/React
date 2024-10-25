import React, { useEffect, useState } from 'react';
import { listePatient } from '../service/PatientService'; // Assurez-vous que le chemin est correct
import { Card } from 'react-bootstrap'; // Importez le composant Card de Bootstrap
import './Home.css'; // Importez vos styles si nécessaire
import { listeMedecins } from '../service/MedecinService';

const Home = () => {
    const [totalPatients, setTotalPatients] = useState(0);
    const [totalMedecin, setTotalMedecin] = useState(0);


    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await listePatient();
                setTotalPatients(response.data.length); // Mettre à jour le nombre total de patients
            } catch (error) {
                console.error('Erreur lors de la récupération des patients:', error);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        const fetchMedecins = async () => {
            try {
                const response = await listeMedecins();
                setTotalMedecin(response.data.length); // Mettre à jour le nombre total de patients
            } catch (error) {
                console.error('Erreur lors de la récupération des patients:', error);
            }
        };

        fetchMedecins();
    }, []);


    return (
        <div className="home-container">
            <div className="card-container">
                <Card className="patient-count" style={{ width: '18rem', backgroundColor: 'gray', color: 'white' }}>
                    <Card.Body>
                        <Card.Title>Total de patients</Card.Title>
                        <Card.Text>
                            <h4>{totalPatients}</h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="medecin-count" style={{ width: '18rem', backgroundColor: 'green', color: 'white' }}>
                    <Card.Body>
                        <Card.Title>Total de medecins</Card.Title>
                        <Card.Text>
                            <h4>{totalMedecin}</h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="patient-count" style={{ width: '18rem', backgroundColor: 'orange', color: 'white' }}>
                    <Card.Body>
                        <Card.Title>Total de patients</Card.Title>
                        <Card.Text>
                            <h4>{totalPatients}</h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="patient-count" style={{ width: '18rem', backgroundColor: 'blue', color: 'white' }}>
                    <Card.Body>
                        <Card.Title>Total de patients</Card.Title>
                        <Card.Text>
                            <h4>{totalPatients}</h4>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            {/* Vous pouvez inclure d'autres composants ou informations ici */}
        </div>
    );
};

export default Home;
