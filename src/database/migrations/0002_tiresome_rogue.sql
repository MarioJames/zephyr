ALTER TABLE "customer_sessions" ADD COLUMN "chat_config" jsonb;--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "customer_type";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "province";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "customer_sessions" DROP COLUMN "district";