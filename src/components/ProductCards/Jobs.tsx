'use client';
import React, { useRef, useState, useEffect } from 'react';
import { LuHeart, LuMapPin } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper as SwiperType } from 'swiper/types';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

interface Job {
  id: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  job_type: string;
  company_name: string;
  images: { url: string }[];
  salary_from: number | null;
  salary_to: number | null;
  condition: string;
}

const Jobs = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showFullCard, setShowFullCard] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
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

  const formatSalary = (from: number | null, to: number | null) => {
    if (!from || !to) return 'Salary not specified';
    return `RS ${from.toLocaleString()} - RS ${to.toLocaleString()}`;
  };

  if (loading) {
    return <div className="text-center py-5">Loading jobs...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid my-3">
      <h1>Jobs Available</h1>
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
          {jobs.map((job) => (
            <SwiperSlide 
              key={job.id} 
              onClick={handleSlideClick} 
              style={{ width: '240px', cursor: 'pointer' }}
            >
              <div className="card product-card h-100">
                <div className="image-container" style={{ height: '180px', overflow: 'hidden' }}>
                  {job.images ? (
                   <Image
                                       src={job.images[0]?.url || '/images/placeholder.png'}
                                       alt={job.title}
                                       width={240}
                                       height={180}
                                       className="w-full h-auto object-cover"
                                     />
                  ) : (
                    <div className="placeholder-image d-flex align-items-center justify-content-center h-100 bg-light">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="price-container d-flex justify-content-between align-items-center mb-2">
                    <h6 className="price mb-0">{job.company_name}</h6>
                    <LuHeart 
                      className="heart-icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(e);
                      }} 
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <span className='product-title mb-2'>{job.title}</span>
                  <div className="product-status mb-3">
                    <div className="info-icons mb-2">
                      <span>{job.job_type || 'Full Time'}</span>
                    </div>
                    <div className="info-icons mobile-label">
                      <span>{job.condition || 'Onsite'}</span>
                    </div>
                  </div>
                  <div className="footer-info mt-auto">
                    <div className="address mb-2">
                      <LuMapPin className="me-2" /> 
                      <span>{job.location}</span>
                    </div>
                    <p className="time-ago text-success mb-1">
                      {formatSalary(job.salary_from, job.salary_to)}
                    </p>
                    <p className="time-ago text-muted mb-0">
                      {job.posted_at}
                    </p>
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

export default Jobs;
