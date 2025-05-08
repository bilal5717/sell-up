"use client";
import { useState } from 'react';
import {
  Search,
  MessageCircle,
  Bell,
  ShoppingBag,
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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const provinces: Provinces = {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat'],
    'Balochistan': ['Quetta', 'Gwadar', 'Khuzdar', 'Turbat'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Astore'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli'],
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between py-2 px-2 gap-3">
      {/* Location Dropdown - Compact size */}
      <div className="w-full md:w-[180px] relative">
        <div className="flex items-center border rounded-md h-[40px]">
          <button 
            className="flex items-center w-full justify-between px-3 py-1 text-sm"
            onClick={handleDropdownToggle}
          >
            <div className="flex items-center">
              <MapPin size={14} className="mr-1"/>
              <span className="truncate">
                {selectedCity || selectedProvince || 'Select Location'}
              </span>
            </div>
            <ChevronDown size={14} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
              {!selectedProvince ? (
                <>
                  {Object.keys(provinces).map((province) => (
                    <div
                      key={province}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => setSelectedProvince(province)}
                    >
                      {province}
                    </div>
                  ))}
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm font-medium"
                    onClick={() => {
                      setSelectedProvince(null);
                      setSelectedCity(null);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Clear Selection
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm font-medium"
                    onClick={() => setSelectedProvince(null)}
                  >
                    ← Back to Provinces
                  </div>
                  {provinces[selectedProvince].map((city) => (
                    <div
                      key={city}
                      className="p-1 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Box - Matching height */}
      <div className="w-full flex-1 md:max-w-none lg:flex-[2] mx-0 md:mx-4">
        <div className="flex items-center border rounded-md h-[40px]">
          <input
            type="text"
            placeholder="Search..."
            className="ml-3 bg-transparent outline-none w-full py-2  text-sm md:text-base h-full"
          />
          <div className="h-full px-3 flex items-center justify-center bg-dark border-l">
            <Search size={16} className="text-white" />
          </div>
        </div>
      </div>
      {/* Icons Section - Wider and properly spaced */}
      <div className="w-full md:w-[220px] lg:w-[300px] flex items-center justify-end h-[40px] gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-4 md:gap-5">
          <MessageCircle size={24} className="cursor-pointer min-w-[20px]" />
          <Bell size={24} className="cursor-pointer min-w-[20px]" />
          <ShoppingBag size={24} className="cursor-pointer min-w-[20px]" />
        </div>
        <div className="flex-1 sm:flex-none flex justify-end">
          <AuthPopup />
        </div>
      </div>
    </header>
  );
};

export default Header;