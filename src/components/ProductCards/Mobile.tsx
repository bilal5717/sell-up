'use client';
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuHeart, LuTag, LuMapPin, LuWifi, LuWifiOff } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/cardstyles.module.css';

interface Mobile {
  id: number;
  images: {
    url: string;
    is_featured?: boolean;
    order?: number;
  }[];
  price: string;
  title: string;
  condition: string;
  location: string;
  posted_at: string;
  pta_status: string;
  brand: string;
  model: string;
}

const Mobiles = () => {
  const mobileSwiperRef = useRef<SwiperType | null>(null);
  const [mobiles, setMobiles] = useState<Mobile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/mobiles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setMobiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMobiles();
  }, []);

  const toggleLike = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    const target = e.target as SVGElement;
    target.classList.toggle('liked');
  };

  if (loading) {
    return <div className="container-fluid my-3">Loading...</div>;
  }

  if (error) {
    return <div className="container-fluid my-3">Error: {error}</div>;
  }

  if (mobiles.length === 0) {
    return <div className="container-fluid my-3">No mobile phones found</div>;
  }

  return (
    <div className="container-fluid my-3">
      <h1>Mobile Phones for Sale</h1>
      <div className="position-relative">
        <button className="nav-button mobile-prev" onClick={() => mobileSwiperRef.current?.slidePrev()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <Swiper
          modules={[Navigation]}
          spaceBetween={130}   
          slidesPerView="auto"
          navigation={{ 
            prevEl: '.mobile-prev', 
            nextEl: '.mobile-next' 
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          onSwiper={(swiper) => (mobileSwiperRef.current = swiper)}
        >
          {mobiles.map((mobile) => (
            <SwiperSlide key={mobile.id} style={{ width: '240px', marginRight: '10px' }} className="gap-3">
              <Link href={`/postDetails/${mobile.id}`} passHref legacyBehavior>
                <div className="card product-card">
                  <div className="image-container">
                    {mobile.images && mobile.images.length > 0 ? (
                      <Image
                        src={mobile.images[0].url}
                        alt={mobile.title}
                        width={240}
                        height={180}
                        className="card-img-top object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="price-container">
                      <h6 className="price">Rs. {mobile.price}</h6>
                      <LuHeart className="heart-icon" onClick={toggleLike} />
                    </div>
                    <span className='product-title'>{mobile.title.replace(/<[^>]*>?/gm, '')}</span>
                    <div className="product-status">
                      <div className="info-icons">
                        <LuTag /><span>{mobile.condition || 'New'}</span>
                      </div>
                      <div className="info-icons mobile-label">
                        {mobile.pta_status === 'PTA Approved' ? <LuWifi /> : <LuWifiOff />} 
                        <span>{mobile.pta_status === 'PTA Approved' ? 'PTA' : 'NON PTA'}</span>
                      </div>
                    </div>
                    <div className="footer-info">
                      <div className="address">
                        <LuMapPin /> <span>{mobile.location}</span>
                      </div>
                      <p className="time-ago">{mobile.posted_at}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="nav-button mobile-next" onClick={() => mobileSwiperRef.current?.slideNext()}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default Mobiles;