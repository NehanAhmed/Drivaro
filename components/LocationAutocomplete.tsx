'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Location {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface LocationAutocompleteProps {
  value?: string;
  onChange?: (location: Location | null) => void;
  onLocationSelect?: (location: Location) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  name?: string;
  id?: string;
}

export default function LocationAutocomplete({
  value = '',
  onChange,
  onLocationSelect,
  placeholder = 'Enter address or location...',
  className = '',
  label,
  required = false,
  error,
  name,
  id,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputIdRef = useRef<string>(id || `location-input-${Math.random().toString(36).substr(2, 9)}`);
  const inputId = inputIdRef.current;

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch suggestions from Nominatim (OpenStreetMap)
  const fetchSuggestions = async (searchQuery: string): Promise<void> => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(searchQuery)}&` +
        `addressdetails=1&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CarPickupApp/1.0'
          }
        }
      );

      if (response.ok) {
        const data: Location[] = await response.json();
        setSuggestions(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelectLocation = (location: Location): void => {
    setSelectedLocation(location);
    setQuery(location.display_name);
    setShowDropdown(false);
    setSuggestions([]);
    
    // Call callbacks
    onChange?.(location);
    onLocationSelect?.(location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedLocation(null);
    onChange?.(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('autocomplete-container space-y-2', className)}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={inputId}
          name={name}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          required={required}
          className={cn(
            'pr-10',
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && selectedLocation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              onClick={() => handleSelectLocation(location)}
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-none border-b border-border last:border-b-0 focus-visible:bg-accent focus-visible:text-accent-foreground"
            >
              <div className="flex items-start w-full">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm text-popover-foreground">
                  {location.display_name}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && !isLoading && query.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg p-3 text-center text-sm text-muted-foreground">
          No locations found. Try a different search.
        </div>
      )}
    </div>
  );
}

// Example usage component
export function ExampleForm() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [errors, setErrors] = useState<{ pickup?: string; dropoff?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const newErrors: { pickup?: string; dropoff?: string } = {};
    
    if (!pickupLocation) {
      newErrors.pickup = 'Please select a pickup location';
    }
    if (!dropoffLocation) {
      newErrors.dropoff = 'Please select a dropoff location';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    console.log('Form submitted:', {
      pickup: {
        address: pickupLocation?.display_name,
        lat: pickupLocation?.lat,
        lon: pickupLocation?.lon
      },
      dropoff: {
        address: dropoffLocation?.display_name,
        lat: dropoffLocation?.lat,
        lon: dropoffLocation?.lon
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Car Rental Booking</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <LocationAutocomplete
          label="Pickup Location"
          placeholder="Enter pickup address..."
          required
          name="pickup"
          onChange={(location) => {
            setPickupLocation(location);
            setErrors((prev) => ({ ...prev, pickup: undefined }));
          }}
          error={errors.pickup}
        />

        <LocationAutocomplete
          label="Dropoff Location"
          placeholder="Enter dropoff address..."
          required
          name="dropoff"
          onChange={(location) => {
            setDropoffLocation(location);
            setErrors((prev) => ({ ...prev, dropoff: undefined }));
          }}
          error={errors.dropoff}
        />

        <Button type="submit" className="w-full">
          Book Now
        </Button>

        {/* Display selected locations */}
        {(pickupLocation || dropoffLocation) && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 text-foreground">Selected Locations:</h3>
            {pickupLocation && (
              <div className="text-sm mb-2 text-muted-foreground">
                <span className="font-medium text-foreground">Pickup:</span> {pickupLocation.display_name}
              </div>
            )}
            {dropoffLocation && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Dropoff:</span> {dropoffLocation.display_name}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}