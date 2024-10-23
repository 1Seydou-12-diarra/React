import React, { useEffect, useState } from 'react';
import { listePatient } from '../service/PatientService';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Table.css';

const ListePatientsComponent = () => {
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        listePatient().then((response) => {
            setPatients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleNomChange = (e) => setNom(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const savePatient = (e) => {
        e.preventDefault(); // Empêche la soumission par défaut du formulaire
        const newPatient = { nom, email };
        console.log(newPatient);

        // Ajoutez le nouveau patient à la liste des patients
        setPatients([...patients, newPatient]); // Mise à jour de l'état avec le nouveau patient

        // Réinitialisez les champs du formulaire et fermez le modal
        setNom('');
        setEmail('');
        handleClose();
    };


    return (
        <div className="table-container">
            <h2>Liste des Patients</h2>
            <Button variant="primary" className="float-start me-3 mb-3" onClick={handleShow}>
                Ajouter Un Patient
            </Button>
            <Table striped bordered hover variant="gray">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Nom</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{patient.nom}</td>
                            <td>{patient.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter Un Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={savePatient}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                value={nom}
                                onChange={handleNomChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez l'email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Sauvegarder
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
}

export default ListePatientsComponent;
