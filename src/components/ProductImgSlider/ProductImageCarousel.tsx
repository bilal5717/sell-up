'use client';

import { Carousel } from "react-responsive-carousel";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuHeart, LuShare2 } from "react-icons/lu";
import styled from "styled-components";
import "react-responsive-carousel/lib/styles/carousel.min.css";
interface ProductImageCarouselProps {
  // You can define props here if needed
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const handleVideoClick = () => {
        setIsVideoPlaying(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsVideoPlaying(false);
        setIsModalOpen(false);
        setZoomedImage(null);
    };

    const toggleLike = () => setIsLiked(!isLiked);

    const images: string[] = [
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172224/1.png",
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172225/2.png",
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172226/3.png",
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172227/4.png",
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172229/5.png",
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172229/5.png",
        "https://media.geeksforgeeks.org/wp-content/uploads/20211213172229/5.png"
    ];

    const handleImageZoom = (image: string) => {
        setZoomedImage(image);
        setIsModalOpen(true);
    };

    return (
        <CarouselContainer>
            {isModalOpen && (
                <ModalOverlay onClick={closeModal}>
                    <ModalCloseButton onClick={closeModal}>✖</ModalCloseButton>
                    {isVideoPlaying ? (
                        <ModalVideo
                            src="https://www.w3schools.com/html/mov_bbb.mp4"
                            controls
                            autoPlay
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <ModalImage
                            src={zoomedImage || ''}
                            alt="Zoomed"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </ModalOverlay>
            )}

            <TopRightIcons>
                <FavIcon onClick={toggleLike} isLiked={isLiked}>
                    <LuHeart />
                </FavIcon>
                <FavIcon>
                    <LuShare2 />
                </FavIcon>
            </TopRightIcons>

            <StyledCarousel
                renderArrowPrev={(onClickHandler, hasPrev) =>
                    hasPrev && (
                        <CarouselArrow className="left" onClick={onClickHandler}>
                            <LuChevronLeft />
                        </CarouselArrow>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext) =>
                    hasNext && (
                        <CarouselArrow className="right" onClick={onClickHandler}>
                            <LuChevronRight />
                        </CarouselArrow>
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
                <div>
                    <VideoThumbnail
                        src="https://img.youtube.com/vi/YE7VzlLtp-4/maxresdefault.jpg"
                        alt="video thumbnail"
                        onClick={handleVideoClick}
                    />
                    <VideoPlayButton onClick={handleVideoClick}>▶️</VideoPlayButton>
                </div>
                {images.map((image, index) => (
                    <div key={index}>
                        <CarouselImage
                            src={image}
                            alt={`image${index + 1}`}
                            onClick={() => handleImageZoom(image)}
                        />
                    </div>
                ))}
            </StyledCarousel>
        </CarouselContainer>
    );
};

// Styled components
const CarouselContainer = styled.div`
    position: relative;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: #fff;
    color: #333;
    border: none;
    padding: 10px 15px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    z-index: 10000;
`;

const ModalContent = styled.div`
    width: 80%;
    max-height: 80%;
    object-fit: contain;
    cursor: pointer;
    border-radius: 9px;
`;

const ModalImage = styled.img`
    ${ModalContent}
`;

const ModalVideo = styled.video`
    ${ModalContent}
`;

const TopRightIcons = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    display: flex;
    gap: 10px;
`;

const FavIcon = styled.div<{ isLiked?: boolean }>`
    background-color: #333;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
        font-size: 20px;
        color: ${props => props.isLiked ? '#e0245e' : '#fff'};
        fill: ${props => props.isLiked ? '#e0245e' : 'none'};
    }
`;

const CarouselArrow = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #eaeaea;
    color: black;
    border: none;
    padding: 15px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 24px;
    cursor: pointer;
    z-index: 2;

    &.left {
        left: 10px;
    }

    &.right {
        right: 10px;
    }
`;

const VideoThumbnail = styled.img`
    cursor: pointer;
    width: 100%;
    position: relative;
    border-radius: 9px;
`;

const VideoPlayButton = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border: none;
    padding: 15px 30px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
`;

const CarouselImage = styled.img`
    cursor: zoom-in;
    border-radius: 9px;
    width: 100%;
`;

const StyledCarousel = styled(Carousel)`
    .thumbs-wrapper {
        padding: 0;
        margin: 0px !important;
    }

    .thumb {
        height: 95px !important;
        width: 100px !important;
        padding: 0;

        img {
            height: 100%;
            border-radius: 9px;
        }
    }

    .thumbs {
        padding: 0;
        margin-top: 10px;
        margin-bottom: 0;
    }

    .thumb.selected, .thumb:hover {
        border: 3px solid #333 !important;
        border-radius: 13px !important;
    }

    img {
        border-radius: 9px;
    }
`;

export default ProductImageCarousel;