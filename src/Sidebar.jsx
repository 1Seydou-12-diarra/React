import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faUserMd, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import logo from './assets/logo.png';
import './App.css';
const Sidebar = () => {
    return (
        <div className="sidebar">
            {/* <img src={logo} alt="Logo" className="sidebar-logo" /> */}

            <ul>
                <br />
                <br />
                <li><a href="/home"> <FontAwesomeIcon icon={faTachometerAlt} />Dashboard</a></li>
                <li><a href="/patient"><FontAwesomeIcon icon={faUser} />Patient</a></li>
                <li><a href="/medecin"><FontAwesomeIcon icon={faUserMd} />Medecin</a></li>
                <li><a href="/rendezVous"><FontAwesomeIcon icon={faCalendarCheck} />RendezVous</a></li>
                <li><a href="/register"><FontAwesomeIcon icon={faCalendarCheck} />Register</a></li>
                <li><a href="/login"><FontAwesomeIcon icon={faCalendarCheck} />login</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
