import React from 'react';

export default function NewsDetail({ item, onClose }) {
    if (!item) return null;

    return (
        <div className="news-modal-backdrop" onClick={onClose}>
            <div className="news-modal" onClick={(e) => e.stopPropagation()}>
                <button className="news-modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <div className="news-modal-hero">
                    <img src={item.image} alt={item.title} />
                    <div className="news-modal-hero-overlay" />
                    <div className="news-modal-hero-text">
                        <h2>{item.title}</h2>
                        <span className="news-modal-date">{item.date}</span>
                    </div>
                </div>

                <div className="news-modal-body">
                    <p className="news-modal-desc">{item.desc}</p>

                    <div className="news-modal-content">{item.content}</div>

                    <div className="news-modal-actions">
                        <button onClick={onClose} className="btn-amber">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
