import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons for Vite/webpack builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// ─── Data ────────────────────────────────────────────────────────────────────
const storeData = [
    {
        province: 'Bạc Liêu',
        districts: [
            'Tất cả',
            'Thành phố Bạc Liêu',
            'Huyện Hồng Dân',
            'Huyện Phước Long'
        ],
        stores: [
            {
                id: 1,
                name: 'TEA MANGO NGÔ GIA H390',
                address: '84 Cao Văn Lầu, Phường 2, Bạc Liêu, Việt Nam',
                phone: '0943 907 490',
                district: 'Thành phố Bạc Liêu',
                lat: 9.2952,
                lng: 105.7237
            },
            {
                id: 2,
                name: 'TEA MANGO NGÔ GIA H211',
                address: '174 Trần Phú, Phường 7, Bạc Liêu, Việt Nam',
                phone: '0342 995 489',
                district: 'Thành phố Bạc Liêu',
                lat: 9.2862,
                lng: 105.7248
            },
            {
                id: 3,
                name: 'TEA MANGO HỒNG DÂN',
                address: '25 Hùng Vương, TT. Ngan Dừa, Hồng Dân, Bạc Liêu',
                phone: '0912 345 678',
                district: 'Huyện Hồng Dân',
                lat: 9.4421,
                lng: 105.5863
            }
        ],
        center: [9.2941, 105.7243],
        zoom: 14
    },
    {
        province: 'Cần Thơ',
        districts: [
            'Tất cả',
            'Quận Ninh Kiều',
            'Quận Bình Thủy',
            'Quận Cái Răng'
        ],
        stores: [
            {
                id: 4,
                name: 'TEA MANGO NINH KIỀU',
                address: '12 Hai Bà Trưng, Quận Ninh Kiều, Cần Thơ',
                phone: '0901 234 567',
                district: 'Quận Ninh Kiều',
                lat: 10.0358,
                lng: 105.7874
            },
            {
                id: 5,
                name: 'TEA MANGO BÌNH THỦY',
                address: '56 Lê Hồng Phong, Quận Bình Thủy, Cần Thơ',
                phone: '0902 345 678',
                district: 'Quận Bình Thủy',
                lat: 10.0639,
                lng: 105.748
            },
            {
                id: 6,
                name: 'TEA MANGO CÁI RĂNG',
                address: '88 Nguyễn Văn Cừ, Quận Cái Răng, Cần Thơ',
                phone: '0903 456 789',
                district: 'Quận Cái Răng',
                lat: 10.0081,
                lng: 105.7682
            }
        ],
        center: [10.0452, 105.7469],
        zoom: 13
    },
    {
        province: 'Hà Nội',
        districts: [
            'Tất cả',
            'Quận Hoàn Kiếm',
            'Quận Đống Đa',
            'Quận Cầu Giấy'
        ],
        stores: [
            {
                id: 7,
                name: 'TEA MANGO HOÀN KIẾM',
                address: '36 Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
                phone: '0241 234 567',
                district: 'Quận Hoàn Kiếm',
                lat: 21.0245,
                lng: 105.8412
            },
            {
                id: 8,
                name: 'TEA MANGO ĐỐNG ĐA',
                address: '102 Nguyễn Lương Bằng, Đống Đa, Hà Nội',
                phone: '0242 345 678',
                district: 'Quận Đống Đa',
                lat: 21.0213,
                lng: 105.8366
            },
            {
                id: 9,
                name: 'TEA MANGO CẦU GIẤY',
                address: '78 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
                phone: '0243 456 789',
                district: 'Quận Cầu Giấy',
                lat: 21.0332,
                lng: 105.7945
            }
        ],
        center: [21.0285, 105.8542],
        zoom: 13
    },
    {
        province: 'TP. Hồ Chí Minh',
        districts: ['Tất cả', 'Quận 1', 'Quận 3', 'Quận Bình Thạnh'],
        stores: [
            {
                id: 10,
                name: 'TEA MANGO QUẬN 1',
                address: '45 Nguyễn Huệ, Quận 1, TP. HCM',
                phone: '0281 234 567',
                district: 'Quận 1',
                lat: 10.7769,
                lng: 106.7009
            },
            {
                id: 11,
                name: 'TEA MANGO QUẬN 3',
                address: '23 Võ Văn Tần, Quận 3, TP. HCM',
                phone: '0282 345 678',
                district: 'Quận 3',
                lat: 10.7724,
                lng: 106.6887
            },
            {
                id: 12,
                name: 'TEA MANGO BÌNH THẠNH',
                address: '98 Bạch Đằng, Bình Thạnh, TP. HCM',
                phone: '0283 456 789',
                district: 'Quận Bình Thạnh',
                lat: 10.8101,
                lng: 106.7135
            }
        ],
        center: [10.8231, 106.6297],
        zoom: 13
    },
    {
        province: 'Đà Nẵng',
        districts: [
            'Tất cả',
            'Quận Hải Châu',
            'Quận Thanh Khê',
            'Quận Sơn Trà'
        ],
        stores: [
            {
                id: 13,
                name: 'TEA MANGO HẢI CHÂU',
                address: '10 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
                phone: '0511 234 567',
                district: 'Quận Hải Châu',
                lat: 16.0668,
                lng: 108.2236
            },
            {
                id: 14,
                name: 'TEA MANGO THANH KHÊ',
                address: '55 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
                phone: '0512 345 678',
                district: 'Quận Thanh Khê',
                lat: 16.0721,
                lng: 108.2025
            },
            {
                id: 15,
                name: 'TEA MANGO SƠN TRÀ',
                address: '33 Phạm Văn Đồng, Sơn Trà, Đà Nẵng',
                phone: '0513 456 789',
                district: 'Quận Sơn Trà',
                lat: 16.0748,
                lng: 108.2425
            }
        ],
        center: [16.0544, 108.2022],
        zoom: 13
    }
];

