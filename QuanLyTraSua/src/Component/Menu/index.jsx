import React from 'react';
import image from '../../assets/Menu.png';

function Menu() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-black mt-24">
            <img src={image} alt="menu" className="max-w-full max-h-full object-contain" />
        </div>
    );
}

export default Menu;
