import React, { useState } from 'react';
import BrownBobaTea from '../../assets/BrownBobaTea.png';
import MatchaBoba from '../../assets/MatchaBoba.png';
import PastelHuesBoba from '../../assets/PastelHuesBoba.png';
import PeachBoba from '../../assets/PeachBoba.png';
import StrawberryBoba from '../../assets/StraberryBoba.png';
import VibrantBoba from '../../assets/VibrantBoba.png';
import ProductItem from '../ProductItem';
import '../../css/Product.css';
import ProductSlider from '../sections/home/product/ProductSlider';
import ProductDetail from '../../Component/ProductDetail';
const productList = [
    {
        id: 1,
        name: 'Trà sữa truyền thống',
        price: 35000,
        category: 'Milk Tea',
        image: BrownBobaTea,
        description: 'Trà sữa đen truyền thống kết hợp trân châu đen dai.',
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 10000 },
        ],
        toppings: [
            { code: 'PEARL', name: 'Trân châu đen', price: 7000 },
            { code: 'CHEESE', name: 'Kem cheese', price: 10000 },
        ],
    },
    {
        id: 2,
        name: 'Trà sữa matcha',
        price: 42000,
        category: 'Milk Tea',
        image: MatchaBoba,
        description: 'Trà sữa matcha Nhật Bản thơm béo, topping trân châu trắng.',
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 6000 },
            { code: 'L', label: 'Large', extra: 12000 },
        ],
        toppings: [
            { code: 'WHITE_PEARL', name: 'Trân châu trắng', price: 8000 },
            { code: 'RED_BEAN', name: 'Đậu đỏ', price: 9000 },
            { code: 'CHEESE', name: 'Kem cheese', price: 10000 },
        ],
    },
    {
        id: 3,
        name: 'Trà sữa socola',
        price: 40000,
        category: 'Milk Tea',
        image: PastelHuesBoba,
        description: 'Hương vị socola đậm đà kết hợp lớp kem sữa béo.',
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 10000 },
        ],
        toppings: [
            { code: 'PUDDING', name: 'Pudding trứng', price: 8000 },
            { code: 'OREO', name: 'Oreo vụn', price: 9000 },
            { code: 'CHEESE_FOAM', name: 'Milk foam', price: 10000 },
        ],
    },
    {
        id: 4,
        name: 'Trà sữa khoai môn',
        price: 43000,
        category: 'Milk Tea',
        image: PeachBoba,
        description: 'Trà sữa khoai môn tím béo ngậy, topping pudding.',
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 11000 },
        ],
        toppings: [
            { code: 'PUDDING', name: 'Pudding', price: 8000 },
            { code: 'TARO_BALL', name: 'Trân châu khoai môn', price: 10000 },
            { code: 'CHEESE', name: 'Kem cheese', price: 10000 },
        ],
    },
    {
        id: 5,
        name: 'Trà sữa dâu',
        price: 39000,
        category: 'Milk Tea',
        image: StrawberryBoba,
        description: 'Trà sữa vị dâu ngọt dịu, thêm thạch trái cây.',
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 10000 },
        ],
        toppings: [
            { code: 'FRUIT_JELLY', name: 'Thạch trái cây', price: 7000 },
            { code: 'STRAWBERRY_JELLY', name: 'Thạch dâu', price: 8000 },
            { code: 'CHEESE_FOAM', name: 'Milk foam', price: 10000 },
        ],
    },
    {
        id: 6,
        name: 'Trà sữa caramel',
        price: 45000,
        category: 'Milk Tea',
        image: VibrantBoba,
        description: 'Trà sữa caramel thơm ngọt, topping trân châu hoàng kim.',
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 6000 },
            { code: 'L', label: 'Large', extra: 12000 },
        ],
        toppings: [
            { code: 'GOLDEN_PEARL', name: 'Trân châu hoàng kim', price: 8000 },
            { code: 'PUDDING', name: 'Pudding caramel', price: 10000 },
            { code: 'CHEESE', name: 'Kem cheese', price: 10000 },
        ],
    },
];

function ProductList() {
    const [selectedProduct, setselectedProduct] = useState(null);
    return (
        <div className="mt-8">
            <ProductSlider />
            <h1 className="text-2xl mt-24 ml-12 font-bold text-orange-600">Danh sách sản phẩm</h1>
            <div className="product-list">
                {productList.map((product) => (
                    <ProductItem key={product.id} {...product} onViewDetail={() => setselectedProduct(product)} />
                ))}
            </div>
            {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setselectedProduct(null)} />}
        </div>
    );
}

export default ProductList;
