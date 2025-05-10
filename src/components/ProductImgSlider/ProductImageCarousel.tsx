'use client';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { LuChevronLeft, LuChevronRight, LuHeart, LuShare2 } from "react-icons/lu";
import 'bootstrap/dist/css/bootstrap.min.css';

interface MediaItem {
  url: string;
  type: string;
}

const ProductImageCarousel = ({ media }: { media: MediaItem[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [zoomedMedia, setZoomedMedia] = useState<MediaItem | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        setZoomedMedia(null);
    };

    const toggleLike = () => setIsLiked(!isLiked);

    useEffect(() => {
        if (zoomedMedia?.type === 'video' && videoRef.current) {
            const player = videojs(videoRef.current, {
                controls: true,
                autoplay: false,
                preload: "auto",
                fluid: true,
                responsive: true,
                controlBar: {
                    volumePanel: { inline: false }
                },
                bigPlayButton: false
            });

            player.on("click", () => {
                if (player.paused()) {
                    player.play();
                    setIsPlaying(true);
                } else {
                    player.pause();
                    setIsPlaying(false);
                }
            });

            return () => {
                player.dispose();
            };
        }
    }, [zoomedMedia]);

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <div style={{ position: "relative" }}>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <button className="modal-close-btn" onClick={closeModal}>✖</button>
                    {zoomedMedia?.type === 'video' ? (
                        <div data-vjs-player>
                            <video
                                ref={videoRef}
                                id="video-player"
                                className="video-js vjs-default-skin vjs-big-play-centered"
                                controls
                                preload="auto"
                                poster="/images/video-placeholder.png"
                                style={{ width: "80%", height: "auto" }}
                                onClick={handleVideoClick}
                            >
                                <source src={zoomedMedia?.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
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
                        {item.type === 'video' && item.url ? (
                            <div style={{ position: 'relative' }}>
                                <video
                                    ref={videoRef}
                                    className="video-js vjs-default-skin vjs-big-play-centered"
                                    controls
                                    preload="auto"
                                    style={{ width: '100%', height: 'auto' }}
                                    poster="/images/video-placeholder.png"
                                    onClick={handleVideoClick}
                                >
                                    <source src={item.url} type="video/mp4" />
                                </video>
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
                                onClick={() => {
                                    setZoomedMedia(item);
                                    setIsModalOpen(true);
                                }}
                            />
                        )}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ProductImageCarousel;
