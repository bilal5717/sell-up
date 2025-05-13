"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { LuHeart, LuTag, LuMapPin, LuWifi, LuWifiOff } from 'react-icons/lu';

interface MobileProduct {
  image: string | null;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  condition?: string;
  type?: string;
  pta_status?: string;
  size?: string;
}

interface FilterState {
  condition: string[];
  location: string[];
  type: string[];
}

interface MobileProductCardProps {
  category: string;
  subCategory?: string | null;
  type?: string | null;
  filters: FilterState;
}

const typeToSlugMap: Record<string, string> = {
  'Charging Cables': 'charging_cables',
  'Converters': 'converters',
  'Chargers': 'chargers',
  'Screens': 'screen',
};

const products: Record<string, MobileProduct[]> = {
  mobiles: [
    {
      image: 'https://via.placeholder.com/240x180',
      title: 'iPhone 13 Pro Max 256GB',
      price: '220,000',
      location: 'Karachi',
      posted_at: 'Today 10:30 am',
      condition: 'New',
      pta_status: 'PTA Approved',
    },
    {
      image: 'https://via.placeholder.com/240x180',
      title: 'Samsung Galaxy S21 Ultra',
      price: '180,000',
      location: 'Lahore',
      posted_at: 'Yesterday',
      condition: 'Used',
      pta_status: 'NON PTA',
    },
  ],
  tablets: [
    {
      image: 'https://via.placeholder.com/240x180',
      title: 'iPad Pro 11-inch',
      price: '150,000',
      location: 'Islamabad',
      posted_at: 'Today 8:00 am',
      condition: 'New',
    },
  ],
  converters: [
    {
      image: 'https://via.placeholder.com/240x180',
      title: 'USB-C to HDMI Converter',
      price: '1,500',
      location: 'Karachi',
      posted_at: 'Today 10:30 am',
      condition: 'New',
    },
  ],
  chargers: [
    {
      image: 'https://via.placeholder.com/240x180',
      title: 'Fast Charging Adapter',
      price: '2,000',
      location: 'Lahore',
      posted_at: 'Yesterday',
      condition: 'Used',
      type: 'USB Type-C',
    },
  ],
  screen: [
    {
      image: 'https://via.placeholder.com/240x180',
      title: 'Mobile Screen Replacement',
      price: '5,000',
      location: 'Islamabad',
      posted_at: '2 days ago',
    },
  ],
};

const MobileProductCard: React.FC<MobileProductCardProps> = ({ 

  category, 
  subCategory, 
  type, 
  filters 
}) => {
  const [liked, setLiked] = useState<boolean[]>([]);

  const filteredProducts = useMemo(() => {
    let filtered = products[category] || [];
    
    if (subCategory === 'Accessories' && type) {
      const typeSlug = typeToSlugMap[type];
      filtered = products[typeSlug] || [];
    } else if (subCategory) {
      const subCategorySlug = subCategory.toLowerCase();
      filtered = products[subCategorySlug] || [];
    }
    
    if (filters.condition.length > 0) {
      filtered = filtered.filter(product => 
        product.condition && filters.condition.includes(product.condition)
      );
    }
    
    if (filters.location.length > 0) {
      filtered = filtered.filter(product => 
        filters.location.some(loc => 
          product.location.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }
    
    if (filters.type.length > 0) {
      filtered = filtered.filter(product => 
        product.type && filters.type.includes(product.type)
      );
    }
    
    return filtered;
  }, [category, subCategory, type, filters]);

  useEffect(() => {
    setLiked(new Array(filteredProducts.length).fill(false));
  }, [filteredProducts]);

  const toggleLike = (index: number) => {
    setLiked((prev) => {
      const updatedLikes = [...prev];
      updatedLikes[index] = !updatedLikes[index];
      return updatedLikes;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:scale-105"
        >
          <div className="relative h-48 bg-gray-200">
            <Image
              src={product.image ?? '/images/placeholder.png'}
              alt={product.title}
              width={240}
              height={180}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Featured
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-1">
              <h6 className="text-gray-800 font-bold">Rs. {product.price}</h6>
              <LuHeart
                className={`text-xl cursor-pointer ${liked[index] ? 'text-red-500' : 'text-gray-400'}`}
                onClick={() => toggleLike(index)}
              />
            </div>

            <h3 className="text-gray-700 font-medium text-sm line-clamp-2">
              {product.title}
            </h3>

            <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
              <div className="flex items-center gap-1">
                <LuTag />
                <span>{product.condition || 'New'}</span>
              </div>
              {product.pta_status && (
                <div className="flex items-center gap-1">
                  {product.pta_status === 'PTA Approved' ? (
                    <LuWifi className="text-green-500" />
                  ) : (
                    <LuWifiOff className="text-red-500" />
                  )}
                  <span>{product.pta_status === 'PTA Approved' ? 'PTA' : 'NON PTA'}</span>
                </div>
              )}
            </div>

            <div className="flex justify-start flex-col items-start text-gray-500 text-xs mt-2">
              <div className="flex items-center gap-1">
                <LuMapPin />
                <span>{product.location}</span>
              </div>
              <p className="text-xs">{product.posted_at}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileProductCard;