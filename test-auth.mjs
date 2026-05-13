import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ijjjwhzbffxiqdbdzoeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_NK6Tj8YExi09IYjdfXuUWw_g_LY5kfG";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const randomMobile = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const email = `${randomMobile}@boutify.app`;
  const password = `testpassword123`;
  
  console.log("Attempting Signup for:", email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  console.log("SignUp Error:", signUpError?.message);
  console.log("SignUp Session:", !!signUpData?.session);
  console.log("SignUp User:", signUpData?.user?.id);

  console.log("\nSigning in...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("SignIn Error:", signInError?.message);
  console.log("SignIn Session:", !!signInData?.session);
}

test();
