

import SearchFilter from '@/components/Cars/Search-Filter';
import CarsGrid from '@/components/Cars/CarsGrid';
import { Suspense } from 'react';

interface Car {
  id: string
  make: string
  model: string
  year: number
  color: string
  category: string
  transmission: string
  fuelType: string
  seats: number
  dailyRate: number
  locationAddress: string
  status: 'available' | 'rented'
  features: string[]
  images: string[]
  isInstantBooking: boolean
}

const CarsShowcasePage = () => {
  const cars = [
    {
      id: "car_12345",
      slug: "toyota-camry-2023-silver",
      vendorId: "vendor_98765",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      color: "Silver",
      licensePlate: "ABC-1234",
      vinNumber: "1HGBH41JXMN109186",
      category: "Sedan",
      transmission: "Automatic",
      fuelType: "Hybrid",
      seats: 5,
      dailyRate: 75.00,
      weeklyRate: 450.00,
      monthlyRate: 1800.00,
      mileageLimitPerDay: 200,
      extraMileageCost: 0.25,
      locationLat: 24.8607,
      locationLng: 67.0011,
      locationAddress: "Karachi, Sindh, Pakistan",
      status: "available",
      features: [
        "Bluetooth",
        "Backup Camera",
        "Lane Departure Warning",
        "Adaptive Cruise Control",
        "Apple CarPlay",
        "Android Auto"
      ],
      images: [
        "https://example.com/images/camry-front.jpg",
        "https://example.com/images/camry-side.jpg",
        "https://example.com/images/camry-interior.jpg"
      ],
      isInstantBooking: true,
      minimumRentalHours: 24,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2025-01-08T14:20:00Z"
    },
    {
      id: "car_23456",
      slug: "honda-civic-2024-black",
      vendorId: "vendor_98765",
      make: "Honda",
      model: "Civic",
      year: 2024,
      color: "Black",
      licensePlate: "XYZ-5678",
      vinNumber: "2HGFC2F59NH123456",
      category: "Sedan",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      dailyRate: 65.00,
      weeklyRate: 390.00,
      monthlyRate: 1560.00,
      mileageLimitPerDay: 180,
      extraMileageCost: 0.20,
      locationLat: 24.8700,
      locationLng: 67.0300,
      locationAddress: "Clifton, Karachi, Sindh, Pakistan",
      status: "available",
      features: [
        "Bluetooth",
        "Sunroof",
        "Apple CarPlay",
        "Cruise Control",
        "USB Ports"
      ],
      images: [
        "https://example.com/images/civic-front.jpg",
        "https://example.com/images/civic-side.jpg"
      ],
      isInstantBooking: true,
      minimumRentalHours: 24,
      createdAt: "2024-02-10T09:15:00Z",
      updatedAt: "2025-01-07T11:45:00Z"
    },
    {
      id: "car_34567",
      slug: "toyota-fortuner-2023-white",
      vendorId: "vendor_54321",
      make: "Toyota",
      model: "Fortuner",
      year: 2023,
      color: "White",
      licensePlate: "DEF-9012",
      vinNumber: "JTMBFREV7KJ123789",
      category: "SUV",
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 7,
      dailyRate: 120.00,
      weeklyRate: 720.00,
      monthlyRate: 2880.00,
      mileageLimitPerDay: 250,
      extraMileageCost: 0.30,
      locationLat: 24.9056,
      locationLng: 67.0822,
      locationAddress: "Gulshan-e-Iqbal, Karachi, Sindh, Pakistan",
      status: "available",
      features: [
        "4WD",
        "Leather Seats",
        "Navigation System",
        "Parking Sensors",
        "Third Row Seating",
        "Bluetooth",
        "Backup Camera"
      ],
      images: [
        "https://example.com/images/fortuner-front.jpg",
        "https://example.com/images/fortuner-side.jpg",
        "https://example.com/images/fortuner-interior.jpg",
        "https://example.com/images/fortuner-back.jpg"
      ],
      isInstantBooking: false,
      minimumRentalHours: 24,
      createdAt: "2024-03-20T13:00:00Z",
      updatedAt: "2025-01-09T08:30:00Z"
    },
    {
      id: "car_45678",
      slug: "suzuki-alto-2022-red",
      vendorId: "vendor_11111",
      make: "Suzuki",
      model: "Alto",
      year: 2022,
      color: "Red",
      licensePlate: "GHI-3456",
      vinNumber: "MA3FD22S600123456",
      category: "Hatchback",
      transmission: "Manual",
      fuelType: "Petrol",
      seats: 4,
      dailyRate: 35.00,
      weeklyRate: 210.00,
      monthlyRate: 840.00,
      mileageLimitPerDay: 150,
      extraMileageCost: 0.15,
      locationLat: 24.9207,
      locationLng: 67.0827,
      locationAddress: "North Nazimabad, Karachi, Sindh, Pakistan",
      status: "available",
      features: [
        "Air Conditioning",
        "Power Steering",
        "USB Port"
      ],
      images: [
        "https://example.com/images/alto-front.jpg",
        "https://example.com/images/alto-side.jpg"
      ],
      isInstantBooking: true,
      minimumRentalHours: 12,
      createdAt: "2024-04-05T07:45:00Z",
      updatedAt: "2025-01-06T16:20:00Z"
    },
    {
      id: "car_56789",
      slug: "kia-sportage-2024-blue",
      vendorId: "vendor_54321",
      make: "Kia",
      model: "Sportage",
      year: 2024,
      color: "Blue",
      licensePlate: "JKL-7890",
      vinNumber: "KNDPM3AC7L7123456",
      category: "SUV",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      dailyRate: 95.00,
      weeklyRate: 570.00,
      monthlyRate: 2280.00,
      mileageLimitPerDay: 220,
      extraMileageCost: 0.28,
      locationLat: 24.8138,
      locationLng: 67.0369,
      locationAddress: "DHA Phase 5, Karachi, Sindh, Pakistan",
      status: "rented",
      features: [
        "Panoramic Sunroof",
        "Heated Seats",
        "Wireless Charging",
        "360 Camera",
        "Lane Keep Assist",
        "Blind Spot Monitor",
        "Apple CarPlay",
        "Android Auto"
      ],
      images: [
        "https://example.com/images/sportage-front.jpg",
        "https://example.com/images/sportage-side.jpg",
        "https://example.com/images/sportage-interior.jpg"
      ],
      isInstantBooking: true,
      minimumRentalHours: 24,
      createdAt: "2024-05-12T11:20:00Z",
      updatedAt: "2025-01-09T09:10:00Z"
    },
    {
      id: "car_67890",
      slug: "hyundai-tucson-2023-grey",
      vendorId: "vendor_22222",
      make: "Hyundai",
      model: "Tucson",
      year: 2023,
      color: "Grey",
      licensePlate: "MNO-2345",
      vinNumber: "5NMJCDAF4LH123456",
      category: "SUV",
      transmission: "Automatic",
      fuelType: "Hybrid",
      seats: 5,
      dailyRate: 85.00,
      weeklyRate: 510.00,
      monthlyRate: 2040.00,
      mileageLimitPerDay: 200,
      extraMileageCost: 0.25,
      locationLat: 24.8700,
      locationLng: 67.0600,
      locationAddress: "Saddar, Karachi, Sindh, Pakistan",
      status: "available",
      features: [
        "Smart Key",
        "Push Start",
        "Rear AC Vents",
        "Touchscreen Display",
        "Bluetooth",
        "USB Ports",
        "Parking Assist"
      ],
      images: [
        "https://example.com/images/tucson-front.jpg",
        "https://example.com/images/tucson-side.jpg",
        "https://example.com/images/tucson-interior.jpg",
        "https://example.com/images/tucson-back.jpg"
      ],
      isInstantBooking: true,
      minimumRentalHours: 24,
      createdAt: "2024-06-18T14:30:00Z",
      updatedAt: "2025-01-08T12:00:00Z"
    }
  ];

  return (
    <Suspense fallback={<div>Loading cars...</div>}>

      <div className="min-h-screen bg-background">
        `{/* Hero Section */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Find Your Perfect Ride
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Browse our premium collection of vehicles available for rent
              </p>
            </div>

            {/* Search and Filter Bar */}
            <SearchFilter />
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Available Vehicles
              </h2>
              <p className="text-muted-foreground mt-1">
                {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} found
              </p>
            </div>
          </div>

          {/* Cars Grid */}
          <CarsGrid cars={cars} />
        </div>
      </div>
    </Suspense>
  );
};

export default CarsShowcasePage;