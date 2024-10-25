import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function handler(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    console.error("Body:", body); // Log the body
    console.error("Headers:", {
      svix_id,
      svix_timestamp,
      svix_signature,
    }); // Log the headers
    return NextResponse.json("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    try {
      const user = await prisma.user.create({
        data: {
          id: id, // Using Clerk's user ID
          email: email_addresses[0].email_address,
          username: username || email_addresses[0].email_address.split("@")[0],
          fullname: `${first_name || ""} ${last_name || ""}`.trim(),
          avatar: image_url,
          settings: {
            create: {
              // Create default settings for new user
              theme: "light",
              language: "en",
              emailNotifications: true,
              pushNotifications: true,
            },
          },
        },
      });

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json("Error creating user", { status: 500 });
    }
  }

  return NextResponse.json("", { status: 200 });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
