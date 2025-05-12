"use client";
import React, { useRef, useState, useEffect } from 'react';
import { LuHeart, LuMapPin, LuGauge, LuPlugZap } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper as SwiperType } from 'swiper/types';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
interface Bike {
  id: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  image: string | null;
  make: string;
  model: string;
  year: number;
  engine_capacity: string;
  kms_driven: string;
  condition: string;
}

const Bikes = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showFullCard, setShowFullCard] = useState<boolean>(false);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/bikes');
        
        if (!response.ok) throw new Error('Failed to fetch bikes');
        const data = await response.json();
        
        const mappedData = data.map((bike: any) => ({
          ...bike,
          image: bike.images?.[0]?.url || '/images/placeholder.png', // Use first image or a placeholder
        }));
        console.log(mappedData);
        setBikes(mappedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  const toggleLike = (e: React.MouseEvent<SVGElement>) => {
    const target = e.currentTarget;
    target.classList.toggle('liked');
  };

  const handleSlideClick = () => {
    setShowFullCard(!showFullCard);
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const formatPrice = (price: string) => {
    return `RS ${parseFloat(price).toLocaleString()}`;
  };

  if (loading) {
    return <div className="text-center py-5">Loading bikes...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid my-3">
      <h1>Bikes for Sale</h1>
      <div className="position-relative">
        <button className="nav-button prev" onClick={() => swiperRef.current?.slidePrev()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView="auto"
          navigation={{
            prevEl: '.prev',
            nextEl: '.next',
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: showFullCard ? 5 : 4.5 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {bikes.map((bike) => (
            <SwiperSlide key={bike.id} onClick={handleSlideClick} style={{ width: '240px' }}>
               <Link href={`/postDetails/bikes/${bike.id}`} passHref legacyBehavior>
              <div className="card product-card">
                <div className="image-container">
                  <Image 
                    src={bike.image || '/images/placeholder.png'}
                    alt={bike.title}
                    width={240}
                    height={180}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="card-body">
                  <div className="price-container">
                    <h6 className="price">{formatPrice(bike.price)}</h6>
                    <LuHeart className="heart-icon" onClick={toggleLike} />
                  </div>
                  <span className="product-title">{bike.title}</span>
                  <div className="product-status">
                    <div className="info-icons">
                      <LuGauge /> <span>{bike.kms_driven || '0'} km</span>
                    </div>
                    <div className="info-icons mobile-label">
                      <LuPlugZap /> <span>{bike.engine_capacity || 'N/A'} cc</span>
                    </div>
                  </div>
                  <div className="footer-info">
                    <div className="address">
                      <LuMapPin /> <span>{bike.location}</span>
                    </div>
                    <p className="time-ago">{bike.posted_at}</p>
                  </div>
                </div>
              </div>
               </Link>
            </SwiperSlide>
          ))}
          
        </Swiper>
        <button className="nav-button next" onClick={() => swiperRef.current?.slideNext()}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default Bikes;
