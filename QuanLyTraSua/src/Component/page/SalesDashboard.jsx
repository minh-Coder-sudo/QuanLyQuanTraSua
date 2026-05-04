import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import orderService from '../../services/orderService';

const ALL_TOPPINGS = [
    { code: 'PEARL', name: 'Trân châu đen', price: 7000 },
    { code: 'GOLD_PEARL', name: 'Trân châu vàng', price: 7000 },
    { code: 'CHEESE', name: 'Kem cheese', price: 10000 },
    { code: 'PUDDING', name: 'Pudding trứng', price: 8000 },
    { code: 'JELLY', name: 'Thạch trái cây', price: 7000 },
    { code: 'ALOE', name: 'Thạch nha đam', price: 6000 },
    { code: 'FRUIT', name: 'Trái cây mix', price: 10000 },
    { code: 'COCONUT', name: 'Thạch dừa', price: 6000 },
];

export default function SalesDashboard({ onOrderSuccess }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCat, setActiveCat] = useState('all');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [pendingOrderData, setPendingOrderData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pData, cData] = await Promise.all([
                    productService.getProducts(),
                    categoryService.getCategories(),
                ]);
                setProducts(pData);
                setCategories(cData);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addToCart = (product) => {
        const defaultSize = product.sizes.find((s) => s.code === 'M') || product.sizes[0];
        const newItem = {
            cartId: Math.random().toString(36).substring(7),
            product: product._id,
            name: product.name,
            image: product.image,
            basePrice: product.basePrice,
            quantity: 1,
            selectedSize: defaultSize,
            selectedToppings: [],
            sugar: 100,
            ice: 100,
            availableSizes: product.sizes,
            availableToppings: product.toppings, // Codes only
        };
        setCart([...cart, newItem]);
    };

    const updateCartItem = (cartId, updates) => {
        setCart(cart.map((item) => (item.cartId === cartId ? { ...item, ...updates } : item)));
    };

    const removeFromCart = (cartId) => {
        setCart(cart.filter((item) => item.cartId !== cartId));
    };

    const calculateItemPrice = (item) => {
        let price = item.basePrice + (item.selectedSize?.extra || 0);
        const toppingsPrice = item.selectedToppings.reduce((sum, t) => sum + t.price, 0);
        return (price + toppingsPrice) * item.quantity;
    };

    const totalPrice = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);

    const requestVietQrUrl = async (amount, orderCode) => {
        try {
            const response = await fetch('http://localhost:5000/api/payment/vietqr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, orderCode }),
            });
            const data = await response.json();
            return data.qrUrl || null;
        } catch (err) {
            console.error('VietQR error:', err);
            return null;
        }
    };

    const handleCheckout = async (paymentMethod) => {
        if (cart.length === 0) return;

        const orderData = {
            items: cart.map((item) => ({
                product: item.product,
                name: item.name,
                priceAtPurchase: item.basePrice + (item.selectedSize?.extra || 0),
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedToppings: item.selectedToppings,
                sugar: item.sugar,
                ice: item.ice,
            })),
            total: totalPrice,
            paymentMethod,
            user: JSON.parse(localStorage.getItem('user'))?._id,
        };

        // For bank transfers we first show a QR containing payment info + amount,
        // then the user confirms payment which will create the order with status COMPLETED.
        if (paymentMethod === 'BANK_TRANSFER') {
            setPendingOrderData(orderData);
            setCheckoutLoading(true);
            const orderCode = Date.now();
            const url = await requestVietQrUrl(totalPrice, orderCode);
            setCheckoutLoading(false);
            if (url) {
                setQrUrl(url);
                setQrModalOpen(true);
            } else {
                alert('Không thể tạo QR. Vui lòng thử lại.');
            }
            return;
        }

        // For cash (or other instant methods) create order immediately as COMPLETED
        setCheckoutLoading(true);
        try {
            await orderService.createOrder({ ...orderData, status: 'COMPLETED' });
            setCart([]);
            if (onOrderSuccess) onOrderSuccess('Thanh toán thành công!');
        } catch (error) {
            alert('Lỗi khi tạo đơn hàng!');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const confirmQrPayment = async () => {
        if (!pendingOrderData) return;
        setCheckoutLoading(true);
        try {
            await orderService.createOrder({ ...pendingOrderData, status: 'COMPLETED' });
            setCart([]);
            setQrModalOpen(false);
            setPendingOrderData(null);
            if (onOrderSuccess) onOrderSuccess('Thanh toán bằng QR thành công!');
        } catch (err) {
            alert('Lỗi khi lưu đơn hàng sau thanh toán!');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const filteredProducts =
        activeCat === 'all'
            ? products
            : products.filter((p) => p.categorySlug === activeCat || p.category?._id === activeCat);

    return (
        <div className="flex h-[calc(100vh-160px)] gap-5 overflow-hidden">
            {/* ── Menu Trái ────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex gap-2 overflow-x-auto pb-4 shrink-0">
                    <TabBtn active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
                        Tất cả
                    </TabBtn>
                    {categories.map((c) => (
                        <TabBtn key={c._id} active={activeCat === c._id} onClick={() => setActiveCat(c._id)}>
                            {c.name}
                        </TabBtn>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-2">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center h-40 text-gray-400">
                            Đang tải sản phẩm...
                        </div>
                    ) : (
                        filteredProducts.map((p) => (
                            <div
                                key={p._id}
                                onClick={() => addToCart(p)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-fit cursor-pointer hover:shadow-md hover:border-amber-400 transition flex flex-col group"
                            >
                                <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
                                    <img
                                        src={`http://localhost:5000${p.image}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                        alt=""
                                    />
                                    {p.status === 'OUT_OF_STOCK' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                                            HẾT HÀNG
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10">{p.name}</h3>
                                <p className="text-amber-600 font-bold mt-1">{p.basePrice.toLocaleString()}đ</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Giỏ hàng Phải ──────────────────────────────────────────────── */}
            <div className="w-96 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col shrink-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">🛒</span> Giỏ hàng ({cart.length})
                    </h2>
                    {cart.length > 0 && (
                        <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline">
                            Xóa hết
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                            <span className="text-4xl mb-2 opacity-20">🧋</span>
                            <p className="text-sm">Chưa có món nào được chọn</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.cartId} className="border-b border-gray-50 pb-4 last:border-0">
                                <div className="flex justify-between gap-3 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-800 truncate">{item.name}</p>
                                        <div className="flex gap-1 mt-1">
                                            {item.availableSizes.map((s) => (
                                                <button
                                                    key={s.code}
                                                    onClick={() => updateCartItem(item.cartId, { selectedSize: s })}
                                                    className={`w-6 h-6 rounded text-[10px] font-bold border transition
                          ${item.selectedSize?.code === s.code ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 text-gray-400'}`}
                                                >
                                                    {s.code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-amber-600">
                                            {calculateItemPrice(item).toLocaleString()}đ
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() =>
                                                    updateCartItem(item.cartId, {
                                                        quantity: Math.max(1, item.quantity - 1),
                                                    })
                                                }
                                                className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    updateCartItem(item.cartId, { quantity: item.quantity + 1 })
                                                }
                                                className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Toppings Picker */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {ALL_TOPPINGS.filter((t) => item.availableToppings.includes(t.code)).map((t) => {
                                        const active = item.selectedToppings.find((st) => st.code === t.code);
                                        return (
                                            <button
                                                key={t.code}
                                                onClick={() => {
                                                    const newToppings = active
                                                        ? item.selectedToppings.filter((st) => st.code !== t.code)
                                                        : [...item.selectedToppings, t];
                                                    updateCartItem(item.cartId, { selectedToppings: newToppings });
                                                }}
                                                className={`px-2 py-0.5 rounded text-[10px] border transition
                       ${active ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 text-gray-500'}`}
                                            >
                                                +{t.name}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <select
                                        value={item.sugar}
                                        onChange={(e) =>
                                            updateCartItem(item.cartId, { sugar: parseInt(e.target.value) })
                                        }
                                        className="text-[10px] border border-gray-200 rounded px-1 py-0.5 bg-gray-50 outline-none"
                                    >
                                        {[100, 70, 50, 30, 0].map((v) => (
                                            <option key={v} value={v}>
                                                Đường {v}%
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={item.ice}
                                        onChange={(e) => updateCartItem(item.cartId, { ice: parseInt(e.target.value) })}
                                        className="text-[10px] border border-gray-200 rounded px-1 py-0.5 bg-gray-50 outline-none"
                                    >
                                        {[100, 70, 50, 30, 0].map((v) => (
                                            <option key={v} value={v}>
                                                Đá {v}%
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.cartId)}
                                    className="w-full mt-2 text-[10px] text-red-400 hover:text-red-600 transition"
                                >
                                    ✕ Gỡ bỏ món này
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-900 text-white space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <span className="text-gray-400">Tạm tính:</span>
                        <span className="text-xl font-bold">{totalPrice.toLocaleString()}đ</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={checkoutLoading || cart.length === 0}
                            onClick={() => handleCheckout('CASH')}
                            className="bg-white text-gray-900 py-3 rounded-xl font-bold flex flex-col items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                            <span className="text-xs opacity-60">Tiền mặt</span>
                            💸 Thanh toán
                        </button>
                        <button
                            disabled={checkoutLoading || cart.length === 0}
                            onClick={() => handleCheckout('BANK_TRANSFER')}
                            className="bg-amber-500 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center hover:bg-amber-600 disabled:opacity-50 transition"
                        >
                            <span className="text-xs opacity-60">Chuyển khoản</span>
                            <div className="flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M3 3h8v8H3V3zm1 1v6h6V4H4zm7-1h8v8h-8V3zm1 1v6h6V4h-6zM3 13h8v8H3v-8zm1 1v6h6v-6H4zm10-1h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2z" />
                                </svg>
                                Quét mã
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {qrModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-xl p-6 w-96 text-center">
                        <h3 className="font-bold mb-3">Quét mã để thanh toán</h3>
                        {qrUrl ? (
                            <img src={qrUrl} alt="QR Payment" className="mx-auto mb-4 w-56 h-56" />
                        ) : (
                            <div className="h-56 w-56 mx-auto mb-4 flex items-center justify-center">Không có QR</div>
                        )}
                        <p className="text-lg font-bold mb-4">{totalPrice.toLocaleString()}đ</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={confirmQrPayment} className="bg-amber-500 text-white px-4 py-2 rounded">
                                Xác nhận đã thanh toán
                            </button>
                            <button
                                onClick={() => {
                                    setQrModalOpen(false);
                                    setPendingOrderData(null);
                                }}
                                className="px-4 py-2 rounded border"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
