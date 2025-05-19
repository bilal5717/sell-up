'use client';
import React, { useRef, useState, useEffect } from 'react';
import { LuHeart, LuBed, LuBath, LuChartArea, LuMapPin } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper as SwiperType } from 'swiper/types';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/cardstyles.module.css';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  images: { url: string }[];
  property_sale_detail: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    area_unit: string;
    features: string[];
  };
}

const Houses = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showFullCard, setShowFullCard] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/properties');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
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

  const formatArea = (area: number, unit: string) => {
    return `${area} ${unit}`;
  };

  if (loading) {
    return <div className="text-center py-5">Loading properties...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid my-3">
      <h1>Houses for Sale</h1>
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
          {properties.map((property) => (
            <SwiperSlide key={property.id} onClick={handleSlideClick} style={{ width: '240px' }}>
              <div className="card product-card">
                <div className="image-container">
                  <Image
                    src={property.images[0]?.url || '/images/placeholder.png'}
                    alt={property.title}
                    width={240}
                    height={180}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="card-body">
                  <div className="price-container">
                    <h6 className="price">{formatPrice(property.price)}</h6>
                    <LuHeart className="heart-icon" onClick={toggleLike} />
                  </div>
                  <span className="product-title">{property.title}</span>
                  <div className="product-status">
                    <div className="info-icons">
                      <LuBed /> <span>{property.property_sale_detail.bedrooms || 0} Beds</span>
                    </div>
                    <div className="info-icons">
                      <LuBath /> <span>{property.property_sale_detail.bathrooms || 0} Baths</span>
                    </div>
                    <div className="info-icons">
                      <LuChartArea /> <span>
                        {formatArea(
                          property.property_sale_detail.area || 0,
                          property.property_sale_detail.area_unit || 'Sq Ft'
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="footer-info">
                    <div className="address">
                      <LuMapPin /> <span>{property.location}</span>
                    </div>
                    <p className="time-ago">{property.posted_at}</p>
                  </div>
                </div>
              </div>
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

export default Houses;
