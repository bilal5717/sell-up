'use client';
import React, { useRef, useState, useEffect } from 'react';
import { LuHeart, LuChartArea, LuFactory, LuMapPin, LuHouse, LuWheat } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper as SwiperType } from 'swiper/types';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

interface Land {
  id: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  images: { url: string }[];
  property_sale_detail?: {
    area?: string;
    area_unit?: string;
    land_type?: string;
  };
}

type LandIconMapping = {
  [key: string]: React.ComponentType;
  'Industrial': React.ComponentType;
  'Residential': React.ComponentType;
  'Agricultural': React.ComponentType;
  'Commercial': React.ComponentType;
  'Commercial Plots': React.ComponentType;
};

const LandsAndPlots = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showFullCard, setShowFullCard] = useState<boolean>(false);
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const iconMapping: LandIconMapping = {
    'Industrial': LuFactory,
    'Residential': LuHouse,
    'Agricultural': LuWheat,
    'Commercial': LuFactory,
    'Commercial Plots': LuFactory,
  };

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/lands');
        if (!response.ok) throw new Error('Failed to fetch lands');
        const data = await response.json();
        setLands(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
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

  const formatArea = (area?: string, unit?: string) => {
    if (!area || !unit) return 'N/A';
    return `${area} ${unit}`;
  };

  const getLandType = (land: Land): keyof LandIconMapping => {
    return (land.property_sale_detail?.land_type as keyof LandIconMapping) || 'Commercial';
  };

  if (loading) {
    return <div className="text-center py-5">Loading lands and plots...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid my-3">
      <h1>Lands & Plots for Sale</h1>
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
          {lands.map((land) => {
            const landType = getLandType(land);
            const IconComponent = iconMapping[landType] || LuFactory;
            
            return (
              <SwiperSlide key={land.id} onClick={handleSlideClick} style={{ width: '240px' }}>
                <div className="card product-card">
                  <div className="image-container">
                    {land.images?.[0]?.url ? (
                      <Image
                        src={land.images[0].url}
                        alt={land.title}
                        width={240}
                        height={180}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="price-container">
                      <h6 className="price">{formatPrice(land.price)}</h6>
                      <LuHeart className="heart-icon" onClick={toggleLike} />
                    </div>
                    <span className='product-title'>{land.title}</span>
                    <div className="product-status">
                      <div className="info-icons">
                        <LuChartArea /> <span>
                          {formatArea(land.property_sale_detail?.area, land.property_sale_detail?.area_unit)}
                        </span>
                      </div>
                      <div className="info-icons mobile-label">
                        <IconComponent /> <span>{landType}</span>
                      </div>
                    </div>
                    <div className="footer-info">
                      <div className="address">
                        <LuMapPin /> <span>{land.location}</span>
                      </div>
                      <p className="time-ago">{land.posted_at}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className="nav-button next" onClick={() => swiperRef.current?.slideNext()}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default LandsAndPlots;
