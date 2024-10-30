import React, { useEffect, useState } from 'react';
import { listeRendezvous, ajouterRendezVous, updateRendezVous } from '../service/RendezVousService';
import { listeMedecins } from '../service/MedecinService';
import { listePatient } from '../service/PatientService';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './Table.css';

const RendezVousComponent = () => {
    const [rendezvous, setRendezvous] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedMedecin, setSelectedMedecin] = useState('');
    const [currentRendezvousId, setCurrentRendezvousId] = useState(null);
    const [patientsMap, setPatientsMap] = useState({});
    const [medecinsMap, setMedecinsMap] = useState({});
    const [errors, setErrors] = useState({ date: '', patient: '', medecin: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rendezvousPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rendezvousResponse = await listeRendezvous();
                setRendezvous(rendezvousResponse.data);

                const patientsResponse = await listePatient();
                const medecinsResponse = await listeMedecins();

                const patientsMap = {};
                patientsResponse.data.forEach(patient => {
                    patientsMap[patient.id] = patient.nom;
                });
                setPatientsMap(patientsMap);

                const medecinsMap = {};
                medecinsResponse.data.forEach(medecin => {
                    medecinsMap[medecin.id] = medecin.nom;
                });
                setMedecinsMap(medecinsMap);

            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
        fetchData();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentRendezvousId(null);
        setDate('');
        setSelectedPatient('');
        setSelectedMedecin('');
        setErrors({ date: '', patient: '', medecin: '' });
    };

    const handleShow = () => setShowModal(true);
    const handleDateChange = (e) => setDate(e.target.value);
    const handlePatientChange = (e) => setSelectedPatient(e.target.value);
    const handleMedecinChange = (e) => setSelectedMedecin(e.target.value);

    const saveRendezvous = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const rendezvousData = { date, patient: { id: selectedPatient }, medecin: { id: selectedMedecin } };
            try {
                if (currentRendezvousId) {
                    updateRendezVous(currentRendezvousId, rendezvousData);
                    setRendezvous(rendezvous.map(r => r.id === currentRendezvousId ? { ...r, ...rendezvousData } : r));
                    setToastMessage('Rendez-vous modifié avec succès !');
                } else {
                    const response = await ajouterRendezVous(rendezvousData);
                    setRendezvous([...rendezvous, response.data]);
                    setToastMessage('Rendez-vous ajouté avec succès !');
                }
                setShowToast(true);
                handleClose();
            } catch (error) {
                console.error('Erreur lors de l\'ajout ou de la mise à jour du rendez-vous :', error.response?.data || error.message);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { date: '', patient: '', medecin: '' };

        if (!date.trim()) {
            errorsCopy.date = 'La date est requise';
            valid = false;
        }
        if (!selectedPatient) {
            errorsCopy.patient = 'Le patient est requis';
            valid = false;
        }
        if (!selectedMedecin) {
            errorsCopy.medecin = 'Le médecin est requis';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    const updateRendezvousForm = (rendezvous) => {
        setDate(rendezvous.date);
        setSelectedPatient(rendezvous.patient ? rendezvous.patient.id : '');
        setSelectedMedecin(rendezvous.medecin ? rendezvous.medecin.id : '');
        setCurrentRendezvousId(rendezvous.id);
        setShowModal(true);
    };

    const indexOfLastRendezvous = currentPage * rendezvousPerPage;
    const indexOfFirstRendezvous = indexOfLastRendezvous - rendezvousPerPage;
    const currentRendezvous = rendezvous.slice(indexOfFirstRendezvous, indexOfLastRendezvous);

    return (
        <div className="table-container">
            <h2>Liste des Rendez-vous</h2>
            <Row className="align-items-center mb-3">
                <Col xs="auto">
                    <Button variant="primary" onClick={handleShow}>
                        Ajouter Un Rendez-vous
                    </Button>
                </Col>
            </Row>

            {/* Conteneur pour le toast */}
            <div className="toast-container">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>

            <Table striped bordered hover variant="gray">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRendezvous.map((rdv) => (
                        <tr key={rdv.id}>
                            <td>{rdv.date}</td>
                            <td>{patientsMap[rdv.patient.id]}</td>
                            <td>{medecinsMap[rdv.medecin.id]}</td>
                            <td>
                                <button className="btn btn me-2" onClick={() => updateRendezvousForm(rdv)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination au centre en bas */}
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastRendezvous >= rendezvous.length} />
                    </Pagination>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Rendez-vous</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                isInvalid={!!errors.date}
                            />
                            <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Patient</Form.Label>
                            <Form.Select value={selectedPatient} onChange={handlePatientChange} isInvalid={!!errors.patient}>
                                <option value="">Sélectionnez un patient</option>
                                {Object.entries(patientsMap).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.patient}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Médecin</Form.Label>
                            <Form.Select value={selectedMedecin} onChange={handleMedecinChange} isInvalid={!!errors.medecin}>
                                <option value="">Sélectionnez un médecin</option>
                                {Object.entries(medecinsMap).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.medecin}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={saveRendezvous}>
                        {currentRendezvousId ? 'Modifier' : 'Sauvegarder'}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>Annuler</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RendezVousComponent;
