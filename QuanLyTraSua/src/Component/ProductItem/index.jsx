import React from 'react';

function ProductItem({ name, price, image, description }) {
    return (
        <div className="product-item">
            <div>
                <h3 className="w-64 text-orange-500 font-weight-600 text text-xl">{name}</h3>
                <p className="w-64">{description}</p>
                <p>{price.toLocaleString()} VND</p>
                <button className="product-button">Chi tiết</button>
            </div>

            <img src={image} alt={name} width="120" className="product-image" />
        </div>
    );
}

export default ProductItem;
