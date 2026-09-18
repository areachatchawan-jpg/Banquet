/* ===================================================================
   ตั้งค่าระบบ Banquet & Event
   แก้ไฟล์นี้ไฟล์เดียว ไม่ต้องแตะ index.html
   =================================================================== */

const APP_CONFIG = {

  /* --- 1. จำเป็น: จาก Supabase -> Project Settings -> API --- */
  supabaseUrl:     "ใส่ Project URL ตรงนี้",        // เช่น https://abcdefgh.supabase.co
  supabaseAnonKey: "ใส่ anon public key ตรงนี้",    // ขึ้นต้นด้วย eyJ...

  /* --- 2. ไม่บังคับ: ตัวอ่าน BEO จากรูปด้วย AI ---
     ใส่ทีหลังได้ ถ้าเว้นว่างไว้ ปุ่ม "อ่านงานใหม่จากรูป BEO" จะไม่ขึ้น
     ค่านี้ได้จาก Supabase -> Edge Functions -> beo-read -> URL
     หน้าตาประมาณ https://abcdefgh.supabase.co/functions/v1/beo-read   */
  beoFunctionUrl:  ""

};
