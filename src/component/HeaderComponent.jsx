import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Header.css';

export const HeaderComponent = () => {
    return (
        <>
            <header>
                <Navbar bg="" data-bs-theme="">
                    <Container>
                    <h1 >Gestion Des Rendez Vous d'Hopital</h1>
                    </Container>
                </Navbar>
            </header>

        </>
    );
}
