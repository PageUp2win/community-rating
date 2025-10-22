import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { code } = req.body;

  const { data, error } = await supabase
    .from("verification_codes")
    .select("code_id, code_hash, status")
    .eq("status", "active");

  if (error) return res.status(500).json({ error: "DB error" });

  for (const row of data) {
    const match = await bcrypt.compare(code, row.code_hash);
    if (match) {
      await supabase
        .from("verification_codes")
        .update({ status: "used", used_at: new Date() })
        .eq("code_id", row.code_id);
      return res.status(200).json({ success: true, codeId: row.code_id });
    }
  }
  return res.status(401).json({ success: false });
}
