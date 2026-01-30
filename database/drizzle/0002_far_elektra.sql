CREATE TABLE "manifestation" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"protocol" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'received' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "manifestation_protocol_unique" UNIQUE("protocol")
);
--> statement-breakpoint
ALTER TABLE "manifestation" ADD CONSTRAINT "manifestation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;