import { test } from "node:test";
import assert from "node:assert/strict";
import { supabaseProjectUrl } from "../lib/supabase";

// The dashboard's Data API page shows the REST endpoint, `https://<ref>.supabase.co/rest/v1/`,
// and that is what gets pasted into SUPABASE_URL. supabase-js appends `/rest/v1` itself, so the
// suffix has to go or every query is sent to `/rest/v1/rest/v1/...`.
test("the Supabase project URL is the bare origin whatever form it was pasted in", () => {
  const origin = "https://hmebdyusnxlxxvbujdyl.supabase.co";
  for (const pasted of [origin, `${origin}/`, `${origin}/rest/v1`, `${origin}/rest/v1/`, `  ${origin}/rest/v1/  `])
    assert.equal(supabaseProjectUrl(pasted), origin, pasted);
});
