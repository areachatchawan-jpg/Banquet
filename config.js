const APP_CONFIG = {
  supabaseUrl: "https://gufnisizabudxeqqviet.supabase.co",
  supabaseAnonKey: "sb_publishable_xw4diCn3g-WNMvJJXz_22A_Y6wk9a4W",
  beoFunctionUrl: ""
};

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase === "undefined") {
    console.error("Supabase library is not loaded.");
    return null;
  }

  try {
    supabaseClient = supabase.createClient(
      APP_CONFIG.supabaseUrl,
      APP_CONFIG.supabaseAnonKey
    );

    console.log("Supabase connected.");
    return supabaseClient;

  } catch (error) {
    console.error("Supabase initialization failed:", error);
    return null;
  }
}

window.APP_CONFIG = APP_CONFIG;
window.initSupabase = initSupabase;
window.supabaseClient = supabaseClient;
