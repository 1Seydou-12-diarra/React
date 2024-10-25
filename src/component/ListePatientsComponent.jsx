import React, { useEffect, useState } from 'react';
import { listePatient, ajouterPatient, updatePatients } from '../service/PatientService';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import './Table.css';

const ListePatientsComponent = () => {
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [errors, setErrors] = useState({
        nom: '',
        email: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 10;

    useEffect(() => {
        listePatient().then((response) => {
            setPatients(response.data);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentPatientId(null);
        setNom('');
        setEmail('');
    };

    const handleShow = () => setShowModal(true);

    const handleNomChange = (e) => setNom(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const savePatient = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const patientData = { nom, email };

            if (currentPatientId) {
                updatePatients(currentPatientId, patientData)
                    .then(() => {
                        const updatedPatients = patients.map((patient) =>
                            patient.id === currentPatientId ? { ...patient, nom, email } : patient
                        );
                        setPatients(updatedPatients);
                        setToastMessage('Patient modifié avec succès !');
                        setShowToast(true);
                        handleClose();
                    })
                    .catch(error => console.error('Erreur lors de la mise à jour :', error));
            } else {
                ajouterPatient(patientData)
                    .then((response) => {
                        setPatients([...patients, response.data]);
                        setToastMessage('Patient ajouté avec succès !');
                        setShowToast(true);
                        handleClose();
                    })
                    .catch(error => console.error('Erreur lors de l\'ajout du patient :', error));
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };
        if (nom.trim()) {
            errorsCopy.nom = '';
        } else {
            errorsCopy.nom = 'Le nom est requis';
            valid = false;
        }
        if (email.trim()) {
            errorsCopy.email = '';
        } else {
            errorsCopy.email = 'L\'email est requis';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    const updatePatientForm = (patient) => {
        setNom(patient.nom);
        setEmail(patient.email);
        setCurrentPatientId(patient.id);
        setShowModal(true);
    };

    const pageTitle = () => {
        return currentPatientId ? <h2 className='text-center'>Modifier un patient</h2> : <h2 className='text-center'>Ajouter un patient</h2>;
    };

    // Pagination logic
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(patients.length / patientsPerPage);
    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                {number}
            </Pagination.Item>
        );
    }

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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPatients.map((patient, index) => (
                        <tr key={patient.id}>
                            <td>{index + 1 + indexOfFirstPatient}</td>
                            <td>{patient.nom}</td>
                            <td>{patient.email}</td>
                            <td>
                                <button className='btn btn me-2' onClick={() => updatePatientForm(patient)}>
                                    <FontAwesomeIcon icon={faEdit} className='me-1' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination alignée à droite */}
            <div className="d-flex justify-content-end">
                <Pagination>{paginationItems}</Pagination>
            </div>
            <br /><br />
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{pageTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le nom"
                                value={nom}
                                onChange={handleNomChange}
                                required
                                className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                            />
                        </Form.Group>
                        {errors.nom && <div className='invalid-feedback'>{errors.nom}</div>}

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez l'email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            />
                        </Form.Group>
                        {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={savePatient}>
                        {currentPatientId ? 'Modifier' : 'Sauvegarder'}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast pour les notifications */}
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={2000}
                autohide
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#90ee90',
                    color: 'black'
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default ListePatientsComponent;
