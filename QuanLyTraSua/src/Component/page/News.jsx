import React, { useEffect, useState } from 'react';
import '../../css/news.css';
import { newsData } from '../../../backend/data/newsData';
import NewsDetail from './NewsDetail';

function News() {
    const featuredList = newsData.filter((n) => n.featured || n.id <= 3);
    const others = newsData.slice(3);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [featuredList.length]);

    const current = featuredList[index];
    const [selected, setSelected] = useState(null);

    const openDetail = (item) => setSelected(item);
    const closeDetail = () => setSelected(null);

    return (
        <div className="news-container">
            {/* Banner */}
            <div className="news-banner">
                <h1>Tin Tức TeaMango</h1>
                <p>Cập nhật khuyến mãi và sản phẩm mới</p>
            </div>

            {/* Slider tin nổi bật */}
            <div className="featured-news" onClick={() => openDetail(current)} style={{ cursor: 'pointer' }}>
                <div className="featured-image">
                    <img src={current.image} />
                    <div className="overlay"></div>
                </div>

                <div className="featured-content">
                    <h2>{current.title}</h2>
                    <p>{current.desc}</p>
                    <span>{current.date}</span>
                </div>
            </div>

            {/* Grid tin */}
            <div className="news-grid">
                {others.map((item) => (
                    <div
                        key={item.id}
                        className="news-card"
                        onClick={() => openDetail(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="image-box">
                            <img src={item.image} />
                        </div>

                        <div className="news-info">
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <span>{item.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {selected && <NewsDetail item={selected} onClose={closeDetail} />}
        </div>
    );
}
export default News;
