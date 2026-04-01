import React from 'react';
import BrownBobaTea from '../../assets/BrownBobaTea.png';
import MatchaBoba from '../../assets/MatchaBoba.png';
import PastelHuesBoba from '../../assets/PastelHuesBoba.png';
import PeachBoba from '../../assets/PeachBoba.png';
import StrawberryBoba from '../../assets/StraberryBoba.png';
import VibrantBoba from '../../assets/VibrantBoba.png';
import ProductItem from '../ProductItem';
import '../../css/Product.css';
import ProductSlider from '../sections/home/product/ProductSlider';
const productList = [
    {
        id: 1,
        name: 'Trà sữa truyền thống',
        price: 35000,
        category: 'Milk Tea',
        image: BrownBobaTea,
        description: 'Trà sữa đen truyền thống kết hợp trân châu đen dai.',
    },
    {
        id: 2,
        name: 'Trà sữa matcha',
        price: 42000,
        category: 'Milk Tea',
        image: MatchaBoba,
        description: 'Trà sữa matcha Nhật Bản thơm béo, topping trân châu trắng.',
    },
    {
        id: 3,
        name: 'Trà sữa socola',
        price: 40000,
        category: 'Milk Tea',
        image: PastelHuesBoba,
        description: 'Hương vị socola đậm đà kết hợp lớp kem sữa béo.',
    },
    {
        id: 4,
        name: 'Trà sữa khoai môn',
        price: 43000,
        category: 'Milk Tea',
        image: PeachBoba,
        description: 'Trà sữa khoai môn tím béo ngậy, topping pudding.',
    },
    {
        id: 5,
        name: 'Trà sữa dâu',
        price: 39000,
        category: 'Milk Tea',
        image: StrawberryBoba,
        description: 'Trà sữa vị dâu ngọt dịu, thêm thạch trái cây.',
    },
    {
        id: 6,
        name: 'Trà sữa caramel',
        price: 45000,
        category: 'Milk Tea',
        image: VibrantBoba,
        description: 'Trà sữa caramel thơm ngọt, topping trân châu hoàng kim.',
    },
];

function ProductList() {
    return (
        <div>
            <ProductSlider />
            <h1 className="text-2xl mt-24 ml-12 font-bold text-orange-600">Danh sách sản phẩm</h1>
            <div className="product-list">
                {productList.map((product) => (
                    <ProductItem key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}

export default ProductList;
