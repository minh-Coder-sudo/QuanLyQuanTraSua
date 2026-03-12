import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Static Reference Data ─────────────────────────────────────────────────
const CATEGORIES = [
  { slug: 'tra-sua', name: 'Trà sữa' },
  { slug: 'tra-trai-cay', name: 'Trà trái cây' },
  { slug: 'sua-chua', name: 'Sữa chua' },
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
  { id: uid(), name: 'Trà sữa trân châu đường đen', categorySlug: 'tra-sua', description: 'Béo - thơm - đậm vị đường đen.', image: 'https://picsum.photos/seed/ts1/600/600', basePrice: 35000, sizes: [{ code: 'S', label: 'Small', extra: 0 }, { code: 'M', label: 'Medium', extra: 5000 }, { code: 'L', label: 'Large', extra: 10000 }], toppings: ['PEARL', 'CHEESE'], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], status: 'AVAILABLE' },
  { id: uid(), name: 'Trà sữa matcha', categorySlug: 'tra-sua', description: 'Matcha thơm đậm, dễ uống.', image: 'https://picsum.photos/seed/ts2/600/600', basePrice: 42000, sizes: [{ code: 'S', label: 'Small', extra: 0 }, { code: 'M', label: 'Medium', extra: 5000 }, { code: 'L', label: 'Large', extra: 10000 }], toppings: ['PEARL', 'PUDDING'], sugarLevels: [0, 30, 50, 70, 100], iceLevels: [0, 50, 100], status: 'AVAILABLE' },
  { id: uid(), name: 'Trà đào cam sả', categorySlug: 'tra-trai-cay', description: 'Thanh mát, thơm sả.', image: 'https://picsum.photos/seed/ttc1/600/600', basePrice: 39000, sizes: [{ code: 'M', label: 'Medium', extra: 0 }, { code: 'L', label: 'Large', extra: 8000 }], toppings: ['JELLY'], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], status: 'AVAILABLE' },
  { id: uid(), name: 'Trà vải', categorySlug: 'tra-trai-cay', description: 'Vị vải thơm, uống cực đã.', image: 'https://picsum.photos/seed/ttc2/600/600', basePrice: 38000, sizes: [{ code: 'M', label: 'Medium', extra: 0 }, { code: 'L', label: 'Large', extra: 8000 }], toppings: ['JELLY', 'ALOE'], sugarLevels: [0, 30, 70, 100], iceLevels: [0, 50, 100], status: 'OUT_OF_STOCK' },
  { id: uid(), name: 'Sữa chua dâu', categorySlug: 'sua-chua', description: 'Chua nhẹ, thơm dâu.', image: 'https://picsum.photos/seed/sc1/600/600', basePrice: 45000, sizes: [{ code: 'M', label: 'Medium', extra: 0 }, { code: 'L', label: 'Large', extra: 7000 }], toppings: ['FRUIT'], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], status: 'AVAILABLE' },
  { id: uid(), name: 'Sữa chua nếp cẩm', categorySlug: 'sua-chua', description: 'Bùi nếp cẩm, ngon no.', image: 'https://picsum.photos/seed/sc2/600/600', basePrice: 47000, sizes: [{ code: 'M', label: 'Medium', extra: 0 }, { code: 'L', label: 'Large', extra: 7000 }], toppings: ['PUDDING', 'COCONUT'], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], status: 'AVAILABLE' },
  { id: uid(), name: 'Trà ô long sữa', categorySlug: 'tra-sua', description: 'Hương ô long thanh tao, béo nhẹ.', image: 'https://picsum.photos/seed/ts3/600/600', basePrice: 40000, sizes: [{ code: 'S', label: 'Small', extra: 0 }, { code: 'M', label: 'Medium', extra: 5000 }, { code: 'L', label: 'Large', extra: 10000 }], toppings: ['PEARL', 'GOLD_PEARL'], sugarLevels: [0, 30, 50, 100], iceLevels: [0, 30, 50, 100], status: 'AVAILABLE' },
  { id: uid(), name: 'Trà dâu tây', categorySlug: 'tra-trai-cay', description: 'Thơm dâu, ngọt thanh.', image: 'https://picsum.photos/seed/ttc3/600/600', basePrice: 41000, sizes: [{ code: 'M', label: 'Medium', extra: 0 }, { code: 'L', label: 'Large', extra: 8000 }], toppings: ['JELLY', 'FRUIT'], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], status: 'OUT_OF_STOCK' },
];

