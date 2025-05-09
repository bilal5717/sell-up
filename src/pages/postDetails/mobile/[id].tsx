'use client';

import { useRouter } from 'next/router';
import { LuCopyCheck, LuShieldCheck, LuArchiveRestore } from "react-icons/lu";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductImageCarousel from '@/components/ProductImgSlider/ProductImageCarousel';

interface MediaItem {
  url: string;
  type: string;
}

interface Mobile {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  posted_at: string;
  created_at: string;
  mobile_details: {
    pta_status: string;
    condition: string;
    brand: string;
    model: string;
    storage: string;
    memory: string;
    battery_status: string;
    accessory_type: string;
    charging_cable_type: string;
    device_type: string;
    charger_type: string;
    headphone_type: string;
  };
  videos: { url: string }[];
  images: { url: string }[];
}

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) {
    return <div>Post not found</div>;
  }
  
  const [mobile, setMobile] = useState<Mobile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    const fetchMobile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/mobiles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mobile data');
        }
        const data = await response.json();
        console.log(data);
        setMobile(data);
      } catch (err) {
        setError('Mobile not found');
        console.error('Error:', err);
      }
    };
    fetchMobile();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shouldDisplayField = (value: string) => {
    return value && value !== 'N/A' && value !== 'null';
  };

  if (error) return <div>{error}</div>;
  if (!mobile) return <div>Loading...</div>;

  const media: MediaItem[] = [
    ...(mobile.videos?.map((vid) => ({ url: vid.url, type: 'video' })) || []),
    ...(mobile.images?.map((img) => ({ url: img.url, type: 'image' })) || []),
  ];

  return (
    <div className="container-fluid body-wrapper my-0 product-details-wrapper">
      <hr />
      <div className="container product-details-inner-wrapper">
        <div className="row ">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              <li className="breadcrumb-item">
                <Link href="/" style={{ color: '#6c757d', textDecoration: 'none' }}>Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/mobiles" style={{ color: '#6c757d', textDecoration: 'none' }}>Mobiles</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {mobile.title.replace(/<[^>]*>?/gm, '')}
              </li>
            </ol>
          </nav>
        </div>
        {/* left Side post /product details  */}
        <div className="row flex-nowrap">
          <div className="col-8 left-product-wrapper">
            <div className="row p-2 ">
              <div className="col-12 border rounded-3 border-gray-200 rounded-lg shadow-md bg-white py-2">
                <ProductImageCarousel media={media} />
              </div>
            </div>
            <div className="row px-2">
              <div className="col-12 border rounded-3 my-3 p-0">
                <div className=" p-3 border border-gray-200 rounded-lg shadow-md bg-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="m-0 p-0"><b>RS:{mobile.price}</b></h2>
                    <div className="flex items-center text-gray-500">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
                        width="16" 
                        alt="Location" 
                        className="mr-2" 
                      />
                      <span className="text-dark location-text">{mobile.location}</span>
                    </div>
                  </div>
                  <br />
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="m-0">{mobile.title.replace(/<[^>]*>?/gm, '')}</h6>
                    <div className="flex items-center text-gray-500">
                      <span className="font-12">{formatDate(mobile.created_at)}</span>
                    </div>
                  </div>
                  <hr />

                  {/* Details description */}
                  <div className="mt-3">
                    <h6 className="text-xl font-semibold mb-2"><b>Ad Features</b></h6>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <hr />
                        {shouldDisplayField(mobile.id.toString()) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Ad no.</span>
                            <span className="flex items-center d-flex align-items-center">
                              <LuCopyCheck className="text-dark mx-1"/><strong className="text-dark mt-1 mx-1">{mobile.id}</strong>
                            </span>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.brand) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Brand</span>
                            <strong className="text-dark">{mobile.mobile_details.brand}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.model) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Model</span>
                            <strong className="text-dark">{mobile.mobile_details.model}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.pta_status) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">PTA Status</span>
                            <strong className="text-dark">{mobile.mobile_details.pta_status}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.condition) && (
                          <p className="flex justify-between items-center py-2 text-sm my-0">
                            <span className="text-dark location-text">Condition</span>
                            <strong className="text-dark">{mobile.mobile_details.condition}</strong>
                          </p>
                        )}
                      </div>
                      <div className="mx-3">
                        <hr />
                        {shouldDisplayField(mobile.mobile_details.memory) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Memory</span>
                            <strong className="text-dark">{mobile.mobile_details.memory}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.storage) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Storage</span>
                            <strong className="text-dark">{mobile.mobile_details.storage}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.battery_status) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Battery Status</span>
                            <strong className="text-dark">{mobile.mobile_details.battery_status}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.accessory_type) && (
                          <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                            <span className="text-dark location-text">Accessory Type</span>
                            <strong className="text-dark">{mobile.mobile_details.accessory_type}</strong>
                          </p>
                        )}
                        {shouldDisplayField(mobile.mobile_details.charging_cable_type) && (
                          <p className="flex justify-between items-center py-2 text-sm my-0">
                            <span className="text-dark location-text">Charging Cable</span>
                            <strong className="text-dark">{mobile.mobile_details.charging_cable_type}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr />
                  {/* product info buttons  */}
                  <div className="mt-3 d-flex">
                    <button className="btn d-flex align-items-center justify-content-center w-50 mx-2 border-dark">
                      <LuShieldCheck className="mx-2" size={25} color="#a92824"/>
                      <b className="mt-1 mx-1">Safe Payment</b>
                    </button>
                    <button className="btn d-flex align-items-center justify-content-center border-dark w-50 product-info-btn">
                      <LuArchiveRestore className="mx-2" size={25} color="#a92824"/>
                      <b>Easy Return</b>
                    </button>
                  </div>

                  {/* Description for product details  */}
                  <hr />
                  <div className="mt-3 text-dark">
                    <h6 className="text-xl font-semibold mb-2"><b>Ad Description</b></h6>
                    <p className="text-dark py-2">
                      {mobile.description.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}