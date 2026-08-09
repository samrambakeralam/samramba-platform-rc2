/*************************************************
 SAMRAMBA KERALAM 2030
 Global Configuration
*************************************************/

const CONFIG = {

  //==================================================
  // BRANDING
  //==================================================

  VERSION: "1.0.0",

  APP_NAME: "SAMRAMBA KERALAM 2030",

  PRODUCT_NAME: "SAMRAMBA KERALAM 2030 Entrepreneurship Bundle",

  PRODUCT_PRICE: 499,

  PRODUCT_AMOUNT: 499 * 100,

  CURRENCY: "INR",

  CURRENCY_SYMBOL: "₹",

  TOKEN_EXPIRY_MINUTES: 60,

  SUPPORT_EMAIL: "samrambakerala@gmail.com",

  ADMIN_EMAIL: "samrambakerala@gmail.com",


  //==================================================
  // GOOGLE SPREADSHEET
  //==================================================

  SPREADSHEET_ID: "1uRa_caw-thc4Y4_IXq68gqWQRG22Yv6L-dOwzfD_XVQ",


  //==================================================
  // COLUMN NUMBERS
  //==================================================

  COL_TIMESTAMP: 1,

  COL_CUSTOMER_ID: 2,

  COL_NAME: 3,

  COL_EMAIL: 4,

  COL_INSTITUTION: 5,

  COL_PAYMENT_STATUS: 6,

  COL_PAYMENT_ID: 7,

  COL_PAYMENT_DATE: 8,

  COL_AMOUNT: 9,

  COL_DELIVERY_STATUS: 10,

  COL_DELIVERY_DATE: 11,

  COL_DOWNLOAD_COUNT: 12,

  COL_LAST_DOWNLOAD: 13,

  COL_REMARKS: 14,


  //==================================================
  // GOOGLE DRIVE
  //==================================================

  // Folder containing your bundle
  DRIVE_FOLDER_ID: "1oSls_LvdyqMvIWSMraXJwpXdxahy3kTu",

  // Bundle PDF File ID
  BUNDLE_FILE_ID: "",


  //==================================================
  // WEBSITE
  //==================================================

  WEBSITE_URL: "",


  //==================================================
  // WEB APP
  //==================================================

  WEBAPP_URL: "https://script.google.com/macros/s/AKfycbzQFLeWMQAX7gbedsu859N8nEZnGoAFinj4dn1JgpX0La7GSy-2xGHK38MdjcHM2ckk/exec",


  //==================================================
  // RAZORPAY
  //==================================================

  // SAFE to expose in browser
  RAZORPAY_KEY_ID: "rzp_live_THniJCg6KVKu01",

  // DO NOT STORE YOUR LIVE SECRET HERE
  // We'll store it securely in Script Properties
  RAZORPAY_KEY_SECRET: "",

  // Will be added when we configure Webhooks
  RAZORPAY_WEBHOOK_SECRET: "",

};