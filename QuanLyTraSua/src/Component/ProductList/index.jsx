import React, { useState, useEffect } from 'react';
import ProductItem from '../ProductItem';
import '../../css/Product.css';
import ProductSlider from '../sections/home/product/ProductSlider';
import ProductDetail from '../../Component/ProductDetail';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

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

function ProductList() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setselectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCat, setActiveCat] = useState('all');
    const [categories, setCategories] = useState([]);
    const [search, setsearch] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts();
                const dataCategories = await categoryService.getCategories();

                const mappedProducts = data.map((product) => ({
                    ...product,
                    image: getImageUrl(product.image),
                }));

                const mappedCategories = dataCategories.map((category) => ({
                    ...category,
                    image: getImageUrl(category.image),
                }));

                setProducts(mappedProducts);
                setCategories(mappedCategories);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((p) => {
        const matchCategory = activeCat === 'all' || p.categorySlug === activeCat || p.category?._id === activeCat;

        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <div className="mt-8">
            <ProductSlider />
            <h1 className="text-2xl mt-24 ml-12 font-bold text-orange-600">
                {loading ? 'Đang tải sản phẩm...' : 'Danh sách sản phẩm'}
            </h1>
            <div className="ml-16 mt-8 mr-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
                    <TabBtn active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
                        Tất cả
                    </TabBtn>

                    {categories.map((c) => (
                        <TabBtn key={c._id} active={activeCat === c._id} onClick={() => setActiveCat(c._id)}>
                            {c.name}
                        </TabBtn>
                    ))}
                </div>

                <div className="w-full lg:w-80 shrink-0">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onChange={(e) => setsearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>
            </div>
            <div className="product-list">
                {filteredProducts.map((product) => (
                    <ProductItem
                        key={product._id}
                        {...product}
                        id={product._id}
                        onViewDetail={() => setselectedProduct(product)}
                    />
                ))}
            </div>
            {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setselectedProduct(null)} />}
        </div>
    );
}

function TabBtn({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition
      ${active ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100 hover:border-amber-400'}`}
        >
            {children}
        </button>
    );
}

export default ProductList;