// ─── Map re-center helper ─────────────────────────────────────────────────────
function RecenterMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Location() {
    const [selectedProvince, setSelectedProvince] = useState('Bạc Liêu');
    const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
    const [search, setSearch] = useState('');

    const provinceData = useMemo(
        () => storeData.find((p) => p.province === selectedProvince),
        [selectedProvince]
    );

    const filteredStores = useMemo(() => {
        let list = provinceData.stores;
        if (selectedDistrict !== 'Tất cả') {
            list = list.filter((s) => s.district === selectedDistrict);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.address.toLowerCase().includes(q)
            );
        }
        return list;
    }, [provinceData, selectedDistrict, search]);

    // Map center: if district selected, center on first matching store; else province center
    const mapCenter = useMemo(() => {
        if (filteredStores.length > 0) {
            return [filteredStores[0].lat, filteredStores[0].lng];
        }
        return provinceData.center;
    }, [filteredStores, provinceData]);

    const mapZoom = selectedDistrict !== 'Tất cả' ? 15 : provinceData.zoom;

    const handleProvinceChange = (e) => {
        setSelectedProvince(e.target.value);
        setSelectedDistrict('Tất cả');
        setSearch('');
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-12">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Hệ Thống Cửa Hàng</h1>
                    <p className="text-slate-500 font-medium">Tìm kiếm địa chỉ Tea Mango gần bạn nhất</p>
                </div>

                <div
                    className="flex flex-col lg:flex-row bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50"
                    style={{ height: '700px', minHeight: '600px' }}
                >
                    {/* ── Left Panel ─────────────────────────────────────────────── */}
                    <div className="w-full lg:w-80 shrink-0 flex flex-col bg-white" style={{ borderRight: '1px solid #f1f5f9' }}>
                        {/* Controls */}
                        <div style={{ backgroundColor: '#1e3a8a', padding: '12px', borderRadius: '8px 0 0 0' }}>
                            {/* Search */}
                            <div style={{ position: 'relative', marginBottom: 8 }}>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nhập từ khoá tìm kiếm theo tên"
                                    style={{ width: '100%', padding: '8px 36px 8px 10px', fontSize: 14, border: '1px solid #d1d5db', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                                />
                                <button style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                    </svg>
                                </button>
                            </div>
                            {/* Dropdowns */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <select
                                    value={selectedProvince}
                                    onChange={handleProvinceChange}
                                    style={{ flex: 1, padding: '8px 6px', fontSize: 13, border: '1px solid #d1d5db', background: '#fff', outline: 'none' }}
                                >
                                    {storeData.map((p) => (
                                        <option key={p.province} value={p.province}>
                                            {p.province}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    style={{ flex: 1, padding: '8px 6px', fontSize: 13, border: '1px solid #d1d5db', background: '#fff', outline: 'none' }}
                                >
                                    {provinceData.districts.map((d) => (
                                        <option key={d} value={d}>
                                            {d === 'Tất cả' ? 'Chọn Quận/Huyện' : d}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Store List */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f9fafb' }}>
                            {filteredStores.length === 0 ? (
                                <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 32 }}>
                                    Không tìm thấy cửa hàng.
                                </p>
                            ) : (
                                filteredStores.map((store) => (
                                    <div key={store.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16 }}>
                                        <p style={{ fontWeight: 700, color: '#111827', fontSize: 13, marginBottom: 6 }}>{store.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#4b5563', fontSize: 12, marginBottom: 4 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 13, height: 13, marginTop: 2, flexShrink: 0, color: '#1d4ed8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{store.address}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4b5563', fontSize: 12, marginBottom: 8 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 13, height: 13, flexShrink: 0, color: '#1d4ed8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.05L7.5 9.5a16 16 0 006.98 6.98l1.47-1.62a1 1 0 011.05-.23l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2C9.163 21 3 14.837 3 7V5z" />
                                            </svg>
                                            <span>{store.phone}</span>
                                        </div>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#2563eb', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 13, height: 13 }} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                            Chỉ đường
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* ── Map ────────────────────────────────────────────────────── */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <MapContainer
                            center={provinceData.center}
                            zoom={provinceData.zoom}
                            style={{ width: '100%', height: '100%', zIndex: 0 }}
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <RecenterMap center={mapCenter} zoom={mapZoom} />
                            {filteredStores.map((store) => (
                                <Marker key={store.id} position={[store.lat, store.lng]}>
                                    <Popup>
                                        <strong>{store.name}</strong>
                                        <br />
                                        {store.address}
                                        <br />
                                        {store.phone}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Floating Social Buttons */}
                        <div style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Phone', bg: '#1d4ed8', icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.05L7.5 9.5a16 16 0 006.98 6.98l1.47-1.62a1 1 0 011.05-.23l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2C9.163 21 3 14.837 3 7V5z" /></svg> },
                                { label: 'Zalo', bg: '#0284c7', icon: <span style={{ fontSize: 11, fontWeight: 700 }}>Zalo</span> },
                                { label: 'Facebook', bg: '#2563eb', icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg> },
                                { label: 'YouTube', bg: '#dc2626', icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg> },
                                { label: 'TikTok', bg: '#000', icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" /></svg> }
                            ].map(({ label, bg, icon }) => (
                                <button key={label} title={label} style={{ background: bg, color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
