// constants/categories.ts

export const CATEGORIES = [
    { id: 1, name: 'Mobiles', icon: '📱', subcategories: ['Tablets', 'Accessories', 'Mobile Phones', 'Smart Watches'] },
    { id: 2, name: 'Vehicles', icon: '🚗', subcategories: [
      'Cars', 'Cars On Installments', 'Car Care', 'Car Accessories', 'Spare Parts', 'Oil & Lubricant',
      'Buses,Vans&Trucks', 'Rikshaw&Chingchi', 'Tractors&Trailers', 'Boats', 'Other Vehicles'
    ] },
    { id: 3, name: 'Property for Rent', icon: '🏘️', subcategories: [
      'Houses', 'Apartments & Flats', 'Portions & Floors', 'Shops, Offices & Commercial Spaces',
      'Roommates & Paying Guests', 'Rooms', 'Vacation Rentals & Guest Houses', 'Land & Plots'
    ] },
    { id: 4, name: 'Property for Sale', icon: '🏠', subcategories: [
      'Houses', 'Apartments & Flats', 'Portions & Floors', 'Shops, Offices & Commercial Spaces', 'Land & Plots'
    ] },
    { id: 5, name: 'Electronics & Home Appliances', icon: '💻', subcategories: [
      'Computer & Accessories', 'Games & Entertainment', 'Cameras & Accessories',
      'Videos & Audios', 'AC & Coolers', 'Fans', 'Heaters And Gysers', 'Washing Machines & dryers',
      'Irons & Steamers', 'Sewing Machines', 'Generators,UPS And Power Solutions', 'Refrigerator & Freezers',
      'Air Purifier & Humidfier', 'water dispensers', 'Microwave & Ovens', 'Kitchen Appliances', 'Other Electronics'
    ] },
    { id: 6, name: 'Bikes', icon: '🚲', subcategories: [
      'MotorCycles', 'Spare Parts', 'Bike Accessories', 'Bicycle', 'ATV & Quads', 'Scooters', 'Others'
    ] },
    { id: 7, name: 'Business, Industrial & Agriculture', icon: '🏭', subcategories: [
      'Business For Sale', 'Food & Restaurant', 'Construction & Heavy Machinery', 'Agriculture',
      'Medical & Pharma', 'Trade & Industrial Machinery', 'Farming Supplies', 'Commercial Kitchen Equipment',
      'Packaging Machinery', 'Other Business & Industry'
    ] },
    { id: 8, name: 'Services', icon: '🔧', subcategories: [
      'Architecture & Interior Design', 'Camera Installation', 'Car Rental', 'Car Services',
      'Catering & Restaurent', 'Construction Services', 'Consolatancy Services', 'Domestic Help', 'Driver & Taxi',
      'Tution & academics', 'Electronic & Computer Repair', 'Event Services', 'Farm & Fresh Food', 'Health & Beauty',
      'Home & Office Repair', 'Insurances Services', 'Movers & Packers', 'Renting Services', 'Tailor Services',
      'Travel & Visa', 'Video & Photography', 'Web Developement', 'Other Services'
    ] },
    { id: 9, name: 'Jobs', icon: '💼', subcategories: [
      'Accounting & Finance', 'Advertising & PR', 'Architecture & Interior Design', 'Clerical & Administration',
      'Content Writing', 'Customer Service', 'Delivery Riders', 'Domestic Staff', 'Education', 'Engineering',
      'Graphic Design', 'Hotels & Tourism', 'Human Resources', 'Internships', 'IT & Networking', 'Manufacturing',
      'Marketing', 'Medical', 'Online', 'Part Time', 'Real Estate', 'Restaurents & Hospitals', 'Sales', 'Security'
    ] },
    { id: 10, name: 'Animals', icon: '🐕', subcategories: ['Pets', 'Aquarium', 'Birds', 'Livestock', 'Animal Supplies', 'Others'] },
    { id: 11, name: 'Books, Sports & Hobbies', icon: '📚', subcategories: [
      'Sports Equipment', 'Musical Instruments', 'Gym & Fitness', 'Books & Magazines', 'Others'
    ] },
    { id: 12, name: 'Furniture & Home Decor', icon: '🛋️', subcategories: [
      'Sofa & Chair', 'Beds & Wardrobes', 'Tables & Dining', 'Bathroom & Accessories', 'Garden & Outdoor',
      'Painting & Mirror', 'Rugs & Carpets', 'Curtains & Blinds', 'Office Furniture', 'Home Decoration', 'Other Household items'
    ] },
    { id: 13, name: 'Fashion & Beauty', icon: '👗', subcategories: [
      'Clothes', 'Fashion Accessories', 'Makeup', 'Skin & Hair', 'Wedding', 'Footwear', 'Bags', 'Jewellery', 'Watches', 'Fragrance', 'Others'
    ] },
    { id: 14, name: 'Kids', icon: '👶', subcategories: [
      'Kids Furniture', 'Toys & Games', 'Bath & Diapers', 'Swings & Slides', 'Kids Accessories',
      'Kids Books', 'Kids Vehicle', 'Baby Gear', 'Kids Clothing', 'Others'
    ] },
  ];
  
  export const ACCESSORY_TYPES: string[] = ['Cases & Covers', 'Screen Protectors', 'Chargers & Cables', 'Power Banks', 'Holders & Stands', 'Earphones & Headphones', 'Memory Cards', 'Stylus', 'Other Accessories'];
  export const CAR_CARE_TYPES: string[] = ['Car Wash & Detailing', 'Car Polish & Wax', 'Car Cleaning Products', 'Car Air Fresheners', 'Car Care Kits', 'Other Car Care Products'];
  export const CAR_ACCESSORY_TYPES: string[] = ['Car Audio & Video', 'Car Alarm & Security', 'Car GPS & Navigation', 'Car Lights', 'Car Phone Holders', 'Car Seat Covers', 'Car Sun Shades', 'Car Tinting', 'Other Car Accessories'];
  export const SPARE_PART_TYPES: string[] = ['Engine Parts', 'Transmission Parts', 'Electrical Parts', 'Suspension Parts', 'Brake Parts', 'Exhaust Parts', 'Body Parts', 'Other Spare Parts'];
  export const OIL_LUBRICANT_TYPES: string[] = ['Engine Oil', 'Gear Oil', 'Brake Fluid', 'Coolant', 'Grease', 'Other Lubricants'];
  
  export const ELECTRONICS_TYPES: { [key: string]: string[] } = {
    'Computer & Accessories': ['Desktops', 'Workstations', 'Gaming Pcs', 'Laptops', 'Computer & Laptop Accessories', 'Computer components', 'Servers', 'Softwares', 'Networking', 'Printers & photocopier', 'Inks & Toners'],
    'Games & Entertainment': ['Gaming console', 'Video Games', 'Controllers', 'Gaming Accessories', 'Other'],
    'Cameras & Accessories': ['Digital Camera', 'CCTV Camera', 'Drones', 'Binowlars', 'Video Cameras', 'Camera lenses', 'Flash Guns', 'Bags & cases', 'Tripods & Stands', 'Camera Batteries', 'Professional Microphone', 'Video Lights', 'Gimbles & Stablizers', 'Other Cameras Accessories'],
    'Videos & Audios': ['Radios', 'Microphone', 'Home Theater system', 'Amplifiers', 'Sound Bars', 'Speaker', 'Audio interface', 'Digital Recorders', 'Audio Mixer', 'Walkie Talkie', 'CD DVD Player', 'Turntable & Accessories', 'Cassette Player & Recorders', 'Mp3 Player', 'Car Audio Video', 'Other Video-audios'],
    'AC & Coolers': ['Air Conditions', 'Air Coolers', 'AC & Cooler Accessories', 'Other'],
    'Heaters And Gysers': ['Heaters', 'Geysers', 'Heating Rods', 'Other'],
    'Microwave & Ovens': ['Ovens', 'Microwaves'],
    'Generators,UPS And Power Solutions': ['Generators', 'UPS', 'Solar Panels', 'Solar Inverters', 'Solar Accessories', 'Batteries', 'Other'],
    'Refrigerator & Freezers': ['Refigerators', 'Freezers', 'Mini'],
    'Irons & Steamers': ['Irons', 'steamers'],
    'Washing Machines & dryers': ['Washer', 'Spin Dryer','Washer&Dryer'],
    'Kitchen Appliances': ['juicers','Food Factory','Stover','Blenders','Air Fryers','Choppers','Grilss','Water pori frers','Mixers','Electric Kettles','Toasters','Cookers','Hot Plates','Coffee & TeaMachines','Hobs','Dinner Seats','Sandwich Makers','Vegetable slicers','Hoods','Meat Grinders','Dishwashers','Roti Maker','Sinks','Food Steamers','Other Kitchen appliances'],
    'Other Electronics': ['Other']
  };
  
  export const BIKES_TYPES: { [key: string]: string[] } = {
    'MotorCycles': ['Standard','Sports & Heavy Bikes', 'Cruiser' , 'Trail', 'Cafe Racers', 'Electric Bikes', 'Others'],
    'Spare Parts': ['Air filter','Carburelors','Bearing','Side Mirrors','Motorcycle Batteries','Switches','Lighting','Cylinders','Clutches','Pistons','Chain,cover & sprockets','Brakes','Handle Bavs & Grips','Levers','Seats','Exhausts','Fuel Tanks','Horns','Speedometers','Plugs','Stands','Tyres & Tubes','Other spareparts','Body & Frume','Slincer','Steering','Suspension','Transmission'],
    'Bike Accessories': ['Bicycle,Air pumps','Oil,Lubricants','Bike Covers','Bike Gloves','Helmets','Tail Boxes','Bike jackets','Bike locks','Safe Guards Other Bike-accessories','Chargers sticker & emblems'],
    'Bicycle': ['Road Bikes','Mountain Bikes','Hybrid Bikes','BMX Bike','Electric Bicycle','Folding bikes','Other Bicycle'],
    'Scooters': ['Petrol', 'Electric', 'Other']
  };
  
  export const BUSINESS_AGRICULTURE_TYPES: { [key: string]: string[] } = {
    'Business For Sale': ['Mobile Shops', 'Water Plants', 'Beauty Salons', 'Grocery Store', 'Hotel & Resturant', 'Pharmacies','Snooker Clubs','Cosmetic & jewellery Shop','Gyms','Clinics','Franchises','Gift and Toy Shops','Petrol Pump','Auto parts shop','Other Bussiness'],
    'Construction & Heavy Machinery': ['Construction Material','Concrete Grinders','Drill Machines','Road Roller','Cranes','Construction Lifters','Pavers','Excavators','Concrete Cutters','Compactors','Water Pumps','Air Compressors','Domp Truck','Motor Granders','Other Heavy Equipment'],
    'Medical & Pharma': ['Ultrasound Machines','Surgical Masks','patient Beds','Wheelchairs','Oxygen Cylinders','Pulse Oximeters','Hearing aid','Blood pressure Monitors','Themometers','Walkers','Nebulizer','Breast Pump','Surgical instrument','Microscopes','Other Medical Supplies'],
    'Trade & Industrial Machinery': ['Woodworking Machines','Currency counting machine','Plastic & Rubber processing machine','Molding Machine','Packing Machine','Welding equipemnt','paper machine','Air compressors','Sealing Machine','Lathe Machines','Liquid Filling Machine','Marking Machine','Textile Machinery','Sewing Machine','Knithing Machine','Embroidery Machine','Printing Machine','Other bussiness & Industrial Machines'],
    'Food & Restaurant': ['Baking equipment','Food display counters','Ovens & Tandoor','Fryers','Tables & Platform','Fruit & Vegetable Machine','Chillers','Food Stall','Delivery Bags','Crockery & Cutlery','Ic-Cream Machines','Other resturant equipment'],
    'Agriculture': ['Farm Machinery and equipment','Seads','Crops','Pesticides & Fertilizer','Plant & Tree','Other agriculture Silage']
  };
  
  export const SERVICES_TYPES: { [key: string]: string[] } = {
    'Domestic Help': ['Maids', 'Babysitters', 'Cooks', 'Nursing Staff', 'Other Domestic Help'],
    'Driver & Taxi': ['Drivers', 'Pick & drop', 'CarPool'],
    'Health & Beauty': ['Beauty &SPA', 'Fitness Trainer', 'Health Services'],
    'Home & Office Repair': ['Plumber', 'Electrician', 'Carpenters', 'Painters', 'AC services', 'Pest Control' ,'Water Tank Cleaning','Deep Cleaning','Geyser Services','Other Repair Services']
  };
  
  export const JOBS_TYPES: { [key: string]: string[] } = {
    'Domestic Help': ['Maids', 'Babysitters', 'Cooks', 'Nursing Staff', 'Other Domestic Help'],
    'Driver & Taxi': ['Drivers', 'Pick & drop', 'CarPool'],
    'Health & Beauty': ['Beauty &SPA', 'Fitness Trainer', 'Health Services'],
    'Home & Office Repair': ['Plumber', 'Electrician', 'Carpenters', 'Painters', 'AC services', 'Pest Control' ,'Water Tank Cleaning','Deep Cleaning','Geyser Services','Other Repair Services']
  };
  
  export const ANIMALS_TYPES: { [key: string]: string[] } = {
    'Pets': ['Dogs', 'Cats', 'Rabbits', 'Hamsters'],
    'Livestock': ['Cows', 'Goats', 'Sheep', 'Horses'],
    'Aquarium': ['Tropical Fish', 'Goldfish', 'Shrimp', 'Snails'],
    'Birds': ['Parrots', 'Canaries', 'Pigeons'],
    'Animal Supplies': ['Food&Accessories', 'Medicine', 'Others'],
  };
  
  export const BOOKSNSPORTS_TYPES: { [key: string]: string[] } = {
    'Books & Magazines': ['Books', 'Magazines', 'Dictionaries', 'Stationary Items','Calculators'],
  };
  
  export const KIDS_TYPES: { [key: string]: string[] } = {
    'Kids Vehicle': ['Kids Bikes', 'Kids Cars', 'Kids Cycles', 'Kids Scooties', 'Others'],
    'Baby Gear': ['Prams & Walkers', 'Baby Bouncers', 'Baby Carriers', 'Baby Cots', 'Baby Swings','Baby Seats','Baby High Chairs','Other baby Gears'],
    'Kids Clothing': ['Kids Costumes', 'Kids Cloths', 'Kids Shoes', 'Kids Uniform', 'Others'],
  };
  
  export const FASION_BEAUTY_TYPES: { [key: string]: string[] } = {
    'Clothes': ['Eastern', 'Western', 'Hijabs & Abayas', 'Sports Clothes', 'Kids Clothes','Others'],
    'Fashion Accessories': ['Caps', 'Scarves', 'Ties', 'Belts', 'Soacks','Gloves','Cufflinks','Sunglasses'],
    'Makeup': ['Brushes', 'Lips', 'Eyes', 'Face', 'Nails','Accessories','Others'],
    'Skin & Hair': ['Hair Care','Skin Care'],
    'Wedding': ['Bridal', 'Grooms', 'Formal'],
    'Books & Magazines': ['Books', 'Magazines', 'Dictionaries', 'Stationary Items', 'Calculators'],
  };
  
  export const FURNITURE_HOME_DECOR: { [key: string]: string[] } = {
    'Sofa & Chair': [
      'Sofas',
      'Sofa Beds',
      'Sofa Covers',
      'Cushions',
      'Chairs',
      'Recliners',
      'Bean Bags'
    ],
    'Beds & Wardrobes': [
      'Beds',
      'Mattresses',
      'Mattress Covers',
      'Pillows & Cases',
      'Bed Sheets',
      'Blankets & Comforters',
      'Other Bedding Accessories'
    ],
    'Bathroom & Accessories': [
      'Basins',
      'Bath Cabinets',
      'Bath Towels',
      'Bathtubs',
      'Shower Cabins',
      'Soap Dispensers',
      'Taps',
      'Toilets',
      'Vanity Units',
      'Other Bathroom Accessories'
    ],
    'Garden & Outdoor': [
      'Artificial Grass',
      'Benches',
      'Outdoor Chairs',
      'Outdoor Tables',
      'Outdoor Fountains',
      'Outdoor Lights',
      'Outdoor Umbrellas',
      'Outdoor Swings',
      'Plants and Pots',
      'Tents and Shades',
      'Other Outdoor Items'
    ],
    'Painting & Mirror': [
      'Paintings',
      'Painting Accessories',
      'Frames',
      'Mirror Lights',
      'Mirrors'
    ],
    'Rugs & Carpets': [
      'Rugs',
      'Carpets',
      'DoorMats',
      'Prayer Mats',
      'Other Floor Covers'
    ],
    'Curtains & Blinds': [
      'Curtains',
      'Blinds',
      'Accessories'
    ],
    'Office Furniture': [
      'Office Chairs',
      'Office Sofas',
      'Office Cabinets',
      'shelves & Racks',
      'Office Tables',
      'Other Office Furniture'
    ],
    'Home Decoration': [
      'Artificial Flower & Plants',
      'Candles',
      'Chandelives',
      'Decorative Items',
      'Decorative Trays',
      'Indoor Fountains',
      'Lamps',
      'Tissues Boxes',
      'Sculptures',
      'Vases',
      'Flooring',
      'Wall Clocks',
      'Wall Hangings',
      'Wall Lights',
      'Other Decore Items'
    ],
  };