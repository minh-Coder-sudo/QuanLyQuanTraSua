import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Static Reference Data (Fallback) ──────────────────────────────────────────
const FALLBACK_CATEGORIES = [
    { slug: 'tra-sua', name: 'Trà sữa' },
    { slug: 'tra-trai-cay', name: 'Trà trái cây' },
];

const SAMPLE_CATEGORY_IMAGES = [
    { name: 'Trà sữa', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500' },
    { name: 'Trà trái cây', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500' },
    { name: 'Đá xay', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500' },
    { name: 'Sữa chua', url: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=500' },
];

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

const SUGAR_OPTIONS = [0, 30, 50, 70, 100];
const ICE_OPTIONS = [0, 30, 50, 70, 100];
const PAGE_SIZE = 6;

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

const SEED_PRODUCTS = [
    {
        id: uid(),
        name: 'Trà sữa trân châu đường đen',
        categorySlug: 'tra-sua',
        description: 'Béo - thơm - đậm vị đường đen.',
        image: 'https://picsum.photos/seed/ts1/600/600',
        basePrice: 35000,
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 10000 },
        ],
        toppings: ['PEARL', 'CHEESE'],
        sugarLevels: [0, 50, 100],
        iceLevels: [0, 50, 100],
        status: 'AVAILABLE',
    },
    {
        id: uid(),
        name: 'Trà sữa matcha',
        categorySlug: 'tra-sua',
        description: 'Matcha thơm đậm, dễ uống.',
        image: 'https://picsum.photos/seed/ts2/600/600',
        basePrice: 42000,
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 10000 },
        ],
        toppings: ['PEARL', 'PUDDING'],
        sugarLevels: [0, 30, 50, 70, 100],
        iceLevels: [0, 50, 100],
        status: 'AVAILABLE',
    },
    {
        id: uid(),
        name: 'Trà đào cam sả',
        categorySlug: 'tra-trai-cay',
        description: 'Thanh mát, thơm sả.',
        image: 'https://picsum.photos/seed/ttc1/600/600',
        basePrice: 39000,
        sizes: [
            { code: 'M', label: 'Medium', extra: 0 },
            { code: 'L', label: 'Large', extra: 8000 },
        ],
        toppings: ['JELLY'],
        sugarLevels: [0, 50, 100],
        iceLevels: [0, 50, 100],
        status: 'AVAILABLE',
    },
    {
        id: uid(),
        name: 'Trà vải',
        categorySlug: 'tra-trai-cay',
        description: 'Vị vải thơm, uống cực đã.',
        image: 'https://picsum.photos/seed/ttc2/600/600',
        basePrice: 38000,
        sizes: [
            { code: 'M', label: 'Medium', extra: 0 },
            { code: 'L', label: 'Large', extra: 8000 },
        ],
        toppings: ['JELLY', 'ALOE'],
        sugarLevels: [0, 30, 70, 100],
        iceLevels: [0, 50, 100],
        status: 'OUT_OF_STOCK',
    },
    {
        id: uid(),
        name: 'Sữa chua dâu',
        categorySlug: 'sua-chua',
        description: 'Chua nhẹ, thơm dâu.',
        image: 'https://picsum.photos/seed/sc1/600/600',
        basePrice: 45000,
        sizes: [
            { code: 'M', label: 'Medium', extra: 0 },
            { code: 'L', label: 'Large', extra: 7000 },
        ],
        toppings: ['FRUIT'],
        sugarLevels: [0, 50, 100],
        iceLevels: [0, 50, 100],
        status: 'AVAILABLE',
    },
    {
        id: uid(),
        name: 'Sữa chua nếp cẩm',
        categorySlug: 'sua-chua',
        description: 'Bùi nếp cẩm, ngon no.',
        image: 'https://picsum.photos/seed/sc2/600/600',
        basePrice: 47000,
        sizes: [
            { code: 'M', label: 'Medium', extra: 0 },
            { code: 'L', label: 'Large', extra: 7000 },
        ],
        toppings: ['PUDDING', 'COCONUT'],
        sugarLevels: [0, 50, 100],
        iceLevels: [0, 50, 100],
        status: 'AVAILABLE',
    },
    {
        id: uid(),
        name: 'Trà ô long sữa',
        categorySlug: 'tra-sua',
        description: 'Hương ô long thanh tao, béo nhẹ.',
        image: 'https://picsum.photos/seed/ts3/600/600',
        basePrice: 40000,
        sizes: [
            { code: 'S', label: 'Small', extra: 0 },
            { code: 'M', label: 'Medium', extra: 5000 },
            { code: 'L', label: 'Large', extra: 10000 },
        ],
        toppings: ['PEARL', 'GOLD_PEARL'],
        sugarLevels: [0, 30, 50, 100],
        iceLevels: [0, 30, 50, 100],
        status: 'AVAILABLE',
    },
    {
        id: uid(),
        name: 'Trà dâu tây',
        categorySlug: 'tra-trai-cay',
        description: 'Thơm dâu, ngọt thanh.',
        image: 'https://picsum.photos/seed/ttc3/600/600',
        basePrice: 41000,
        sizes: [
            { code: 'M', label: 'Medium', extra: 0 },
            { code: 'L', label: 'Large', extra: 8000 },
        ],
        toppings: ['JELLY', 'FRUIT'],
        sugarLevels: [0, 50, 100],
        iceLevels: [0, 50, 100],
        status: 'OUT_OF_STOCK',
    },
];

