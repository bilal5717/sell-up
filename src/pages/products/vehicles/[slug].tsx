"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiFilter, 
  FiX 
} from 'react-icons/fi';

import { 
  LuHeart, 
  LuTag, 
  LuMapPin 
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface VehicleProduct {
  id: number;
  post_id: number;
  brand: string;
  model: string;
  condition: string;
  price: string;
  location: string;
  posted_at: string;
  image?: string;
  fuel_type?: string;
  transmission?: string;
  mileage?: string;
  engine_capacity?: string;
  color?: string;
}

interface FilterState {
  condition: string[];
  location: string[];
  type: string[];
}

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popular'];

const VehicleProductCard: React.FC<{
  products: VehicleProduct[];
  loading?: boolean;
}> = ({ products = [], loading = false }) => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const toggleLike = useCallback((productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No vehicles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isLiked = likedProducts.has(product.id);
        
        return (
          <article
            key={product.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={product.image || '/images/placeholder.png'}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Featured
              </span>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-800 font-bold">
                  Rs. {Number(product.price).toLocaleString()}
                </h3>
                <button 
                  onClick={() => toggleLike(product.id)}
                  className="p-1"
                >
                  <LuHeart
                    className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>
              <h4 className="text-gray-700 font-medium text-sm line-clamp-2">
                {product.brand} {product.model} - {product.color}
              </h4>
              <div className="text-gray-600 text-xs mt-2">
                {product.fuel_type && (
                  <div>Fuel: {product.fuel_type}</div>
                )}
                {product.transmission && (
                  <div>Transmission: {product.transmission}</div>
                )}
                {product.engine_capacity && (
                  <div>Engine: {product.engine_capacity} CC</div>
                )}
                {product.mileage && (
                  <div>Mileage: {product.mileage} KM</div>
                )}
                <div className="mt-2 flex items-center gap-1">
                  <LuMapPin />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const VehicleCategoryPage: React.FC = () => {
  const [products, setProducts] = useState<VehicleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchVehicleProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/vehicles');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching vehicle products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicles for Sale</h1>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <VehicleProductCard 
        products={products} 
        loading={loading} 
      />
    </div>
  );
};

export default VehicleCategoryPage;
