'use client';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuHeart, LuShare2 } from "react-icons/lu";
import 'bootstrap/dist/css/bootstrap.min.css';

interface MediaItem {
  url: string;
  type: string;
}

const ProductImageCarousel = ({ media }: { media: MediaItem[] }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [zoomedMedia, setZoomedMedia] = useState<MediaItem | null>(null);

    const handleVideoClick = (item: MediaItem) => {
        if (item.type === 'video') {
            setZoomedMedia(item);
            setIsVideoPlaying(true);
            setIsModalOpen(true);
        }
    };

    const handleImageClick = (item: MediaItem) => {
        if (item.type === 'image') {
            setZoomedMedia(item);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsVideoPlaying(false);
        setIsModalOpen(false);
        setZoomedMedia(null);
    };

    const toggleLike = () => setIsLiked(!isLiked);

    return (
        <div style={{ position: "relative" }}>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <button className="modal-close-btn" onClick={closeModal}>✖</button>
                    {isVideoPlaying ? (
                        <video
                            src={zoomedMedia?.url}
                            controls
                            autoPlay
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <img
                            src={zoomedMedia?.url}
                            alt="Zoomed"
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}

            <div className="top-right-icons">
                <div className="fav-icon">
                    <LuHeart
                        onClick={toggleLike}
                        className={isLiked ? "liked" : ""}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="fav-icon">
                    <LuShare2 style={{ cursor: 'pointer' }} />
                </div>
            </div>

            <Carousel
                renderArrowPrev={(onClickHandler, hasPrev) =>
                    hasPrev && (
                        <button 
                            onClick={onClickHandler} 
                            className="carousel-arrow left"
                            style={{
                                position: 'absolute',
                                left: 15,
                                zIndex: 2,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <LuChevronLeft />
                        </button>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext) =>
                    hasNext && (
                        <button 
                            onClick={onClickHandler} 
                            className="carousel-arrow right"
                            style={{
                                position: 'absolute',
                                right: 15,
                                zIndex: 2,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <LuChevronRight />
                        </button>
                    )
                }
                showIndicators={false}
                showThumbs={true}
                showStatus={false}
                thumbWidth={100}
                emulateTouch={true}
                swipeScrollTolerance={5}
                selectedItem={0}
            >
                {media.map((item, index) => (
                    <div key={index}>
                        {item.type === 'video' ? (
                            <div style={{ position: 'relative' }}>
                                <video
                                    src={item.url}
                                    controls={false}
                                    style={{ width: '100%', height: 'auto' }}
                                    poster="/images/video-placeholder.png"
                                    onClick={() => handleVideoClick(item)}
                                />
                                <button 
                                    onClick={() => handleVideoClick(item)} 
                                    className="video-play-btn"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0,0,0,0.5)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 60,
                                        height: 60,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: 24
                                    }}
                                >
                                    ▶️
                                </button>
                            </div>
                        ) : (
                            <img
                                src={item.url}
                                alt={`media-${index}`}
                                className="carousel-image"
                                style={{ 
                                    width: '100%', 
                                    height: 'auto',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleImageClick(item)}
                            />
                        )}
                    </div>
                ))}
            </Carousel>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    max-width: 90%;
                    max-height: 90%;
                }
                .modal-close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 1001;
                }
                .top-right-icons {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    z-index: 2;
                    display: flex;
                    gap: 10px;
                }
                .fav-icon {
                    background: rgba(255,255,255,0.7);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .liked {
                    color: red;
                    fill: red;
                }
            `}</style>
        </div>
    );
};

export default ProductImageCarousel;