const EMPTY_FORM = {
    name: '',
    categorySlug: 'tra-sua',
    description: '',
    image: '',
    basePrice: '',
    sizes: [{ code: 'M', label: 'Medium', extra: 0 }],
    toppings: [],
    sugarLevels: [0, 50, 100],
    iceLevels: [0, 50, 100],
    status: 'AVAILABLE',
};

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg text-sm text-white min-w-[260px] transition-all
            ${t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-amber-500'}`}
                >
                    <span className="text-base">{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 text-lg leading-none">
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}

function useToast() {
    const [toasts, setToasts] = useState([]);
    const add = useCallback((message, type = 'success') => {
        const id = uid();
        setToasts((p) => [...p, { id, message, type }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    }, []);
    const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
    return { toasts, add, remove };
}

// ─── Image Drop Zone ───────────────────────────────────────────────────────
function ImagePicker({ value, onChange }) {
    const inputRef = useRef();
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(e.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => inputRef.current.click()}
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition
          ${dragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 bg-gray-50'}`}
                style={{ minHeight: 120 }}
            >
                {value ? (
                    <img src={value} alt="preview" className="h-24 w-auto object-contain rounded" />
                ) : (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16 9l-4-4-4 4M12 5v11"
                            />
                        </svg>
                        <p className="text-xs text-gray-400">
                            Kéo thả ảnh hoặc <span className="text-amber-600 font-medium">chọn file</span>
                        </p>
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </div>
            <div className="flex gap-2 mt-2 items-center">
                <input
                    type="text"
                    value={value && value.startsWith('data:') ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Hoặc nhập URL ảnh..."
                    className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="text-red-400 hover:text-red-600 text-xs"
                    >
                        Xoá
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Sizes Editor ──────────────────────────────────────────────────────────
const SIZE_OPTIONS = [
    { code: 'S', label: 'Small' },
    { code: 'M', label: 'Medium' },
    { code: 'L', label: 'Large' },
];

function SizesEditor({ sizes, onChange }) {
    const toggle = (opt) => {
        const exists = sizes.find((s) => s.code === opt.code);
        if (exists) {
            onChange(sizes.filter((s) => s.code !== opt.code));
        } else {
            onChange([...sizes, { code: opt.code, label: opt.label, extra: 0 }]);
        }
    };
    const setExtra = (code, val) => {
        onChange(sizes.map((s) => (s.code === code ? { ...s, extra: parseInt(val) || 0 } : s)));
    };

    return (
        <div className="space-y-2">
            {SIZE_OPTIONS.map((opt) => {
                const active = sizes.find((s) => s.code === opt.code);
                return (
                    <div key={opt.code} className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer w-28">
                            <input
                                type="checkbox"
                                checked={!!active}
                                onChange={() => toggle(opt)}
                                className="accent-amber-500 w-4 h-4"
                            />
                            <span className={`text-sm font-medium ${active ? 'text-gray-800' : 'text-gray-400'}`}>
                                {opt.code} – {opt.label}
                            </span>
                        </label>
                        {active && (
                            <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-500 text-xs">Thêm:</span>
                                <input
                                    type="number"
                                    value={active.extra}
                                    onChange={(e) => setExtra(opt.code, e.target.value)}
                                    className="w-24 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 text-black"
                                    step={1000}
                                />
                                <span className="text-gray-400 text-xs">đ</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Level Toggle ──────────────────────────────────────────────────────────
function LevelToggle({ options, selected, onChange, unit }) {
    const toggle = (val) => {
        if (selected.includes(val)) {
            onChange(selected.filter((v) => v !== val));
        } else {
            onChange([...selected, val].sort((a, b) => a - b));
        }
    };
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((val) => (
                <button
                    key={val}
                    type="button"
                    onClick={() => toggle(val)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition
            ${selected.includes(val) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-amber-400'}`}
                >
                    {val}
                    {unit}
                </button>
            ))}
        </div>
    );
}

// ─── Delete Confirmation Modal ─────────────────────────────────────────────
function DeleteModal({ product, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Xác nhận xoá</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Bạn có chắc muốn xoá sản phẩm <span className="font-semibold text-gray-800">"{product.name}"</span>?
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Product Form Modal ────────────────────────────────────────────────────
function ProductModal({ product, categories, onSave, onClose }) {
    const [form, setForm] = useState(
        product
            ? {
                  ...product,
                  categorySlug: product.categorySlug || product.category?.slug,
                  category: product.category?._id || product.category,
                  toppings: [...product.toppings],
                  sizes: product.sizes.map((s) => ({ ...s })),
                  sugarLevels: [...product.sugarLevels],
                  iceLevels: [...product.iceLevels],
              }
            : {
                  ...EMPTY_FORM,
                  toppings: [],
                  sugarLevels: [0, 50, 100],
                  iceLevels: [0, 50, 100],
                  sizes: [{ code: 'M', label: 'Medium', extra: 0 }],
              },
    );

    const set = (key, val) => {
        if (key === 'category') {
            const found = categories.find((c) => c._id === val);
            setForm((p) => ({ ...p, category: val, categorySlug: found?.slug || '' }));
        } else {
            setForm((p) => ({ ...p, [key]: val }));
        }
    };

    const toggleTopping = (code) => {
        set(
            'toppings',
            form.toppings.includes(code) ? form.toppings.filter((c) => c !== code) : [...form.toppings, code],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        if (!form.basePrice || isNaN(form.basePrice)) return;
        if (form.sizes.length === 0) return;
        onSave({ ...form, basePrice: parseInt(form.basePrice) });
    };

    // Close on backdrop click
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">
                        {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Section: Basic Info */}
                    <div>
                        <SectionTitle>Thông tin cơ bản</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <div className="sm:col-span-2">
                                <Label>
                                    Tên sản phẩm <Required />
                                </Label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                    className="input w-full text-black placeholder:text-gray-400"
                                    placeholder="VD: Trà sữa trân châu..."
                                />
                            </div>
                            <div>
                                <Label>Danh mục</Label>
                                <select
                                    value={form.category}
                                    onChange={(e) => set('category', e.target.value)}
                                    className="input w-full text-black"
                                >
                                    <option value="">Chọn danh mục...</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>
                                    Giá gốc (đ) <Required />
                                </Label>
                                <input
                                    required
                                    type="number"
                                    min={0}
                                    step={1000}
                                    value={form.basePrice}
                                    onChange={(e) => set('basePrice', e.target.value)}
                                    className="input w-full text-black"
                                    placeholder="35000"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label>Mô tả</Label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    className="input w-full resize-none text-black"
                                    rows={2}
                                    placeholder="Mô tả ngắn về sản phẩm..."
                                />
                            </div>
                            <div>
                                <Label>Trạng thái</Label>
                                <select
                                    value={form.status}
                                    onChange={(e) => set('status', e.target.value)}
                                    className="input w-full text-black"
                                >
                                    <option value="AVAILABLE">Còn hàng</option>
                                    <option value="OUT_OF_STOCK">Hết hàng</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section: Image */}
                    <div>
                        <SectionTitle>Hình ảnh</SectionTitle>
                        <div className="mt-3">
                            <ImagePicker value={form.image} onChange={(v) => set('image', v)} />
                        </div>
                    </div>

                    {/* Section: Sizes */}
                    <div>
                        <SectionTitle>Kích thước & Giá</SectionTitle>
                        <p className="text-xs text-gray-400 mb-3">
                            Chọn ít nhất 1 size. Giá "Thêm" sẽ cộng vào giá gốc.
                        </p>
                        <SizesEditor sizes={form.sizes} onChange={(v) => set('sizes', v)} />
                        {form.sizes.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">Cần chọn ít nhất 1 kích thước.</p>
                        )}
                    </div>

                    {/* Section: Toppings */}
                    <div>
                        <SectionTitle>Topping có sẵn</SectionTitle>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            {ALL_TOPPINGS.map((t) => {
                                const active = form.toppings.includes(t.code);
                                return (
                                    <label
                                        key={t.code}
                                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition text-xs
                    ${active ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={active}
                                            onChange={() => toggleTopping(t.code)}
                                            className="accent-amber-500"
                                        />
                                        <div>
                                            <p className={`font-medium ${active ? 'text-amber-700' : 'text-gray-700'}`}>
                                                {t.name}
                                            </p>
                                            <p className="text-gray-400">+{t.price.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section: Sugar & Ice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <SectionTitle>Mức đường (%)</SectionTitle>
                            <div className="mt-3">
                                <LevelToggle
                                    options={SUGAR_OPTIONS}
                                    selected={form.sugarLevels}
                                    onChange={(v) => set('sugarLevels', v)}
                                    unit="%"
                                />
                            </div>
                        </div>
                        <div>
                            <SectionTitle>Mức đá (%)</SectionTitle>
                            <div className="mt-3">
                                <LevelToggle
                                    options={ICE_OPTIONS}
                                    selected={form.iceLevels}
                                    onChange={(v) => set('iceLevels', v)}
                                    unit="%"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition shadow"
                        >
                            {product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Category Modal ──────────────────────────────────────────────────────────
function CategoryModal({ category, onSave, onClose }) {
    const [form, setForm] = useState(category ? { ...category } : { name: '', slug: '', image: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    {category ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>
                            Tên danh mục <Required />
                        </Label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                    slug: e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')
                                        .replace(/[^\w-]+/g, ''),
                                })
                            }
                            className="input w-full text-black"
                        />
                    </div>
                    <div>
                        <Label>
                            Slug <Required />
                        </Label>
                        <input
                            required
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            className="input w-full text-black"
                        />
                    </div>
                    <div>
                        <Label>Hình ảnh (URL)</Label>
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                            {SAMPLE_CATEGORY_IMAGES.map((img) => (
                                <button
                                    key={img.url}
                                    type="button"
                                    onClick={() => setForm({ ...form, image: img.url })}
                                    className={`shrink-0 border-2 rounded-lg p-1 transition ${form.image === img.url ? 'border-amber-500' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.name}
                                        className="w-10 h-10 object-cover rounded shadow-sm"
                                    />
                                </button>
                            ))}
                        </div>
                        <input
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            className="input w-full text-black"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600">
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-500 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                        >
                            Lưu lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import SalesDashboard from './SalesDashboard';
import OrderList from './OrderList';
import Statistics from './Statistics';

// Small helpers
function SectionTitle({ children }) {
    return (
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2 after:flex-1 after:h-px after:bg-gray-100 after:ml-2">
            {children}
        </h3>
    );
}
function Label({ children }) {
    return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}
function Required() {
    return <span className="text-red-500 ml-0.5">*</span>;
}

// Inject tailwind utility classes for inputs via a style tag trick
function GlobalStyles() {
    useEffect(() => {
        const id = 'pm-global-styles';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `.input{border:1px solid #d1d5db;border-radius:0.5rem;padding:0.5rem 0.75rem;font-size:0.875rem;outline:none;transition:border 0.15s,box-shadow 0.15s;background:#fff;}.input:focus{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,0.2);}`;
        document.head.appendChild(style);
    }, []);
    return null;
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProductManagement() {
    const [view, setView] = useState('dashboard'); // 'dashboard', 'products', 'categories', 'orders', 'stats'
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [editCategory, setEditCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toasts, add: toast, remove: removeToast } = useToast();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            toast('Lỗi khi tải sản phẩm!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ── Derived: filtered and paginated ──────────────────────────────────────
    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat =
            catFilter === 'all' ||
            p.categorySlug === catFilter ||
            p.category === catFilter ||
            p.category?._id === catFilter ||
            p.category?.slug === catFilter;
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [search, catFilter, statusFilter]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const openCreate = () => {
        if (view === 'products') setEditProduct(null);
        else setEditCategory(null);
        setShowModal(true);
    };
    const openEdit = (p) => {
        setEditProduct(p);
        setShowModal(true);
    };

    const handleSave = async (data) => {
        try {
            if (editProduct) {
                await productService.updateProduct(editProduct._id, data);
                toast('Cập nhật sản phẩm thành công!');
            } else {
                await productService.createProduct(data);
                toast('Thêm sản phẩm thành công!');
            }
            fetchProducts();
            setShowModal(false);
        } catch (error) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                toast(
                    'Phiên làm việc hết hạn hoặc không có quyền Admin. Vui lòng Đăng xuất và Đăng nhập lại bằng admin@teamango.com!',
                    'error',
                );
            } else {
                toast(error.response?.data?.message || 'Lỗi khi lưu sản phẩm!', 'error');
            }
        }
    };

    const handleSaveCategory = async (data) => {
        try {
            if (editCategory) {
                await categoryService.updateCategory(editCategory._id, data);
                toast('Đã cập nhật danh mục!');
            } else {
                await categoryService.createCategory(data);
                toast('Đã thêm danh mục mới!');
            }
            fetchCategories();
            setShowModal(false);
        } catch (error) {
            toast(error.response?.data?.message || 'Lỗi khi lưu danh mục!', 'error');
        }
    };

    const handleDeleteItem = async () => {
        try {
            if (view === 'products') {
                await productService.deleteProduct(deleteTarget._id);
                toast(`Đã xoá s/p "${deleteTarget.name}"`, 'error');
                fetchProducts();
            } else {
                await categoryService.deleteCategory(deleteTarget._id);
                toast(`Đã xoá d/m "${deleteTarget.name}"`, 'error');
                fetchCategories();
            }
            setDeleteTarget(null);
        } catch (error) {
            toast(error.response?.data?.message || 'Không thể thực hiện lệnh xoá!', 'error');
        }
    };

    const toggleStatus = async (p) => {
        try {
            const newStatus = p.status === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE';
            await productService.updateProduct(p._id, { ...p, status: newStatus });
            toast(`Đã ${newStatus === 'AVAILABLE' ? 'hiện' : 'ẩn'} "${p.name}"`, 'info');
            fetchProducts();
        } catch (error) {
            toast('Lỗi khi cập nhật trạng thái!', 'error');
        }
    };

    const catName = (slugOrIdOrObj) => {
        // Nếu là Object (do populate từ Backend)
        if (typeof slugOrIdOrObj === 'object' && slugOrIdOrObj !== null) {
            return slugOrIdOrObj.name || slugOrIdOrObj.slug || 'N/A';
        }

        const found = categories.find((c) => c.slug === slugOrIdOrObj || c._id === slugOrIdOrObj);
        return found ? found.name : slugOrIdOrObj || 'N/A';
    };

    return (
        <>
            <GlobalStyles />
            <Toast toasts={toasts} remove={removeToast} />

            <div className="min-h-screen bg-gray-100 pt-24 flex">
                {/* ── Sidebar ──────────────────────────────────────────────────── */}
                <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white shrink-0 fixed top-0 bottom-0 left-0 z-30 pt-24">
                    <div className="px-4 py-5 border-b border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Quản lý</p>
                        <p className="text-lg font-bold mt-0.5">Tea Mango</p>
                    </div>
                    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto text-sm">
                        {[
                            { id: 'dashboard', label: 'Bán hàng (POS)', icon: '🛒', active: view === 'dashboard' },
                            { id: 'products', label: 'Sản phẩm', icon: '🧋', active: view === 'products' },
                            { id: 'categories', label: 'Danh mục', icon: '📂', active: view === 'categories' },
                            { id: 'orders', label: 'Đơn hàng', icon: '🧾', active: view === 'orders' },
                            { id: 'stats', label: 'Thống kê', icon: '📊', active: view === 'stats' },
                            { id: 'users', label: 'Khách hàng', icon: '👥' },
                            { id: 'settings', label: 'Cài đặt', icon: '⚙️' },
                        ].map(({ id, label, icon, active }) => (
                            <button
                                key={id}
                                onClick={() => id !== 'users' && id !== 'settings' && setView(id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition
                ${active ? 'bg-amber-500 text-white font-semibold shadow-md translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <span className="text-lg">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── Main ─────────────────────────────────────────────────────── */}
                <main className="flex-1 lg:ml-64 p-5 md:p-8 overflow-x-auto min-h-screen">
                    {view === 'dashboard' && <SalesDashboard onOrderSuccess={(m) => toast(m)} />}
                    {view === 'orders' && <OrderList />}
                    {view === 'stats' && <Statistics />}

                    {(view === 'products' || view === 'categories') && (
                        <>
                            {/* Page header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {view === 'products' ? 'Quản lý sản phẩm' : 'Quản lý danh mục'}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {view === 'products'
                                            ? `Tổng cộng ${products.length} sản phẩm`
                                            : `Tổng cộng ${categories.length} danh mục`}
                                    </p>
                                </div>
                                <button
                                    onClick={openCreate}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    {view === 'products' ? 'Thêm sản phẩm' : 'Thêm danh mục'}
                                </button>
                            </div>

                            {view === 'products' ? (
                                <>
                                    {/* Filter bar */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                                                />
                                            </svg>
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Tìm kiếm sản phẩm..."
                                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none text-black"
                                            />
                                        </div>
                                        <select
                                            value={catFilter}
                                            onChange={(e) => setCatFilter(e.target.value)}
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none text-black"
                                        >
                                            <option value="all">Tất cả danh mục</option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none text-black"
                                        >
                                            <option value="all">Tất cả trạng thái</option>
                                            <option value="AVAILABLE">Còn hàng</option>
                                            <option value="OUT_OF_STOCK">Hết hàng</option>
                                        </select>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 font-semibold text-gray-600">Ảnh</th>
                                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                                            Tên sản phẩm
                                                        </th>
                                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                                            Danh mục
                                                        </th>
                                                        <th className="px-4 py-3 font-semibold text-gray-600">Size</th>
                                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                                            Giá gốc
                                                        </th>
                                                        <th className="px-4 py-3 font-semibold text-gray-600">
                                                            Trạng thái
                                                        </th>
                                                        <th className="px-4 py-3 font-semibold text-gray-600 text-center">
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {loading ? (
                                                        <tr>
                                                            <td
                                                                colSpan={7}
                                                                className="text-center py-10 text-gray-400 animate-pulse"
                                                            >
                                                                Đang tải dữ liệu...
                                                            </td>
                                                        </tr>
                                                    ) : paginated.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={7} className="text-center py-10 text-gray-400">
                                                                Không tìm thấy sản phẩm nào.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        paginated.map((p) => (
                                                            <tr key={p._id} className="hover:bg-amber-50/20 transition">
                                                                <td className="px-4 py-3">
                                                                    <img
                                                                        src={`http://localhost:5000${p.image}`}
                                                                        className="w-10 h-10 rounded-lg object-cover border"
                                                                        alt=""
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-4 font-medium text-gray-800">
                                                                    {p.name}
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-black">
                                                                        {catName(p.category)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {(p.sizes || []).map((s) => (
                                                                            <span
                                                                                key={s.code}
                                                                                className="px-1.5 py-0.5 border border-gray-200 rounded text-[10px] text-gray-500 bg-white"
                                                                            >
                                                                                {s.code}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4 font-semibold text-black">
                                                                    {p.basePrice.toLocaleString()}đ
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <button
                                                                        onClick={() => toggleStatus(p)}
                                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                                                    >
                                                                        {p.status === 'AVAILABLE'
                                                                            ? 'CÒN HÀNG'
                                                                            : 'HẾT HÀNG'}
                                                                    </button>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="flex justify-center gap-2">
                                                                        <button
                                                                            onClick={() => openEdit(p)}
                                                                            className="p-1 text-black hover:text-amber-600 transition"
                                                                        >
                                                                            ✎
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setDeleteTarget(p)}
                                                                            className="p-1 hover:text-red-600 transition"
                                                                        >
                                                                            🗑
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <p>
                                            Trang {safePage} / {totalPages}
                                        </p>
                                        <div className="flex gap-1">
                                            <PagBtn
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={safePage === 1}
                                            >
                                                ‹
                                            </PagBtn>
                                            <PagBtn
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={safePage === totalPages}
                                            >
                                                ›
                                            </PagBtn>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-4 text-black">Ảnh</th>
                                                <th className="px-6 py-4 text-black">Tên danh mục</th>
                                                <th className="px-6 py-4 text-black">Slug</th>
                                                <th className="px-6 py-4 text-center text-black">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {categories.map((c) => (
                                                <tr key={c._id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-3">
                                                        <img
                                                            src={`http://localhost:5000${c.image}`}
                                                            className="w-10 h-10 rounded border object-cover"
                                                            alt=""
                                                        />
                                                    </td>
                                                    <td className="px-6 py-3 font-medium text-gray-800">{c.name}</td>
                                                    <td className="px-6 py-3 text-gray-500 text-xs">{c.slug}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditCategory(c);
                                                                    setShowModal(true);
                                                                }}
                                                                className="p-2 text-black hover:text-amber-600 transition"
                                                            >
                                                                ✎
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteTarget(c)}
                                                                className="p-2 hover:text-red-600 transition"
                                                            >
                                                                🗑
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Modals */}
            {showModal && view === 'products' && (
                <ProductModal
                    product={editProduct}
                    categories={categories}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {showModal && view === 'categories' && (
                <CategoryModal
                    category={editCategory}
                    onSave={handleSaveCategory}
                    onClose={() => setShowModal(false)}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    product={deleteTarget}
                    onConfirm={handleDeleteItem}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </>
    );
}

function PagBtn({ children, onClick, disabled, active }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition
        ${active ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'}`}
        >
            {children}
        </button>
    );
}
