import React, { useState } from 'react';
import './App.css';
import ListePatientsComponent from './component/ListePatientsComponent';
import { HeaderComponent } from './component/HeaderComponent';
import { FooterComponent } from './component/FooterComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          <Route path='/' element={<ListePatientsComponent />} />
          <Route path='/patient' element={<ListePatientsComponent />} />
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
