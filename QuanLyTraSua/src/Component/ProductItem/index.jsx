import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
        return imagePath;
    }

    if (imagePath.startsWith('/')) {
        return `${API_URL}${imagePath}`;
    }

    return `${API_URL}/${imagePath}`;
};

function ProductItem({ name, basePrice = 0, image, description, onViewDetail }) {
    return (
        <div className="product-item">
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <p className="product-price">{basePrice.toLocaleString()} VND</p>
                <button className="product-button" onClick={onViewDetail}>
                    Chi tiết
                </button>
            </div>

            <img src={getImageUrl(image)} alt={name} className="product-image" />
        </div>
    );
}

export default ProductItem;
