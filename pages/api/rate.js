import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { raterId, targetId, rating } = req.body;

  if (raterId === targetId) return res.status(400).json({ error: "Cannot rate yourself" });
  if (rating < 1 || rating > 10) return res.status(400).json({ error: "Invalid rating" });

  const now = new Date();
  await supabase
    .from("ratings")
    .upsert({ rater_code_id: raterId, target_code_id: targetId, rating_value: rating, updated_at: now });

  res.status(200).json({ success: true });
}
