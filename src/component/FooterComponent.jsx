import React from 'react'
import './Footer.css';

export const FooterComponent = () => {
    return (
        <>

            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Votre Site. Sydou diarrassouba.</p>
                   
                </div>

            </footer>
        </>
    )
}
