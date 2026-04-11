import React from 'react';

function ProductItem({ name, basePrice = 0, image, description, onViewDetail }) {
    return (
        <div className="product-item">
            <div>
                <h3 className="w-64 text-orange-500 font-weight-600 text text-xl">{name}</h3>
                <p className="w-64">{description}</p>
                <p>{basePrice.toLocaleString()} VND</p>
                <button className="product-button" onClick={onViewDetail}>
                    Chi tiết
                </button>
            </div>

            <img src={`http://localhost:5000${image}`} alt={name} width="120" className="product-image" />
        </div>
    );
}

export default ProductItem;
