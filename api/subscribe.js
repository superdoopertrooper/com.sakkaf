import { createClient } from "@supabase/supabase-js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const email = String(req.body?.email ?? "")
    .trim()
    .toLowerCase();

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase
    .from("mailing_list_subscribers")
    .insert({ email });

  if (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "This email is already on the list." });
    }

    console.error("mailing list insert failed:", error);
    return res.status(500).json({ error: "Could not subscribe. Please try again." });
  }

  return res.status(201).json({ ok: true });
}
