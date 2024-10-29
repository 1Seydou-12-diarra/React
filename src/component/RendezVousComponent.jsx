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

                // Remplir patientsMap et medecinsMap
                const patientsResponse = await listePatient();
                const medecinsResponse = await listeMedecins();
                
                const patientsMap = {};
                patientsResponse.data.forEach(patient => {
                    patientsMap[patient.id] = patient.nom; // Ajustez si nécessaire
                });
                setPatientsMap(patientsMap);
                
                const medecinsMap = {};
                medecinsResponse.data.forEach(medecin => {
                    medecinsMap[medecin.id] = medecin.nom; // Ajustez si nécessaire
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
                    await updateRendezVous(currentRendezvousId, rendezvousData);
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
                console.error('Erreur lors de l\'ajout ou de la mise à jour du rendez-vous :', error);
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
            <Table striped bordered hover>
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
                            <td>{patientsMap[rendezvous.patient.id] || 'Inconnu'}</td>
                            <td>{medecinsMap[rendezvous.medecin.id] || 'Inconnu'}</td>
                            <td>
                                <Button className='btn-primary me-2' onClick={() => updateRendezvousForm(rendezvous)}>
                                    Modifier
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-end">
                <Pagination>{paginationItems}</Pagination>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentRendezvousId ? 'Modifier un Rendez-vous' : 'Ajouter un Rendez-vous'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit=''>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                className={errors.date ? 'is-invalid' : ''}
                            />
                            {errors.date && <div className='invalid-feedback'>{errors.date}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Patient</Form.Label>
                            <Form.Control as="select" value={selectedPatient} onChange={handlePatientChange}>
                                <option value="">Sélectionnez un patient</option>
                                {Object.entries(patientsMap).map(([id, nom]) => (
                                    <option key={id} value={id}>
                                        {nom}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.patient && <div className='invalid-feedback'>{errors.patient}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Médecin</Form.Label>
                            <Form.Control as="select" value={selectedMedecin} onChange={handleMedecinChange}>
                                <option value="">Sélectionnez un médecin</option>
                                {Object.entries(medecinsMap).map(([id, nom]) => (
                                    <option key={id} value={id}>
                                        {nom}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.medecin && <div className='invalid-feedback'>{errors.medecin}</div>}
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={saveRendezvous}>
                            {currentRendezvousId ? 'Modifier' : 'Ajouter'}
                        </Button>
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
