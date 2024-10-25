import React, { useEffect, useState } from 'react';
import { listeMedecins, ajouterMedecins, updateMedecins } from '../service/MedecinService';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import './Table.css';

const ListeMedecinComponent = () => {
    const [medecin, setMedecin] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [specialite, setSpecialite] = useState('');
    const [currentMedecinId, setCurrentMedecinId] = useState(null);
    const [errors, setErrors] = useState({
        nom: '',
        email: '',
        specialite: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const medecinPerPage = 10;

    useEffect(() => {
        listeMedecins().then((response) => {
            setMedecin(response.data);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentMedecinId(null);
        setNom('');
        setEmail('');
        setSpecialite('');
    };

    const handleShow = () => setShowModal(true);
    const handleNomChange = (e) => setNom(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleSpecialiteChange = (e) => setSpecialite(e.target.value);

    const saveMedecins = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const medecinData = { nom, email, specialite };

            if (currentMedecinId) {
                updateMedecins(currentMedecinId, medecinData)
                    .then(() => {
                        const updatedMedecins = medecin.map((m) =>
                            m.id === currentMedecinId ? { ...m, nom, email, specialite } : m
                        );
                        setMedecin(updatedMedecins);
                        setToastMessage('Médecin modifié avec succès !');
                        setShowToast(true);
                        handleClose();
                    })
                    .catch(error => console.error('Erreur lors de la mise à jour :', error));
            } else {
                ajouterMedecins(medecinData)
                    .then((response) => {
                        setMedecin([...medecin, response.data]);
                        setToastMessage('Médecin ajouté avec succès !');
                        setShowToast(true);
                        handleClose();
                    })
                    .catch(error => console.error('Erreur lors de l\'ajout du médecin :', error));
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

        if (specialite.trim()) {
            errorsCopy.specialite = '';
        } else {
            errorsCopy.specialite = 'La spécialité est requise';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    const updateMedecinForm = (medecin) => {
        setNom(medecin.nom);
        setEmail(medecin.email);
        setSpecialite(medecin.specialite);
        setCurrentMedecinId(medecin.id);
        setShowModal(true);
    };

    const pageTitle = () => {
        return currentMedecinId ? <h2 className='text-center'>Modifier un médecin</h2> : <h2 className='text-center'>Ajouter un médecin</h2>;
    };

    // Pagination logic
    const indexOfLastMedecin = currentPage * medecinPerPage;
    const indexOfFirstMedecin = indexOfLastMedecin - medecinPerPage;
    const currentMedecins = medecin.slice(indexOfFirstMedecin, indexOfLastMedecin);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(medecin.length / medecinPerPage);
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
            <h2>Liste des Médecins</h2>
            <Button variant="primary" className="float-start me-3 mb-3" onClick={handleShow}>
                Ajouter Un Médecin
            </Button>
            <Table striped bordered hover variant="gray">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Spécialité</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMedecins.map((medecin, index) => (
                        <tr key={medecin.id}>
                            <td>{index + 1 + indexOfFirstMedecin}</td>
                            <td>{medecin.nom}</td>
                            <td>{medecin.email}</td>
                            <td>{medecin.specialite}</td>
                            <td>
                                <button className='btn btn me-2' onClick={() => updateMedecinForm(medecin)}>
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
                            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                        </Form.Group>
                        {errors.email && <div className='invalid-feedback'>{errors.email}</div>}

                        <Form.Group className="mb-3">
                            <Form.Label>Spécialité</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez la spécialité"
                                value={specialite}
                                onChange={handleSpecialiteChange}
                                required
                                className={`form-control ${errors.specialite ? 'is-invalid' : ''}`}
                            />

                        </Form.Group>
                        {errors.specialite && <div className='invalid-feedback'>{errors.specialite}</div>}
                        {/* <Button variant="primary" onClick={saveMedecins}>
                            Enregistrer
                        </Button> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={saveMedecins}>
                        {currentMedecinId ? 'Modifier' : 'Sauvegarder'}
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

export default ListeMedecinComponent;
