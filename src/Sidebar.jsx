import React from 'react';
import './App.css';
const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <br />
                <br />
                <li><a href="/home">Dashboard</a></li>
                <li><a href="/patient">Patient</a></li>
                <li><a href="/medecin">Medecin</a></li>
                <li><a href="/rendezVous">RendezVous</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
