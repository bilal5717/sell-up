'use client';

import { useRouter } from 'next/router';
import { LuCopyCheck, LuShieldCheck, LuArchiveRestore } from "react-icons/lu";
import Link from 'next/link';
import ProductImageCarousel from '@/components/ProductImgSlider/ProductImageCarousel';
interface Mobile {
  id: number;
  image: string;
  price: string;
  title: string;
  status: string;
  address: string;
  posted: string;
  ptaApproved: string;
}

const mobiles: Mobile[] = [
  { 
    id: 1, 
    image: "https://d3fyizz0b46qgr.cloudfront.net/global/homepage/video/spark30series/%E5%9B%BE%E5%B1%82%202.jpg", 
    price: "RS 50,000", 
    title: "Samsung Galaxy S21", 
    status: "Used", 
    address: "123 Main St, City, Country", 
    posted: "1 day ago", 
    ptaApproved: 'pta' 
  },
  { 
    id: 2, 
    image: "https://d3fyizz0b46qgr.cloudfront.net/global/homepage/video/spark30series/%E5%9B%BE%E5%B1%82%202.jpg", 
    price: "RS 45,000", 
    title: "iPhone 12", 
    status: "New", 
    address: "456 Elm St, City, Country", 
    posted: "3 days ago", 
    ptaApproved: 'non pta' 
  }
];

export default function PostPage() {
    const router = useRouter();
    const { id } = router.query;
    if (!id) {
        return <div>Post not found</div>;
      }
      const mobile = mobiles.find((m) => m.id === parseInt(id as string));

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
                {mobile ? mobile.title : "Not Found"}
              </li>
            </ol>
          </nav>
        </div>
        {/* left Side post /product details  */}
        <div className="row flex-nowrap">
          <div className="col-8 left-product-wrapper">
            <div className="row p-2 ">
              <div className="col-12 border rounded-3 border-gray-200 rounded-lg shadow-md bg-white py-2">
                <ProductImageCarousel />
              </div>
            </div>
            <div className="row px-2">
              <div className="col-12 border rounded-3 my-3 p-0">
                <div className=" p-3 border border-gray-200 rounded-lg shadow-md bg-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="m-0 p-0"><b>Rs 999999</b></h2>
                    <div className="flex items-center  text-gray-500">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
                        width="16" 
                        alt="Location" 
                        className="mr-2" 
                      />
                      <span className="text-dark location-text">Lahore pakistan punjab</span>
                    </div>
                  </div>
                  <br />
                  <div className=" d-flex align-items-center justify-content-between">
                    <h6 className="m-0">This is my title</h6>
                    <div className="flex items-center  text-gray-500">
                      <span className="font-12">24 March 2025</span>
                    </div>
                  </div>
                  <hr />

                  {/* Details description */}
                  <div className="mt-3">
                    <h6 className="text-xl font-semibold mb-2"><b>Ad Features</b></h6>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <hr />
                        <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                          <span className="text-dark location-text">Ad no.</span>
                          <span className="flex items-center d-flex align-items-center">
                            <LuCopyCheck className="text-dark mx-1"/><strong className="text-dark mt-1 mx-1">152067</strong>
                          </span>
                        </p>
                        <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                          <span className="text-dark location-text">Brand</span>
                          <strong className="text-dark">Samsang</strong>
                        </p>
                        <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                          <span className="text-dark location-text">Model</span>
                          <strong className="text-dark">J7</strong>
                        </p>
                        <p className="flex justify-between items-center py-2  text-sm my-0">
                          <span className="text-dark location-text">Condition</span>
                          <strong className="text-dark">New</strong>
                        </p>
                      </div>
                      <div className="mx-3">
                        <hr />
                        <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                          <span className="text-dark location-text">Memory</span>
                          <strong className="text-dark">6GB</strong>
                        </p>
                        <p className="flex justify-between items-center py-2 product-details-border text-sm my-0">
                          <span className="text-dark location-text">Color</span>
                          <strong className="text-dark">White</strong>
                        </p>
                        <p className="flex justify-between items-center py-2  text-sm my-0">
                          <span className="text-dark location-text">Storage</span>
                          <strong className="text-dark">128GB</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr />
                  {/* product info buttons  */}
                  <div className="mt-3 d-flex">
                    <button className="btn d-flex align-items-center justify-content-center  w-50 mx-2 border-dark">
                      <LuShieldCheck className="mx-2" size={25} color="#a92824"/>
                      <b className=" mt-1 mx-1">Safe Payment</b>
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
                      The product was purchased from Hepsiburada seller in January 2024. It has an invoice. 
                      It is still under warranty and has more than 11 months to charge. It is the 256 gb model. 
                      The battery is 87%. There is no problem with the phone. It has never been used without 
                      unbreakable glass and a case. The unbreakable glass and 3 cases will be given to the 
                      buyer together with its box. I am selling it because I upgraded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side bar seller types and profiles */}
          <div className="col-3  my-2 mx-4  p-0 right-product-wrapper">
            {/* <SellerBusinessProfileCard /> */}
            <div className="card my-2" style={{ maxWidth: '540px' }}>
              <div className="card-body d-flex align-items-start p-2">
                {/* Left Side with Image, Title & Status */}
                <div className=" d-flex me-3 text-center">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/004/477/337/non_2x/face-young-man-in-frame-circular-avatar-character-icon-free-vector.jpg"
                    alt="Vendor"
                    className="rounded-circle mb-2"
                    width="80"
                    height="80"
                  />
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <h1 className="card-title mb-1">Vendor Name</h1>
                    <button className="btn btn-sm btn-success">Vendor</button>
                  </div>
                </div>
              </div>
              <button className="btn btn-warning my-2 mx-auto " style={{ width: '90%' }}>
                Visit Vendor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}