const EMPTY_FORM = { name: '', categorySlug: 'tra-sua', description: '', image: '', basePrice: '', sizes: [{ code: 'M', label: 'Medium', extra: 0 }], toppings: [], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], status: 'AVAILABLE' };

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
          <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
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
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition
          ${dragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 bg-gray-50'}`}
        style={{ minHeight: 120 }}
      >
        {value ? (
          <img src={value} alt="preview" className="h-24 w-auto object-contain rounded" />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16 9l-4-4-4 4M12 5v11" /></svg>
            <p className="text-xs text-gray-400">Kéo thả ảnh hoặc <span className="text-amber-600 font-medium">chọn file</span></p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
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
          <button type="button" onClick={() => onChange('')} className="text-red-400 hover:text-red-600 text-xs">Xoá</button>
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
    onChange(sizes.map((s) => s.code === code ? { ...s, extra: parseInt(val) || 0 } : s));
  };

  return (
    <div className="space-y-2">
      {SIZE_OPTIONS.map((opt) => {
        const active = sizes.find((s) => s.code === opt.code);
        return (
          <div key={opt.code} className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer w-28">
              <input type="checkbox" checked={!!active} onChange={() => toggle(opt)}
                className="accent-amber-500 w-4 h-4" />
              <span className={`text-sm font-medium ${active ? 'text-gray-800' : 'text-gray-400'}`}>{opt.code} – {opt.label}</span>
            </label>
            {active && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500 text-xs">Thêm:</span>
                <input
                  type="number"
                  value={active.extra}
                  onChange={(e) => setExtra(opt.code, e.target.value)}
                  className="w-24 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  min={0}
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
          {val}{unit}
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Xác nhận xoá</h3>
        <p className="text-sm text-gray-500 mb-6">
          Bạn có chắc muốn xoá sản phẩm <span className="font-semibold text-gray-800">"{product.name}"</span>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Huỷ
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Form Modal ────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product ? { ...product, toppings: [...product.toppings], sizes: product.sizes.map((s) => ({ ...s })), sugarLevels: [...product.sugarLevels], iceLevels: [...product.iceLevels] } : { ...EMPTY_FORM, toppings: [], sugarLevels: [0, 50, 100], iceLevels: [0, 50, 100], sizes: [{ code: 'M', label: 'Medium', extra: 0 }] });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleTopping = (code) => {
    set('toppings', form.toppings.includes(code) ? form.toppings.filter((c) => c !== code) : [...form.toppings, code]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!form.basePrice || isNaN(form.basePrice)) return;
    if (form.sizes.length === 0) return;
    onSave({ ...form, basePrice: parseInt(form.basePrice) });
  };

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4" onClick={handleBackdrop}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section: Basic Info */}
          <div>
            <SectionTitle>Thông tin cơ bản</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="sm:col-span-2">
                <Label>Tên sản phẩm <Required /></Label>
                <input required value={form.name} onChange={(e) => set('name', e.target.value)}
                  className="input w-full" placeholder="VD: Trà sữa trân châu..." />
              </div>
              <div>
                <Label>Danh mục</Label>
                <select value={form.categorySlug} onChange={(e) => set('categorySlug', e.target.value)} className="input w-full">
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Giá gốc (đ) <Required /></Label>
                <input required type="number" min={0} step={1000} value={form.basePrice} onChange={(e) => set('basePrice', e.target.value)}
                  className="input w-full" placeholder="35000" />
              </div>
              <div className="sm:col-span-2">
                <Label>Mô tả</Label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                  className="input w-full resize-none" rows={2} placeholder="Mô tả ngắn về sản phẩm..." />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input w-full">
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
            <p className="text-xs text-gray-400 mb-3">Chọn ít nhất 1 size. Giá "Thêm" sẽ cộng vào giá gốc.</p>
            <SizesEditor sizes={form.sizes} onChange={(v) => set('sizes', v)} />
            {form.sizes.length === 0 && <p className="text-xs text-red-500 mt-1">Cần chọn ít nhất 1 kích thước.</p>}
          </div>

          {/* Section: Toppings */}
          <div>
            <SectionTitle>Topping có sẵn</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {ALL_TOPPINGS.map((t) => {
                const active = form.toppings.includes(t.code);
                return (
                  <label key={t.code} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition text-xs
                    ${active ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                    <input type="checkbox" checked={active} onChange={() => toggleTopping(t.code)} className="accent-amber-500" />
                    <div>
                      <p className={`font-medium ${active ? 'text-amber-700' : 'text-gray-700'}`}>{t.name}</p>
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
                <LevelToggle options={SUGAR_OPTIONS} selected={form.sugarLevels} onChange={(v) => set('sugarLevels', v)} unit="%" />
              </div>
            </div>
            <div>
              <SectionTitle>Mức đá (%)</SectionTitle>
              <div className="mt-3">
                <LevelToggle options={ICE_OPTIONS} selected={form.iceLevels} onChange={(v) => set('iceLevels', v)} unit="%" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Huỷ
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition shadow">
              {product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Small helpers
function SectionTitle({ children }) {
  return <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2 after:flex-1 after:h-px after:bg-gray-100 after:ml-2">{children}</h3>;
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
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, add: toast, remove: removeToast } = useToast();

  // ── Derived: filtered and paginated ──────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.categorySlug === catFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, catFilter, statusFilter]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => { setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setShowModal(true); };

  const handleSave = (data) => {
    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...data, id: editProduct.id } : p));
      toast('Cập nhật sản phẩm thành công!');
    } else {
      setProducts((prev) => [{ ...data, id: uid() }, ...prev]);
      toast('Thêm sản phẩm thành công!');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast(`Đã xoá "${deleteTarget.name}"`, 'error');
    setDeleteTarget(null);
  };

  const toggleStatus = (id) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE' } : p));
    const p = products.find((pr) => pr.id === id);
    toast(`Đã ${p.status === 'AVAILABLE' ? 'ẩn' : 'hiện'} "${p.name}"`, 'info');
  };

  const catName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <GlobalStyles />
      <Toast toasts={toasts} remove={removeToast} />

      <div className="min-h-screen bg-gray-100 pt-16 flex">
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 bg-gray-900 text-white shrink-0 fixed top-16 bottom-0 left-0 z-30">
          <div className="px-4 py-5 border-b border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Quản lý</p>
            <p className="text-lg font-bold mt-0.5">Tea Mango</p>
          </div>
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto text-sm">
            {[
              { label: 'Bảng điều khiển', icon: '▦' },
              { label: 'Sản phẩm', icon: '🧋', active: true },
              { label: 'Danh mục', icon: '📂' },
              { label: 'Đơn hàng', icon: '🧾' },
              { label: 'Khách hàng', icon: '👥' },
              { label: 'Thống kê', icon: '📊' },
              { label: 'Cài đặt', icon: '⚙️' },
            ].map(({ label, icon, active }) => (
              <button key={label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition
                ${active ? 'bg-amber-500 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-56 p-5 md:p-8 overflow-x-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
              <p className="text-sm text-gray-500 mt-0.5">Tổng cộng {products.length} sản phẩm</p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Thêm sản phẩm
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Tổng sản phẩm', val: products.length, color: 'bg-blue-50 text-blue-700', icon: '🧋' },
              { label: 'Còn hàng', val: products.filter((p) => p.status === 'AVAILABLE').length, color: 'bg-emerald-50 text-emerald-700', icon: '✅' },
              { label: 'Hết hàng', val: products.filter((p) => p.status === 'OUT_OF_STOCK').length, color: 'bg-red-50 text-red-600', icon: '❌' },
              { label: 'Danh mục', val: CATEGORIES.length, color: 'bg-amber-50 text-amber-700', icon: '📂' },
            ].map(({ label, val, color, icon }) => (
              <div key={label} className={`rounded-xl p-4 ${color} flex items-center gap-3`}>
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xl font-bold leading-tight">{val}</p>
                  <p className="text-xs opacity-80">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>
            {/* Category */}
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white">
              <option value="all">Tất cả danh mục</option>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            {/* Status */}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white">
              <option value="all">Tất cả trạng thái</option>
              <option value="AVAILABLE">Còn hàng</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600 w-16">Ảnh</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Tên sản phẩm</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Danh mục</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Sizes</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Giá gốc</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">🔍</span>
                          <span>Không tìm thấy sản phẩm nào.</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition">
                      <td className="px-4 py-3">
                        <img src={p.image || 'https://via.placeholder.com/60'} alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 leading-tight">{p.name}</p>
                        {p.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>}
                        {p.toppings.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.toppings.slice(0, 3).map((code) => (
                              <span key={code} className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                                {ALL_TOPPINGS.find((t) => t.code === code)?.name ?? code}
                              </span>
                            ))}
                            {p.toppings.length > 3 && <span className="text-xs text-gray-400">+{p.toppings.length - 3}</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{catName(p.categorySlug)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {p.sizes.map((s) => (
                            <span key={s.code} className="px-1.5 py-0.5 border border-gray-200 rounded text-xs text-gray-600">
                              {s.code}{s.extra > 0 ? ` +${(s.extra / 1000).toFixed(0)}k` : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                        {p.basePrice.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition
                            ${p.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {p.status === 'AVAILABLE' ? 'Còn hàng' : 'Hết hàng'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-amber-100 hover:text-amber-700 transition" title="Chỉnh sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600 transition" title="Xoá">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>Hiển thị {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} trong tổng số {filtered.length} sản phẩm</p>
            <div className="flex items-center gap-1">
              <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>‹</PagBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PagBtn key={n} active={n === safePage} onClick={() => setPage(n)}>{n}</PagBtn>
              ))}
              <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>›</PagBtn>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showModal && <ProductModal product={editProduct} onSave={handleSave} onClose={() => setShowModal(false)} />}
      {deleteTarget && <DeleteModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
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
