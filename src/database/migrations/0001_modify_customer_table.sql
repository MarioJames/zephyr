ALTER TABLE "customer_sessions" ADD COLUMN "work" text;--> statement-breakpoint
ALTER TABLE "customer_sessions" ADD COLUMN "is_single" boolean;--> statement-breakpoint
ALTER TABLE "customer_sessions" ADD COLUMN "family_situation" text;--> statement-breakpoint
ALTER TABLE "customer_sessions" ADD COLUMN "hobby" text;--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "wechat";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "company";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "industry";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "scale";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "address";