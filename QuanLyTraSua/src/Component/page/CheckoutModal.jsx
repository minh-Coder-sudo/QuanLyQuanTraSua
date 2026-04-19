import { useState } from 'react';
import useAddressStore from '../../store/addressStore';

export default function CheckoutModal({ onClose, onSubmit }) {
    const { addresses, addAddress, selectAddress, selected } =
        useAddressStore();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const handleAdd = () => {
        if (!form.name || !form.phone || !form.address) {
            return alert('Vui lòng nhập đầy đủ');
        }

        addAddress(form);
        setForm({ name: '', phone: '', address: '' });
    };

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
            <div className='bg-white p-6 rounded-2xl w-[420px] shadow-2xl'>
                {/* HEADER */}
                <h2 className='text-2xl font-bold mb-4 text-orange-500 text-center'>
                    📦 Địa chỉ nhận hàng
                </h2>

                {/* LIST ADDRESS */}
                <div className='space-y-3 mb-4 max-h-44 overflow-y-auto pr-1'>
                    {addresses.length === 0 && (
                        <p className='text-center text-gray-400 text-sm'>
                            Chưa có địa chỉ nào
                        </p>
                    )}

                    {addresses.map((a, i) => (
                        <div
                            key={i}
                            onClick={() => selectAddress(a)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all
                            ${
                                selected === a
                                    ? 'border-orange-500 bg-orange-50 shadow ring-2 ring-orange-300'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <p className='font-semibold text-gray-800'>
                                {a.name}
                            </p>
                            <p className='text-sm text-gray-600'>
                                📞 {a.phone}
                            </p>
                            <p className='text-sm text-gray-500 truncate'>
                                📍 {a.address}
                            </p>
                        </div>
                    ))}
                </div>

                {/* FORM */}
                <div className='space-y-3'>
                    <input
                        placeholder='Tên người nhận'
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className='w-full border border-gray-300 p-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400'
                    />

                    <input
                        placeholder='Số điện thoại'
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        className='w-full border border-gray-300 p-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400'
                    />

                    <input
                        placeholder='Địa chỉ'
                        value={form.address}
                        onChange={(e) =>
                            setForm({ ...form, address: e.target.value })
                        }
                        className='w-full border border-gray-300 p-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400'
                    />

                    <button
                        onClick={handleAdd}
                        className='w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition shadow-sm font-medium'
                    >
                        ➕ Thêm địa chỉ
                    </button>
                </div>

                {/* ACTION */}
                <div className='flex gap-3 mt-5'>
                    <button
                        onClick={onClose}
                        className='flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition font-medium'
                    >
                        Hủy
                    </button>

                    <button
                        onClick={() => onSubmit(selected)}
                        className='flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition shadow-md font-semibold'
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
