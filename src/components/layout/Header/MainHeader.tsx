"use client";
import { useState } from 'react';
import {
  Search,
  MessageCircle,
  Bell,
  ShoppingBag,
  User,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import AuthPopup from '@pages/Auth/AuthContainer';

interface Provinces {
  [key: string]: string[];
}

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const provinces: Provinces = {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat'],
    'Balochistan': ['Quetta', 'Gwadar', 'Khuzdar', 'Turbat'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Astore'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli'],
  };

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex items-center justify-center py-2">
      {/* Left Side: Dropdown */}
      <div className="flex items-center space-x-2 w-1/6 border mx-3 relative align-self-end">
        <button 
          className="flex items-center space-x-1 w-full justify-between px-4 py-2"
          onClick={handleDropdownToggle}
        >
          <MapPin size={16}/>
          <span>{selectedProvince || 'Menu'}</span>
          <ChevronDown size={16} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded shadow-lg z-10">
            {!selectedProvince ? (
              Object.keys(provinces).map((province) => (
                <div
                  key={province}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleProvinceSelect(province)}
                >
                  {province}
                </div>
              ))
            ) : (
              <>
                <div
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedProvince(null)}
                >
                  &larr; Back
                </div>
                {provinces[selectedProvince].map((city) => (
                  <div
                    key={city}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {city}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center border w-1/2">
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 bg-transparent outline-none w-full"
        />
        {/* Icon container */}
        <div className="p-2 search-btn flex items-center justify-start">
          <Search size={16} className="text-gray-600" />
        </div>
      </div>

      {/* Right Side: Icons and Login/Signup Button */}
      <div className="flex items-center space-x-6 w-1/6 justify-center mx-3">
        <MessageCircle size={24} className="cursor-pointer" />
        <Bell size={24} className="cursor-pointer" />
        <ShoppingBag size={24} className="cursor-pointer" />
       
        <AuthPopup />
        {/* Commented out avatar dropdown */}
        {/* <div className="relative inline-block hide">
          <div className="circle-avatar" onClick={toggleDropdown}>
            <img
              src="https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197911.png"
              alt="default-avatar"
            />
            <ChevronDown />
          </div>
          {isOpen && (
            <div className="dropdown-menu">
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </div>
          )}
        </div> */}
        <hr />
      </div>
    </header>
  );
};

export default Header;