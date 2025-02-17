import React, { useState } from 'react';
import './App.css';
import ListePatientsComponent from './component/ListePatientsComponent';
import { HeaderComponent } from './component/HeaderComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import HomeComponent from './component/HomeComponent';
import ListeMedecinComponent from './component/ListeMedecinComponent';
import RendezVousComponent from './component/RendezVousComponent'
import RegisterComponent from './component/RegisterComponent';
import LoginComponent from './component/LoginComponent';
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div style={{ marginLeft: '250px' }}>
        {/* <HeaderComponent /> */}
        <Sidebar />
        <Routes>

          <Route path='/patient' element={<ListePatientsComponent />} />
          <Route path='/medecin' element={<ListeMedecinComponent />} />
          <Route path='/rendezVous' element={<RendezVousComponent />} />
          <Route path='/home' element={<HomeComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
        {/* <FooterComponent /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
