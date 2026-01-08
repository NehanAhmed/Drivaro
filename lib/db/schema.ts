import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  pgEnum,
  decimal,
  integer,
  jsonb,
  
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum("user_role", ["customer", "vendor", "admin"]);
export const vendorStatusEnum = pgEnum("vendor_status", ["pending", "approved", "suspended", "rejected"]);
export const carCategoryEnum = pgEnum("car_category", ["economy", "comfort", "luxury", "suv", "sports"]);
export const transmissionEnum = pgEnum("transmission", ["automatic", "manual"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "electric", "hybrid"]);
export const carStatusEnum = pgEnum("car_status", ["available", "rented", "maintenance", "inactive"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "active", "completed", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "held", "paid", "refunded"]);
export const documentTypeEnum = pgEnum("document_type", ["drivers_license", "national_id", "proof_of_address"]);
export const documentStatusEnum = pgEnum("document_status", ["pending", "verified", "rejected"]);
export const reportTypeEnum = pgEnum("report_type", ["pre_rental", "post_rental"]);
export const fuelLevelEnum = pgEnum("fuel_level", ["empty", "quarter", "half", "three_quarters", "full"]);
export const blockReasonEnum = pgEnum("block_reason", ["booked", "maintenance", "blocked_by_vendor"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["payment", "refund", "payout", "deposit_hold", "deposit_release"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed"]);

// ============================================
// USERS TABLE (Better Auth merged)
// ============================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  // Better Auth fields
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  // Custom car rental fields
  passwordHash: text("password_hash"),
  fullName: text("full_name"),
  phoneNumber: text("phone_number"),
  role: userRoleEnum("role").default("customer").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("user_email_idx").on(table.email),
  index("user_role_idx").on(table.role),
]);

// ============================================
// BETTER AUTH TABLES
// ============================================

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ============================================
// CAR RENTAL TABLES
// ============================================

export const vendor = pgTable("vendor", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  businessName: text("business_name").notNull(),
  businessLicenseNumber: text("business_license_number").notNull(),
  taxId: text("tax_id").notNull(),
  status: vendorStatusEnum("status").default("pending").notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("10.00"),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).notNull().default("0.00"),
  bankAccountDetails: jsonb("bank_account_details"), // Should be encrypted at application level
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("vendor_userId_idx").on(table.userId),
  index("vendor_status_idx").on(table.status),
]);

export const car = pgTable("car", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendor.id, { onDelete: "cascade" }),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  vinNumber: text("vin_number").notNull(),
  category: carCategoryEnum("category").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  seats: integer("seats").notNull(),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  mileageLimitPerDay: integer("mileage_limit_per_day").notNull(),
  extraMileageCost: decimal("extra_mileage_cost", { precision: 10, scale: 2 }).notNull(),
  locationLat: decimal("location_lat", { precision: 10, scale: 7 }),
  locationLng: decimal("location_lng", { precision: 10, scale: 7 }),
  locationAddress: text("location_address"),
  status: carStatusEnum("status").default("available").notNull(),
  features: jsonb("features"), // Array of strings: ["gps", "bluetooth", "backup_camera"]
  images: jsonb("images"), // Array of URLs
  isInstantBooking: boolean("is_instant_booking").default(false).notNull(),
  minimumRentalHours: integer("minimum_rental_hours").default(24).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("car_vendorId_idx").on(table.vendorId),
  index("car_status_idx").on(table.status),
  index("car_category_idx").on(table.category),
]);

export const booking = pgTable("booking", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingNumber: text("booking_number").notNull().unique(),
  customerId: text("customer_id")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  carId: uuid("car_id")
    .notNull()
    .references(() => car.id, { onDelete: "restrict" }),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendor.id, { onDelete: "restrict" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  totalDays: integer("total_days").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  extraCharges: decimal("extra_charges", { precision: 10, scale: 2 }).default("0.00").notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  paymentIntentId: text("payment_intent_id"),
  cancellationReason: text("cancellation_reason"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("booking_bookingNumber_idx").on(table.bookingNumber),
  index("booking_customerId_idx").on(table.customerId),
  index("booking_carId_idx").on(table.carId),
  index("booking_vendorId_idx").on(table.vendorId),
  index("booking_status_idx").on(table.status),
]);

export const review = pgTable("review", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => booking.id, { onDelete: "cascade" }),
  reviewerId: text("reviewer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  revieweeId: text("reviewee_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("review_bookingId_idx").on(table.bookingId),
  index("review_reviewerId_idx").on(table.reviewerId),
  index("review_revieweeId_idx").on(table.revieweeId),
]);

