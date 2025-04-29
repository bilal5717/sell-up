'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CategorySelector from './SelectSubCat/subCategories';
import Logo from '@public/logo.jpg';
import PlainLayout from '@/Layout/PlainLayout';
type Category = {
  id: number;
  name: string;
  icon: string;
  component: string;
};

const CATEGORIES: Category[] = [
  { id: 1, name: 'Mobiles', icon: '📱', component: 'MobilesPosting' },
  { id: 2, name: 'Vehicles', icon: '🚗', component: 'VehiclesPosting' },
  { id: 3, name: 'Property for Rent', icon: '🏠', component: 'PropertySalePosting' },
  { id: 4, name: 'Property for Sale', icon: '🏘️', component: 'PropertyForRent' },
  { id: 5, name: 'Electronics & Home Appliances', icon: '💻', component: 'ElectronicsPosting' },
  { id: 6, name: 'Bikes', icon: '🚲', component: 'BikesPosting' },
  { id: 7, name: 'Business, Industrial & Agriculture', icon: '🏭', component: 'BusinessIndustrialForm' },
  { id: 8, name: 'Services', icon: '🔧', component: 'ServicePostingForm' },
  { id: 9, name: 'Jobs', icon: '💼', component: 'JobPostingForm' },
  { id: 10, name: 'Animals', icon: '🐕', component: 'CreateAnimalPost' },
  { id: 11, name: 'Books, Sports & Hobbies', icon: '📚', component: 'CreateBooksPost' },
  { id: 12, name: 'Furniture & Home Decor', icon: '🛋️', component: 'FurnitureHomeDecorPosting' },
  { id: 13, name: 'Fashion & Beauty', icon: '👗', component: 'CreateFashionBeautyPost' },
  { id: 14, name: 'Kids', icon: '👶', component: 'CreateKidsPost' },
  { id: 15, name: 'Others', icon: '🗂️', component: 'OthersPosting' },
];

type OLXHeaderProps = {
  onBack: () => void;
  showLogo?: boolean;
  title?: string;
};

const OLXHeader: React.FC<OLXHeaderProps> = ({ onBack, showLogo = true, title = "Post your ad" }) => (
  <header className="bg-white shadow-sm sticky-top">
    <div className="container">
      <div className="d-flex align-items-center py-2">
        <button onClick={onBack} className="btn btn-link p-0 me-3">
          <FiChevronLeft size={24} />
        </button>
        <div className="flex-grow-1 text-center">
          {showLogo ? (
            <Image src={Logo} alt="SellUp Logo" width={60} height={40} className="img-fluid" />
          ) : (
            <h5 className="mb-0 fw-bold">{title}</h5>
          )}
        </div>
        <div style={{ width: 24 }} />
      </div>
    </div>
  </header>
);

export default function PostCreationPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <OLXHeader
        onBack={handleBack}
        showLogo={!selectedCategory}
        title={selectedCategory ? "Select Subcategory" : ""}
      />

      <main className="container py-3">
        {!selectedCategory ? (
          <>
            <div className="text-center mb-4">
              <h4 className="fw-bold">Post your ad</h4>
            </div>

            <div className="row g-4">
              {CATEGORIES.map((category) => (
                <div key={category.id} className="col-6 col-md-4 col-lg-3">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="text-start text-dark w-100 btn p-0 border-0 bg-transparent"
                  >
                    <div
                      className="card"
                      style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        height: '100px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div className="card-body d-flex align-items-center p-3">
                        <div className="d-flex align-items-center w-100">
                          <div
                            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '60px',
                              height: '60px',
                              minWidth: '60px',
                              marginRight: '12px',
                            }}
                          >
                            <span className="fs-4">{category.icon}</span>
                          </div>
                          <div className="text-start flex-grow-1">
                            <h6
                              className="mb-0 fw-bold"
                              style={{
                                fontSize: '14px',
                                color: '#212121',
                                lineHeight: '1.4',
                              }}
                            >
                              {category.name}
                            </h6>
                          </div>
                          <FiChevronRight className="text-muted" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-1">
            <CategorySelector category={selectedCategory} />
          </div>
        )}
      </main>
    </div>
  );
}
PostCreationPage.getLayout = function getLayout(page: React.ReactNode) {
  return <PlainLayout>{page}</PlainLayout>;
};