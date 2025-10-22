import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { adminId } = req.body;

  const bytes = crypto.getRandomValues(new Uint8Array(9));
  const rawCode = Array.from(bytes)
    .map(b => (b % 36).toString(36))
    .join('')
    .toUpperCase()
    .match(/.{1,4}/g)
    .join('-');

  const hash = await bcrypt.hash(rawCode, 12);
  await supabase.from('verification_codes').insert({
    code_hash: hash,
    generated_by_admin_id: adminId
  });

  res.status(200).json({ code: rawCode });
}
