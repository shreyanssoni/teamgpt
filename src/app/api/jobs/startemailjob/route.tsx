import { Client } from "@upstash/qstash";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN,
});

export async function POST(request: Request) {
  const body = await request.json();
  const users = body.users;
  const emailtype = body.emailtype; 
  // If you know the public URL of the email API, you can use it directly
  const emailAPIURL = `${process.env.DOMAIN}/api/jobs/sendemail`; // ie: https://yourapp.com/api/send-email

  // Tell QStash to start the background job.
  // For proper error handling, refer to the quick start.
  await qstashClient.publishJSON({
    url: emailAPIURL,
    body: {
      users, emailtype
    }
  });

  return new Response("Job started", { status: 200 });
}

