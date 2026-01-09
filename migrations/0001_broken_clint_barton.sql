ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "car" ADD CONSTRAINT "car_slug_unique" UNIQUE("slug");