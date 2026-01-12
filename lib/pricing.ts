import { differenceInDays } from 'date-fns';

export interface PricingCalculation {
    basePrice: number;
    discount: number;
    tax: number;
    commission: number;
    depositAmount: number;
    totalAmount: number;
    vendorEarnings: number;
    totalDays: number;
}

export function calculateBookingPrice(
    dailyRate: number,
    weeklyRate: number | null,
    monthlyRate: number | null,
    startDate: Date,
    endDate: Date,
    commissionRate: number = 15 // 15% default
): PricingCalculation {
    const rawDays = differenceInDays(endDate, startDate);
    const totalDays = rawDays <= 0 ? 1 : rawDays;
    let basePrice = 0;

    // Apply weekly/monthly rates if applicable
    if (totalDays >= 30 && monthlyRate) {
        basePrice = monthlyRate;
    } else if (totalDays >= 7 && weeklyRate) {
        const weeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        basePrice = (weeks * weeklyRate) + (remainingDays * dailyRate);
    } else {
        basePrice = totalDays * dailyRate;
    }

    // Apply discounts
    let discount = 0;
    if (totalDays >= 30) {
        discount = basePrice * 0.2; // 20% for monthly
    } else if (totalDays >= 7) {
        discount = basePrice * 0.1; // 10% for weekly
    }

    const subtotal = basePrice - discount;

    // Calculate tax (5%)
    const tax = subtotal * 0.05;

    // Calculate commission
    const commission = subtotal * (commissionRate / 100);

    // Total amount (customer pays)
    const totalAmount = subtotal + tax;

    // Security deposit (20% of total or min $200)
    const depositAmount = Math.max(totalAmount * 0.2, 200);

    // Vendor earnings (subtotal minus commission)
    const vendorEarnings = subtotal - commission;

    return {
        basePrice: Number(basePrice.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        commission: Number(commission.toFixed(2)),
        depositAmount: Number(depositAmount.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        vendorEarnings: Number(vendorEarnings.toFixed(2)),
        totalDays,
    };
}