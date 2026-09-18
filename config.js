/* ===================================================================
   ตั้งค่าระบบ Banquet & Event
   แก้ไฟล์นี้ไฟล์เดียว ไม่ต้องแตะ index.html
   =================================================================== */

const APP_CONFIG = {

  /* --- 1. จำเป็น: จาก Supabase -> Project Settings -> API --- */
  supabaseUrl:  "https://gunfisisabudxeqxqiet.supabase.co",
  supabaseAnonKey: "sb_publishable_xw4diCn3g-WNMvJJXz_22A_Y6wk9a4W",

  /* --- 2. ไม่บังคับ: ตัวอ่าน BEO จากรูปด้วย AI ---
     ใส่ทีหลังได้ ถ้าเว้นว่างไว้ ปุ่ม "อ่านงานใหม่จากรูป BEO" จะไม่ขึ้น
     ค่านี้ได้จาก Supabase -> Edge Functions -> beo-read -> URL
     หน้าตาประมาณ https://abcdefgh.supabase.co/functions/v1/beo-read   */
  beoFunctionUrl:  ""

};
