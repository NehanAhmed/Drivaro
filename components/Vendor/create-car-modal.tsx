'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { IconPlus, IconLoader2, IconCar, IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { toast } from 'sonner';

interface CreateCarFormData {
    vendorId: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    vinNumber: string;
    category: 'economy' | 'comfort' | 'luxury' | 'suv' | 'sports';
    transmission: 'automatic' | 'manual';
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
    seats: number;
    dailyRate: string;
    weeklyRate?: string;
    monthlyRate?: string;
    mileageLimitPerDay: number;
    extraMileageCost: string;
    locationLat?: string;
    locationLng?: string;
    locationAddress?: string;
    features?: string[];
    images?: string[];
    isInstantBooking: boolean;
    minimumRentalHours: number;
}

const CreateCarModal = ({ vendorId }: { vendorId: string }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState<CreateCarFormData>({
        vendorId,
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        licensePlate: '',
        vinNumber: '',
        category: 'economy',
        transmission: 'automatic',
        fuelType: 'petrol',
        seats: 5,
        dailyRate: '',
        weeklyRate: '',
        monthlyRate: '',
        mileageLimitPerDay: 200,
        extraMileageCost: '',
        locationAddress: '',
        images: [],
        isInstantBooking: false,
        minimumRentalHours: 24,
    });

    const handleChange = (field: keyof CreateCarFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return false;
            }
            // Max 5MB per image
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max size is 5MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Add to existing files
        const newFiles = [...imageFiles, ...validFiles];
        setImageFiles(newFiles);

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        // Revoke the object URL to free memory
        URL.revokeObjectURL(imagePreviews[index]);
        
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        
        // Also remove from uploaded URLs if already uploaded
        if (formData.images && formData.images[index]) {
            setFormData(prev => ({
                ...prev,
                images: prev.images?.filter((_, i) => i !== index)
            }));
        }
    };

    const uploadImages = async (): Promise<string[]> => {
        if (imageFiles.length === 0) return [];

        setUploadingImages(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch('/api/vendor/upload-image', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }

                const data = await response.json();
                uploadedUrls.push(data.data);
                
                toast.success(`Uploaded ${file.name}`);
            }

            return uploadedUrls;
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload some images');
            throw error;
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Upload images first
            let imageUrls: string[] = [];
            if (imageFiles.length > 0) {
                imageUrls = await uploadImages();
            }

            // Create car with image URLs
            const carData = {
                ...formData,
                images: imageUrls.length > 0 ? imageUrls : undefined,
            };

            const response = await fetch(`/api/vendor/${vendorId}/car`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create car');
            }

            toast.success("Car Created Successfully!");

            // Reset form
            setOpen(false);
            setCurrentStep(1);
            setImageFiles([]);
            setImagePreviews([]);
            setFormData({
                vendorId,
                make: '',
                model: '',
                year: new Date().getFullYear(),
                color: '',
                licensePlate: '',
                vinNumber: '',
                category: 'economy',
                transmission: 'automatic',
                fuelType: 'petrol',
                seats: 5,
                dailyRate: '',
                weeklyRate: '',
                monthlyRate: '',
                mileageLimitPerDay: 200,
                extraMileageCost: '',
                locationAddress: '',
                images: [],
                isInstantBooking: false,
                minimumRentalHours: 24,
            });

            window.location.reload();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error Creating Car!");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <IconPlus className="w-4 h-4" />
                    Add New Car
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <IconCar className="w-5 h-5" />
                        Add New Car
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new car to your fleet. Step {currentStep} of 4
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Progress Indicator */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base">Basic Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="make">Make *</Label>
                                    <Input
                                        id="make"
                                        placeholder="Toyota"
                                        value={formData.make}
                                        onChange={(e) => handleChange('make', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model">Model *</Label>
                                    <Input
                                        id="model"
                                        placeholder="Corolla"
                                        value={formData.model}
                                        onChange={(e) => handleChange('model', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="year">Year *</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={formData.year}
                                        onChange={(e) => handleChange('year', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="color">Color *</Label>
                                    <Input
                                        id="color"
                                        placeholder="White"
                                        value={formData.color}
                                        onChange={(e) => handleChange('color', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="licensePlate">License Plate *</Label>
                                    <Input
                                        id="licensePlate"
                                        placeholder="ABC-1234"
                                        value={formData.licensePlate}
                                        onChange={(e) => handleChange('licensePlate', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vinNumber">VIN Number *</Label>
                                    <Input
                                        id="vinNumber"
                                        placeholder="17 characters"
                                        maxLength={17}
                                        minLength={17}
                                        value={formData.vinNumber}
                                        onChange={(e) => handleChange('vinNumber', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleChange('category', value)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="economy">Economy</SelectItem>
                                            <SelectItem value="comfort">Comfort</SelectItem>
                                            <SelectItem value="luxury">Luxury</SelectItem>
                                            <SelectItem value="suv">SUV</SelectItem>
                                            <SelectItem value="sports">Sports</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="seats">Seats *</Label>
                                    <Input
                                        id="seats"
                                        type="number"
                                        min="1"
                                        max="15"
                                        value={formData.seats}
                                        onChange={(e) => handleChange('seats', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Specifications */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base">Specifications</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="transmission">Transmission *</Label>
                                    <Select
                                        value={formData.transmission}
                                        onValueChange={(value) => handleChange('transmission', value)}
                                    >
                                        <SelectTrigger id="transmission">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="automatic">Automatic</SelectItem>
                                            <SelectItem value="manual">Manual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fuelType">Fuel Type *</Label>
                                    <Select
                                        value={formData.fuelType}
                                        onValueChange={(value) => handleChange('fuelType', value)}
                                    >
                                        <SelectTrigger id="fuelType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="petrol">Petrol</SelectItem>
                                            <SelectItem value="diesel">Diesel</SelectItem>
                                            <SelectItem value="electric">Electric</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mileageLimitPerDay">Daily Mileage Limit (km) *</Label>
                                    <Input
                                        id="mileageLimitPerDay"
                                        type="number"
                                        min="0"
                                        value={formData.mileageLimitPerDay}
                                        onChange={(e) => handleChange('mileageLimitPerDay', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="extraMileageCost">Extra Mileage Cost ($) *</Label>
                                    <Input
                                        id="extraMileageCost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.50"
                                        value={formData.extraMileageCost}
                                        onChange={(e) => handleChange('extraMileageCost', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minimumRentalHours">Minimum Rental (hours) *</Label>
                                    <Input
                                        id="minimumRentalHours"
                                        type="number"
                                        min="1"
                                        value={formData.minimumRentalHours}
                                        onChange={(e) => handleChange('minimumRentalHours', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="locationAddress">Location Address</Label>
                                    <Textarea
                                        id="locationAddress"
                                        placeholder="123 Main St, City, State"
                                        rows={2}
                                        value={formData.locationAddress}
                                        onChange={(e) => handleChange('locationAddress', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center justify-between col-span-2 p-3 rounded-lg border border-border">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="isInstantBooking" className="text-sm font-medium">
                                            Instant Booking
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow customers to book without approval
                                        </p>
                                    </div>
                                    <Switch
                                        id="isInstantBooking"
                                        checked={formData.isInstantBooking}
                                        onCheckedChange={(checked) => handleChange('isInstantBooking', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Pricing */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base">Pricing</h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dailyRate">Daily Rate ($) *</Label>
                                    <Input
                                        id="dailyRate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="50.00"
                                        value={formData.dailyRate}
                                        onChange={(e) => handleChange('dailyRate', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="weeklyRate">Weekly Rate ($)</Label>
                                    <Input
                                        id="weeklyRate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="300.00"
                                        value={formData.weeklyRate}
                                        onChange={(e) => handleChange('weeklyRate', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Optional discount for weekly rentals</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="monthlyRate">Monthly Rate ($)</Label>
                                    <Input
                                        id="monthlyRate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="1000.00"
                                        value={formData.monthlyRate}
                                        onChange={(e) => handleChange('monthlyRate', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Optional discount for monthly rentals</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                                <h4 className="font-medium text-sm">Pricing Summary</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Daily:</span>
                                        <span className="font-medium">${formData.dailyRate || '0.00'}</span>
                                    </div>
                                    {formData.weeklyRate && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Weekly:</span>
                                            <span className="font-medium">${formData.weeklyRate}</span>
                                        </div>
                                    )}
                                    {formData.monthlyRate && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Monthly:</span>
                                            <span className="font-medium">${formData.monthlyRate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Images */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base">Vehicle Images</h3>
                            
                            <div className="space-y-4">
                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                                    <input
                                        type="file"
                                        id="car-images"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="car-images"
                                        className="flex flex-col items-center justify-center cursor-pointer"
                                    >
                                        <IconUpload className="w-10 h-10 text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium mb-1">Click to upload images</p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, JPEG up to 5MB each
                                        </p>
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Selected Images ({imagePreviews.length})</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <IconX className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {imageFiles[index]?.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Info box */}
                                {imagePreviews.length === 0 && (
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                                        <IconPhoto className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Add vehicle images</p>
                                            <p className="text-xs text-muted-foreground">
                                                Add multiple images to showcase your vehicle. High-quality images help attract more customers.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        {currentStep > 1 && (
                            <Button type="button" variant="outline" onClick={prevStep}>
                                Previous
                            </Button>
                        )}
                        {currentStep < 4 ? (
                            <Button type="button" onClick={nextStep}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading || uploadingImages}>
                                {loading || uploadingImages ? (
                                    <>
                                        <IconLoader2 className="w-4 h-4 animate-spin mr-2" />
                                        {uploadingImages ? 'Uploading Images...' : 'Creating Car...'}
                                    </>
                                ) : (
                                    'Create Car'
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCarModal;  