export const document = pgTable("document", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: documentTypeEnum("type").notNull(),
  documentUrl: text("document_url").notNull(),
  status: documentStatusEnum("status").default("pending").notNull(),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: text("verified_by").references(() => user.id),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("document_userId_idx").on(table.userId),
  index("document_status_idx").on(table.status),
]);

export const damageReport = pgTable("damage_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => booking.id, { onDelete: "cascade" }),
  reportedBy: text("reported_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reportType: reportTypeEnum("report_type").notNull(),
  damages: jsonb("damages"), // Array of {description, severity, images[]}
  odometerReading: integer("odometer_reading").notNull(),
  fuelLevel: fuelLevelEnum("fuel_level").notNull(),
  images: jsonb("images"), // Array of URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("damageReport_bookingId_idx").on(table.bookingId),
  index("damageReport_reportedBy_idx").on(table.reportedBy),
]);

export const availabilityBlock = pgTable("availability_block", {
  id: uuid("id").primaryKey().defaultRandom(),
  carId: uuid("car_id")
    .notNull()
    .references(() => car.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: blockReasonEnum("reason").notNull(),
  bookingId: uuid("booking_id").references(() => booking.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("availabilityBlock_carId_idx").on(table.carId),
  index("availabilityBlock_bookingId_idx").on(table.bookingId),
]);

export const transaction = pgTable("transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => booking.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: transactionStatusEnum("status").default("pending").notNull(),
  paymentMethod: text("payment_method"),
  transactionReference: text("transaction_reference"), // Stripe ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("transaction_bookingId_idx").on(table.bookingId),
  index("transaction_userId_idx").on(table.userId),
  index("transaction_status_idx").on(table.status),
]);

// ============================================
// RELATIONS
// ============================================

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  vendor: one(vendor, {
    fields: [user.id],
    references: [vendor.userId],
  }),
  bookings: many(booking, { relationName: "customerBookings" }),
  reviewsGiven: many(review, { relationName: "reviewsGiven" }),
  reviewsReceived: many(review, { relationName: "reviewsReceived" }),
  documents: many(document),
  damageReports: many(damageReport),
  transactions: many(transaction),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const vendorRelations = relations(vendor, ({ one, many }) => ({
  user: one(user, {
    fields: [vendor.userId],
    references: [user.id],
  }),
  approver: one(user, {
    fields: [vendor.approvedBy],
    references: [user.id],
  }),
  cars: many(car),
  bookings: many(booking),
}));

export const carRelations = relations(car, ({ one, many }) => ({
  vendor: one(vendor, {
    fields: [car.vendorId],
    references: [vendor.id],
  }),
  bookings: many(booking),
  availabilityBlocks: many(availabilityBlock),
}));

export const bookingRelations = relations(booking, ({ one, many }) => ({
  customer: one(user, {
    fields: [booking.customerId],
    references: [user.id],
    relationName: "customerBookings",
  }),
  car: one(car, {
    fields: [booking.carId],
    references: [car.id],
  }),
  vendor: one(vendor, {
    fields: [booking.vendorId],
    references: [vendor.id],
  }),
  reviews: many(review),
  damageReports: many(damageReport),
  availabilityBlocks: many(availabilityBlock),
  transactions: many(transaction),
}));

export const reviewRelations = relations(review, ({ one }) => ({
  booking: one(booking, {
    fields: [review.bookingId],
    references: [booking.id],
  }),
  reviewer: one(user, {
    fields: [review.reviewerId],
    references: [user.id],
    relationName: "reviewsGiven",
  }),
  reviewee: one(user, {
    fields: [review.revieweeId],
    references: [user.id],
    relationName: "reviewsReceived",
  }),
}));

export const documentRelations = relations(document, ({ one }) => ({
  user: one(user, {
    fields: [document.userId],
    references: [user.id],
  }),
  verifier: one(user, {
    fields: [document.verifiedBy],
    references: [user.id],
  }),
}));

export const damageReportRelations = relations(damageReport, ({ one }) => ({
  booking: one(booking, {
    fields: [damageReport.bookingId],
    references: [booking.id],
  }),
  reporter: one(user, {
    fields: [damageReport.reportedBy],
    references: [user.id],
  }),
}));

export const availabilityBlockRelations = relations(availabilityBlock, ({ one }) => ({
  car: one(car, {
    fields: [availabilityBlock.carId],
    references: [car.id],
  }),
  booking: one(booking, {
    fields: [availabilityBlock.bookingId],
    references: [booking.id],
  }),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  booking: one(booking, {
    fields: [transaction.bookingId],
    references: [booking.id],
  }),
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
}));