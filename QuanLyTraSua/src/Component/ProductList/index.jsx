import React, { useState, useEffect } from 'react';
import ProductItem from '../ProductItem';
import '../../css/Product.css';
import ProductSlider from '../sections/home/product/ProductSlider';
import ProductDetail from '../../Component/ProductDetail';
import productService from '../../services/productService';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setselectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="mt-8">
            <ProductSlider />
            <h1 className="text-2xl mt-24 ml-12 font-bold text-orange-600">
                {loading ? 'Đang tải sản phẩm...' : 'Danh sách sản phẩm'}
            </h1>
            <div className="product-list">
                {products.map((product) => (
                    <ProductItem 
                        key={product._id} 
                        {...product} 
                        id={product._id} // MongoDB uses _id
                        onViewDetail={() => setselectedProduct(product)} 
                    />
                ))}
            </div>
            {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setselectedProduct(null)} />}
        </div>
    );
}

export default ProductList;
