import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import mobiles from './CategoryImages/mobile_phone.svg';
import cars from './CategoryImages/Vehicle_Car.svg';
import bikes from './CategoryImages/Vehicle_Bike.svg';
import house_sale from './CategoryImages/house_for_sale.svg';
import house_rent from './CategoryImages/House_for_rent.svg';
import appartment from './CategoryImages/apartment.svg';
import jobs from './CategoryImages/jobs.svg';
import animals from './CategoryImages/animals.svg';
import more from './CategoryImages/more.svg';

const categories = [
    { id: 1, title: 'Mobiles', image: mobiles, route: 'products/1' },
    { id: 2, title: 'Cars', image: cars, route: 'products/2' },
    { id: 3, title: 'Bikes', image: bikes, route: 'products/3' },
    { id: 4, title: 'House For Sale', image: house_sale, route: 'products/4' },
    { id: 5, title: 'House For Rent', image: house_rent, route: 'products/5' },
    { id: 6, title: 'Appartment', image: appartment, route: 'products/6' },
    { id: 7, title: 'Jobs', image: jobs, route: 'products/7' },
    { id: 8, title: 'Animals', image: animals, route: 'products/8' },
    { id: 9, title: 'More', image: more, route: 'products/9' },
];

const CategoriesBox: React.FC = () => {
    const router = useRouter();

    const handleCategoryClick = (route: string) => {
        router.push(`/${route}`);
    };

    return (
        <div className="container-fluid mt-5">
            <h1 className="main-heading">
                Sell Up - Pakistan&apos;s Largest Marketplace for New &amp; Used Items
            </h1>
            <p className="text-muted cat-para">
                Buy &amp; Sell in Pakistan &ndash; Cars, Bikes, Property, Mobile Phones, Electronics, Jobs &amp; More on Pakistan&apos;s #1 Marketplace.
            </p>
            <div className="d-flex justify-content-center flex-wrap cat-cards">
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        className="card text-center cat-card" 
                        style={{ width: '8rem', cursor: 'pointer' }}
                        onClick={() => handleCategoryClick(category.route)}
                    >
                        <div className="card-body cat-card-body">
                            <Image
                                src={category.image.src}
                                alt={category.title}
                                className="img-fluid mb-2"
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover' }}
                            />
                            <h5 className="card-title">{category.title}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesBox;
