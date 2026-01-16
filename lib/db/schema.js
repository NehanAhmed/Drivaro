"use strict";
exports.__esModule = true;
exports.transactionRelations = exports.availabilityBlockRelations = exports.damageReportRelations = exports.documentRelations = exports.reviewRelations = exports.bookingRelations = exports.carRelations = exports.vendorRelations = exports.accountRelations = exports.sessionRelations = exports.userRelations = exports.transaction = exports.availabilityBlock = exports.damageReport = exports.document = exports.review = exports.booking = exports.car = exports.vendor = exports.verification = exports.account = exports.session = exports.user = exports.transactionStatusEnum = exports.transactionTypeEnum = exports.blockReasonEnum = exports.fuelLevelEnum = exports.reportTypeEnum = exports.documentStatusEnum = exports.documentTypeEnum = exports.paymentStatusEnum = exports.bookingStatusEnum = exports.carStatusEnum = exports.fuelTypeEnum = exports.transmissionEnum = exports.carCategoryEnum = exports.vendorStatusEnum = exports.userRoleEnum = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
// ============================================
// ENUMS
// ============================================
exports.userRoleEnum = (0, pg_core_1.pgEnum)("user_role", ["customer", "vendor", "admin"]);
exports.vendorStatusEnum = (0, pg_core_1.pgEnum)("vendor_status", ["pending", "approved", "suspended", "rejected"]);
exports.carCategoryEnum = (0, pg_core_1.pgEnum)("car_category", ["economy", "comfort", "luxury", "suv", "sports"]);
exports.transmissionEnum = (0, pg_core_1.pgEnum)("transmission", ["automatic", "manual"]);
exports.fuelTypeEnum = (0, pg_core_1.pgEnum)("fuel_type", ["petrol", "diesel", "electric", "hybrid"]);
exports.carStatusEnum = (0, pg_core_1.pgEnum)("car_status", ["available", "rented", "maintenance", "inactive"]);
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)("booking_status", ["pending", "confirmed", "active", "completed", "cancelled"]);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)("payment_status", ["pending", "held", "paid", "refunded"]);
exports.documentTypeEnum = (0, pg_core_1.pgEnum)("document_type", ["drivers_license", "national_id", "proof_of_address"]);
exports.documentStatusEnum = (0, pg_core_1.pgEnum)("document_status", ["pending", "verified", "rejected"]);
exports.reportTypeEnum = (0, pg_core_1.pgEnum)("report_type", ["pre_rental", "post_rental"]);
exports.fuelLevelEnum = (0, pg_core_1.pgEnum)("fuel_level", ["empty", "quarter", "half", "three_quarters", "full"]);
exports.blockReasonEnum = (0, pg_core_1.pgEnum)("block_reason", ["booked", "maintenance", "blocked_by_vendor"]);
exports.transactionTypeEnum = (0, pg_core_1.pgEnum)("transaction_type", ["payment", "refund", "payout", "deposit_hold", "deposit_release"]);
exports.transactionStatusEnum = (0, pg_core_1.pgEnum)("transaction_status", ["pending", "completed", "failed"]);
// ============================================
// USERS TABLE (Better Auth merged)
// ============================================
exports.user = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    // Better Auth fields
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    emailVerified: (0, pg_core_1.boolean)("email_verified")["default"](false).notNull(),
    image: (0, pg_core_1.text)("image"),
    // Custom car rental fields
    passwordHash: (0, pg_core_1.text)("password_hash"),
    fullName: (0, pg_core_1.text)("full_name"),
    phoneNumber: (0, pg_core_1.text)("phone_number"),
    role: (0, exports.userRoleEnum)("role")["default"]("customer").notNull(),
    isVerified: (0, pg_core_1.boolean)("is_verified")["default"](false).notNull(),
    profileImageUrl: (0, pg_core_1.text)("profile_image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull()
}, function (table) { return [
    (0, pg_core_1.index)("user_email_idx").on(table.email),
    (0, pg_core_1.index)("user_role_idx").on(table.role),
]; });
// ============================================
// BETTER AUTH TABLES
// ============================================
exports.session = (0, pg_core_1.pgTable)("session", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    token: (0, pg_core_1.text)("token").notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull(),
    ipAddress: (0, pg_core_1.text)("ip_address"),
    userAgent: (0, pg_core_1.text)("user_agent"),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" })
}, function (table) { return [(0, pg_core_1.index)("session_userId_idx").on(table.userId)]; });
exports.account = (0, pg_core_1.pgTable)("account", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    accountId: (0, pg_core_1.text)("account_id").notNull(),
    providerId: (0, pg_core_1.text)("provider_id").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    accessToken: (0, pg_core_1.text)("access_token"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    idToken: (0, pg_core_1.text)("id_token"),
    accessTokenExpiresAt: (0, pg_core_1.timestamp)("access_token_expires_at"),
    refreshTokenExpiresAt: (0, pg_core_1.timestamp)("refresh_token_expires_at"),
    scope: (0, pg_core_1.text)("scope"),
    password: (0, pg_core_1.text)("password"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull()
}, function (table) { return [(0, pg_core_1.index)("account_userId_idx").on(table.userId)]; });
exports.verification = (0, pg_core_1.pgTable)("verification", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    identifier: (0, pg_core_1.text)("identifier").notNull(),
    value: (0, pg_core_1.text)("value").notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull()
}, function (table) { return [(0, pg_core_1.index)("verification_identifier_idx").on(table.identifier)]; });
// ============================================
// CAR RENTAL TABLES
// ============================================
exports.vendor = (0, pg_core_1.pgTable)("vendor", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" })
        .unique(),
    businessName: (0, pg_core_1.text)("business_name").notNull(),
    businessLicenseNumber: (0, pg_core_1.text)("business_license_number").notNull(),
    taxId: (0, pg_core_1.text)("tax_id").notNull(),
    status: (0, exports.vendorStatusEnum)("status")["default"]("pending").notNull(),
    commissionRate: (0, pg_core_1.decimal)("commission_rate", { precision: 5, scale: 2 }).notNull()["default"]("10.00"),
    totalEarnings: (0, pg_core_1.decimal)("total_earnings", { precision: 12, scale: 2 }).notNull()["default"]("0.00"),
    bankAccountDetails: (0, pg_core_1.jsonb)("bank_account_details"),
    approvedAt: (0, pg_core_1.timestamp)("approved_at"),
    approvedBy: (0, pg_core_1.text)("approved_by").references(function () { return exports.user.id; }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull()
}, function (table) { return [
    (0, pg_core_1.index)("vendor_userId_idx").on(table.userId),
    (0, pg_core_1.index)("vendor_status_idx").on(table.status),
]; });
exports.car = (0, pg_core_1.pgTable)("car", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    vendorId: (0, pg_core_1.uuid)("vendor_id")
        .notNull()
        .references(function () { return exports.vendor.id; }, { onDelete: "cascade" }),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    make: (0, pg_core_1.text)("make").notNull(),
    model: (0, pg_core_1.text)("model").notNull(),
    year: (0, pg_core_1.integer)("year").notNull(),
    color: (0, pg_core_1.text)("color").notNull(),
    licensePlate: (0, pg_core_1.text)("license_plate").notNull().unique(),
    vinNumber: (0, pg_core_1.text)("vin_number").notNull(),
    category: (0, exports.carCategoryEnum)("category").notNull(),
    transmission: (0, exports.transmissionEnum)("transmission").notNull(),
    fuelType: (0, exports.fuelTypeEnum)("fuel_type").notNull(),
    seats: (0, pg_core_1.integer)("seats").notNull(),
    dailyRate: (0, pg_core_1.decimal)("daily_rate", { precision: 10, scale: 2 }).notNull(),
    weeklyRate: (0, pg_core_1.decimal)("weekly_rate", { precision: 10, scale: 2 }),
    monthlyRate: (0, pg_core_1.decimal)("monthly_rate", { precision: 10, scale: 2 }),
    mileageLimitPerDay: (0, pg_core_1.integer)("mileage_limit_per_day").notNull(),
    extraMileageCost: (0, pg_core_1.decimal)("extra_mileage_cost", { precision: 10, scale: 2 }).notNull(),
    locationLat: (0, pg_core_1.decimal)("location_lat", { precision: 10, scale: 7 }),
    locationLng: (0, pg_core_1.decimal)("location_lng", { precision: 10, scale: 7 }),
    locationAddress: (0, pg_core_1.text)("location_address"),
    status: (0, exports.carStatusEnum)("status")["default"]("available").notNull(),
    features: (0, pg_core_1.jsonb)('features').$type(),
    images: (0, pg_core_1.jsonb)('images').$type(),
    isInstantBooking: (0, pg_core_1.boolean)("is_instant_booking")["default"](false).notNull(),
    minimumRentalHours: (0, pg_core_1.integer)("minimum_rental_hours")["default"](24).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull()
}, function (table) { return [
    (0, pg_core_1.index)("car_vendorId_idx").on(table.vendorId),
    (0, pg_core_1.index)("car_status_idx").on(table.status),
    (0, pg_core_1.index)("car_category_idx").on(table.category),
]; });
exports.booking = (0, pg_core_1.pgTable)("booking", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    bookingNumber: (0, pg_core_1.text)("booking_number").notNull().unique(),
    customerId: (0, pg_core_1.text)("customer_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "restrict" }),
    carId: (0, pg_core_1.uuid)("car_id")
        .notNull()
        .references(function () { return exports.car.id; }, { onDelete: "restrict" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id")
        .notNull()
        .references(function () { return exports.vendor.id; }, { onDelete: "restrict" }),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    pickupLocation: (0, pg_core_1.text)("pickup_location").notNull(),
    dropoffLocation: (0, pg_core_1.text)("dropoff_location").notNull(),
    totalDays: (0, pg_core_1.integer)("total_days").notNull(),
    basePrice: (0, pg_core_1.decimal)("base_price", { precision: 10, scale: 2 }).notNull(),
    extraCharges: (0, pg_core_1.decimal)("extra_charges", { precision: 10, scale: 2 })["default"]("0.00").notNull(),
    discount: (0, pg_core_1.decimal)("discount", { precision: 10, scale: 2 })["default"]("0.00").notNull(),
    tax: (0, pg_core_1.decimal)("tax", { precision: 10, scale: 2 }).notNull(),
    commission: (0, pg_core_1.decimal)("commission", { precision: 10, scale: 2 }).notNull(),
    totalAmount: (0, pg_core_1.decimal)("total_amount", { precision: 10, scale: 2 }).notNull(),
    depositAmount: (0, pg_core_1.decimal)("deposit_amount", { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.bookingStatusEnum)("status")["default"]("pending").notNull(),
    paymentStatus: (0, exports.paymentStatusEnum)("payment_status")["default"]("pending").notNull(),
    paymentIntentId: (0, pg_core_1.text)("payment_intent_id"),
    cancellationReason: (0, pg_core_1.text)("cancellation_reason"),
    cancelledAt: (0, pg_core_1.timestamp)("cancelled_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { return new Date(); })
        .notNull()
}, function (table) { return [
    (0, pg_core_1.index)("booking_bookingNumber_idx").on(table.bookingNumber),
    (0, pg_core_1.index)("booking_customerId_idx").on(table.customerId),
    (0, pg_core_1.index)("booking_carId_idx").on(table.carId),
    (0, pg_core_1.index)("booking_vendorId_idx").on(table.vendorId),
    (0, pg_core_1.index)("booking_status_idx").on(table.status),
]; });
exports.review = (0, pg_core_1.pgTable)("review", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)("booking_id")
        .notNull()
        .references(function () { return exports.booking.id; }, { onDelete: "cascade" }),
    reviewerId: (0, pg_core_1.text)("reviewer_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    revieweeId: (0, pg_core_1.text)("reviewee_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    comment: (0, pg_core_1.text)("comment"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
}, function (table) { return [
    (0, pg_core_1.index)("review_bookingId_idx").on(table.bookingId),
    (0, pg_core_1.index)("review_reviewerId_idx").on(table.reviewerId),
    (0, pg_core_1.index)("review_revieweeId_idx").on(table.revieweeId),
]; });
exports.document = (0, pg_core_1.pgTable)("document", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    type: (0, exports.documentTypeEnum)("type").notNull(),
    documentUrl: (0, pg_core_1.text)("document_url").notNull(),
    status: (0, exports.documentStatusEnum)("status")["default"]("pending").notNull(),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
    verifiedBy: (0, pg_core_1.text)("verified_by").references(function () { return exports.user.id; }),
    expiryDate: (0, pg_core_1.timestamp)("expiry_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
}, function (table) { return [
    (0, pg_core_1.index)("document_userId_idx").on(table.userId),
    (0, pg_core_1.index)("document_status_idx").on(table.status),
]; });
exports.damageReport = (0, pg_core_1.pgTable)("damage_report", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)("booking_id")
        .notNull()
        .references(function () { return exports.booking.id; }, { onDelete: "cascade" }),
    reportedBy: (0, pg_core_1.text)("reported_by")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    reportType: (0, exports.reportTypeEnum)("report_type").notNull(),
    damages: (0, pg_core_1.jsonb)("damages"),
    odometerReading: (0, pg_core_1.integer)("odometer_reading").notNull(),
    fuelLevel: (0, exports.fuelLevelEnum)("fuel_level").notNull(),
    images: (0, pg_core_1.jsonb)("images"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
}, function (table) { return [
    (0, pg_core_1.index)("damageReport_bookingId_idx").on(table.bookingId),
    (0, pg_core_1.index)("damageReport_reportedBy_idx").on(table.reportedBy),
]; });
exports.availabilityBlock = (0, pg_core_1.pgTable)("availability_block", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    carId: (0, pg_core_1.uuid)("car_id")
        .notNull()
        .references(function () { return exports.car.id; }, { onDelete: "cascade" }),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    reason: (0, exports.blockReasonEnum)("reason").notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(function () { return exports.booking.id; }, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
}, function (table) { return [
    (0, pg_core_1.index)("availabilityBlock_carId_idx").on(table.carId),
    (0, pg_core_1.index)("availabilityBlock_bookingId_idx").on(table.bookingId),
]; });
exports.transaction = (0, pg_core_1.pgTable)("transaction", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    bookingId: (0, pg_core_1.uuid)("booking_id")
        .notNull()
        .references(function () { return exports.booking.id; }, { onDelete: "cascade" }),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    type: (0, exports.transactionTypeEnum)("type").notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    status: (0, exports.transactionStatusEnum)("status")["default"]("pending").notNull(),
    paymentMethod: (0, pg_core_1.text)("payment_method"),
    transactionReference: (0, pg_core_1.text)("transaction_reference"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull()
}, function (table) { return [
    (0, pg_core_1.index)("transaction_bookingId_idx").on(table.bookingId),
    (0, pg_core_1.index)("transaction_userId_idx").on(table.userId),
    (0, pg_core_1.index)("transaction_status_idx").on(table.status),
]; });
// ============================================
// RELATIONS
// ============================================
exports.userRelations = (0, drizzle_orm_1.relations)(exports.user, function (_a) {
    var many = _a.many, one = _a.one;
    return ({
        sessions: many(exports.session),
        accounts: many(exports.account),
        vendor: one(exports.vendor, {
            fields: [exports.user.id],
            references: [exports.vendor.userId]
        }),
        bookings: many(exports.booking, { relationName: "customerBookings" }),
        reviewsGiven: many(exports.review, { relationName: "reviewsGiven" }),
        reviewsReceived: many(exports.review, { relationName: "reviewsReceived" }),
        documents: many(exports.document),
        damageReports: many(exports.damageReport),
        transactions: many(exports.transaction)
    });
});
exports.sessionRelations = (0, drizzle_orm_1.relations)(exports.session, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.user, {
            fields: [exports.session.userId],
            references: [exports.user.id]
        })
    });
});
exports.accountRelations = (0, drizzle_orm_1.relations)(exports.account, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.user, {
            fields: [exports.account.userId],
            references: [exports.user.id]
        })
    });
});
exports.vendorRelations = (0, drizzle_orm_1.relations)(exports.vendor, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(exports.user, {
            fields: [exports.vendor.userId],
            references: [exports.user.id]
        }),
        approver: one(exports.user, {
            fields: [exports.vendor.approvedBy],
            references: [exports.user.id]
        }),
        cars: many(exports.car),
        bookings: many(exports.booking)
    });
});
exports.carRelations = (0, drizzle_orm_1.relations)(exports.car, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        vendor: one(exports.vendor, {
            fields: [exports.car.vendorId],
            references: [exports.vendor.id]
        }),
        bookings: many(exports.booking),
        availabilityBlocks: many(exports.availabilityBlock)
    });
});
exports.bookingRelations = (0, drizzle_orm_1.relations)(exports.booking, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        customer: one(exports.user, {
            fields: [exports.booking.customerId],
            references: [exports.user.id],
            relationName: "customerBookings"
        }),
        car: one(exports.car, {
            fields: [exports.booking.carId],
            references: [exports.car.id]
        }),
        vendor: one(exports.vendor, {
            fields: [exports.booking.vendorId],
            references: [exports.vendor.id]
        }),
        reviews: many(exports.review),
        damageReports: many(exports.damageReport),
        availabilityBlocks: many(exports.availabilityBlock),
        transactions: many(exports.transaction)
    });
});
exports.reviewRelations = (0, drizzle_orm_1.relations)(exports.review, function (_a) {
    var one = _a.one;
    return ({
        booking: one(exports.booking, {
            fields: [exports.review.bookingId],
            references: [exports.booking.id]
        }),
        reviewer: one(exports.user, {
            fields: [exports.review.reviewerId],
            references: [exports.user.id],
            relationName: "reviewsGiven"
        }),
        reviewee: one(exports.user, {
            fields: [exports.review.revieweeId],
            references: [exports.user.id],
            relationName: "reviewsReceived"
        })
    });
});
exports.documentRelations = (0, drizzle_orm_1.relations)(exports.document, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.user, {
            fields: [exports.document.userId],
            references: [exports.user.id]
        }),
        verifier: one(exports.user, {
            fields: [exports.document.verifiedBy],
            references: [exports.user.id]
        })
    });
});
exports.damageReportRelations = (0, drizzle_orm_1.relations)(exports.damageReport, function (_a) {
    var one = _a.one;
    return ({
        booking: one(exports.booking, {
            fields: [exports.damageReport.bookingId],
            references: [exports.booking.id]
        }),
        reporter: one(exports.user, {
            fields: [exports.damageReport.reportedBy],
            references: [exports.user.id]
        })
    });
});
exports.availabilityBlockRelations = (0, drizzle_orm_1.relations)(exports.availabilityBlock, function (_a) {
    var one = _a.one;
    return ({
        car: one(exports.car, {
            fields: [exports.availabilityBlock.carId],
            references: [exports.car.id]
        }),
        booking: one(exports.booking, {
            fields: [exports.availabilityBlock.bookingId],
            references: [exports.booking.id]
        })
    });
});
exports.transactionRelations = (0, drizzle_orm_1.relations)(exports.transaction, function (_a) {
    var one = _a.one;
    return ({
        booking: one(exports.booking, {
            fields: [exports.transaction.bookingId],
            references: [exports.booking.id]
        }),
        user: one(exports.user, {
            fields: [exports.transaction.userId],
            references: [exports.user.id]
        })
    });
});
