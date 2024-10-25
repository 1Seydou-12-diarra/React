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
import './Table.css';

const RendezVousComponent = () => {
    const [rendezvous, setRendezvous] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medecins, setMedecins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedMedecin, setSelectedMedecin] = useState('');
    const [currentRendezvousId, setCurrentRendezvousId] = useState(null);
    const [errors, setErrors] = useState({
        date: '',
        patient: '',
        medecin: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rendezvousPerPage = 10;

    useEffect(() => {
        // Charger la liste des rendez-vous
        const fetchData = async () => {
            try {
                const rendezvousResponse = await listeRendezvous();
                setRendezvous(rendezvousResponse.data);

                const patientsResponse = await listePatient();
                setPatients(patientsResponse.data);

                const medecinsResponse = await listeMedecins();
                setMedecins(medecinsResponse.data);
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
        setErrors({ date: '', patient: '', medecin: '' }); // Réinitialiser les erreurs
    };

    const handleShow = () => setShowModal(true);
    const handleDateChange = (e) => setDate(e.target.value);
    const handlePatientChange = (e) => setSelectedPatient(e.target.value);
    const handleMedecinChange = (e) => setSelectedMedecin(e.target.value);

    const saveRendezvous = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const rendezvousData = { date, patientId: selectedPatient, medecinId: selectedMedecin };

            try {
                if (currentRendezvousId) {
                    await updateRendezVous(currentRendezvousId, rendezvousData);
                    const updatedRendezvous = rendezvous.map((r) =>
                        r.id === currentRendezvousId ? { ...r, ...rendezvousData } : r
                    );
                    setRendezvous(updatedRendezvous);
                    setToastMessage('Rendez-vous modifié avec succès !');
                } else {
                    const response = await ajouterRendezVous(rendezvousData);
                    setRendezvous([...rendezvous, response.data]);
                    setToastMessage('Rendez-vous ajouté avec succès !');
                }
                setShowToast(true);
                handleClose();
            } catch (error) {
                console.error('Erreur lors de l\'ajout ou de la mise à jour du rendez-vous :', error);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };
        
        if (date.trim()) {
            errorsCopy.date = '';
        } else {
            errorsCopy.date = 'La date est requise';
            valid = false;
        }

        if (selectedPatient) {
            errorsCopy.patient = '';
        } else {
            errorsCopy.patient = 'Le patient est requis';
            valid = false;
        }

        if (selectedMedecin) {
            errorsCopy.medecin = '';
        } else {
            errorsCopy.medecin = 'Le médecin est requis';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    const updateRendezvousForm = (rendezvous) => {
        setDate(rendezvous.date);
        setSelectedPatient(rendezvous.patientId);
        setSelectedMedecin(rendezvous.medecinId);
        setCurrentRendezvousId(rendezvous.id);
        setShowModal(true);
    };

    // Pagination logic
    const indexOfLastRendezvous = currentPage * rendezvousPerPage;
    const indexOfFirstRendezvous = indexOfLastRendezvous - rendezvousPerPage;
    const currentRendezvous = rendezvous.slice(indexOfFirstRendezvous, indexOfLastRendezvous);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(rendezvous.length / rendezvousPerPage);
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
            <h2>Liste des Rendez-vous</h2>
            <Button variant="primary" className="float-start me-3 mb-3" onClick={handleShow}>
                Ajouter Un Rendez-vous
            </Button>
            <Table striped bordered hover variant="gray">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRendezvous.map((rendezvous, index) => (
                        <tr key={rendezvous.id}>
                            <td>{index + 1 + indexOfFirstRendezvous}</td>
                            <td>{rendezvous.date}</td>
                            <td>{patients.find(patient => patient.id === rendezvous.patientId)?.nom || 'Inconnu'}</td>
                            <td>{medecins.find(medecin => medecin.id === rendezvous.medecinId)?.nom || 'Inconnu'}</td>
                            <td>
                                <button className='btn btn me-2' onClick={() => updateRendezvousForm(rendezvous)}>
                                    Modifier
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

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentRendezvousId ? 'Modifier un Rendez-vous' : 'Ajouter un Rendez-vous'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                required
                                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                            />
                            {errors.date && <div className='invalid-feedback'>{errors.date}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Patient</Form.Label>
                            <Form.Control as="select" value={selectedPatient} onChange={handlePatientChange} required>
                                <option value="">Sélectionnez un patient</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.nom}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.patient && <div className='invalid-feedback'>{errors.patient}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Médecin</Form.Label>
                            <Form.Control as="select" value={selectedMedecin} onChange={handleMedecinChange} required>
                                <option value="">Sélectionnez un médecin</option>
                                {medecins.map((medecin) => (
                                    <option key={medecin.id} value={medecin.id}>
                                        {medecin.nom}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.medecin && <div className='invalid-feedback'>{errors.medecin}</div>}
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="primary" type="submit" onClick={saveRendezvous}>
                                {currentRendezvousId ? 'Modifier' : 'Ajouter'}
                            </Button>
                            <Button variant="secondary" onClick={handleClose}>
                                Fermer
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default RendezVousComponent;
