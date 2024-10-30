import React, { useEffect, useState } from 'react';
import { listeMedecins, ajouterMedecins, updateMedecins } from '../service/MedecinService';
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

const ListeMedecinComponent = () => {
    const [medecins, setMedecins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [specialite, setSpecialite] = useState('');
    const [currentMedecinId, setCurrentMedecinId] = useState(null);
    const [errors, setErrors] = useState({ nom: '', email: '', specialite: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const medecinsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await listeMedecins();
                setMedecins(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des médecins :", error);
            }
        };
        fetchData();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentMedecinId(null);
        setNom('');
        setEmail('');
        setErrors({ nom: '', email: '', specialite: '' });
    };

    const handleShow = () => setShowModal(true);
    const handleNomChange = (e) => setNom(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleSpecialiteChange = (e) => setSpecialite(e.target.value);

    const saveMedecin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const medecinData = { nom, email, specialite };
            try {
                if (currentMedecinId) {
                    await updateMedecins(currentMedecinId, medecinData);
                    setMedecins(medecins.map(m => m.id === currentMedecinId ? { ...m, ...medecinData } : m));
                    setToastMessage('Médecin modifié avec succès !');
                } else {
                    const response = await ajouterMedecins(medecinData);
                    setMedecins([...medecins, response.data]);
                    setToastMessage('Médecin ajouté avec succès !');
                }
                setShowToast(true);
                handleClose();
            } catch (error) {
                console.error('Erreur lors de l\'ajout ou de la mise à jour du médecin :', error);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { nom: '', email: '', specialite: '' };

        if (!nom.trim()) {
            errorsCopy.nom = 'Le nom est requis';
            valid = false;
        }
        if (!email.trim()) {
            errorsCopy.email = 'L\'email est requis';
            valid = false;
        }
        if (!specialite.trim()) {
            errorsCopy.specialite = 'specialite est requis';
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

    const indexOfLastMedecin = currentPage * medecinsPerPage;
    const indexOfFirstMedecin = indexOfLastMedecin - medecinsPerPage;
    const currentMedecins = medecins.slice(indexOfFirstMedecin, indexOfLastMedecin);

    return (
        <div className="table-container">
            <h2>Liste des Médecins</h2>
            <Row className="align-items-center mb-3">
                <Col xs="auto">
                    <Button variant="primary" onClick={handleShow}>
                        Ajouter Un Médecin
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover variant="gray">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Specialité</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMedecins.map((medecin) => (
                        <tr key={medecin.id}>
                            <td>{medecin.nom}</td>
                            <td>{medecin.email}</td>
                            <td>{medecin.specialite}</td>
                            <td>
                                <button className="btn btn me-2" onClick={() => updateMedecinForm(medecin)}>
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
                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastMedecin >= medecins.length} />
                    </Pagination>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Médecin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                value={nom}
                                onChange={handleNomChange}
                                isInvalid={errors.nom}
                            />
                            <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                isInvalid={errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Specialité</Form.Label>
                            <Form.Control
                                type="text"
                                value={specialite}
                                onChange={handleSpecialiteChange}
                                isInvalid={errors.specialite}
                            />
                            <Form.Control.Feedback type="invalid">{errors.specialite}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={saveMedecin}>Sauvegarder</Button>
                    <Button variant="secondary" onClick={handleClose}>Annuler</Button>
                </Modal.Footer>
            </Modal>

            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default ListeMedecinComponent;
