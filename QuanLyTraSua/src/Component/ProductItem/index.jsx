import React from 'react';

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

            <img src={`http://localhost:5000${image}`} alt={name} className="product-image" />
        </div>
    );
}

export default ProductItem;
