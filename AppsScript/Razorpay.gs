/*************************************************
 SAMRAMBA KERALAM 2030
 Razorpay Integration
*************************************************/


/**
 * Test Internet Connection
 */
function testInternetConnection() {

  const response = UrlFetchApp.fetch(
    "https://www.google.com"
  );

  Logger.log(response.getResponseCode());

}


/**
 * Create Razorpay Order
 */
function createRazorpayOrder(customerID) {

  Logger.log("====================================");
  Logger.log("Creating Razorpay Order");
  Logger.log("Customer ID : " + customerID);

  const customer = getCustomer(customerID);

  if (!customer) {
    throw new Error("Customer not found.");
  }

  //------------------------------------------------
  // Prevent Duplicate Payment
  //------------------------------------------------

  if (customer.paymentStatus === "Paid") {
    throw new Error("Payment has already been completed.");
  }

  //------------------------------------------------
  // Get Secret from Script Properties
  //------------------------------------------------

  const secret = PropertiesService
    .getScriptProperties()
    .getProperty("RAZORPAY_KEY_SECRET");

  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET not configured.");
  }

  //------------------------------------------------
  // Authentication
  //------------------------------------------------

  const auth = Utilities.base64Encode(
    CONFIG.RAZORPAY_KEY_ID + ":" + secret
  );

  //------------------------------------------------
  // Order Payload
  //------------------------------------------------

  const payload = {

    amount: CONFIG.PRODUCT_AMOUNT,

    currency: CONFIG.CURRENCY,

    receipt: customer.customerID,

    notes: {

      customerID: customer.customerID,

      customerName: customer.name,

      customerEmail: customer.email

    }

  };

  //------------------------------------------------
  // Request Options
  //------------------------------------------------

  const options = {

    method: "post",

    contentType: "application/json",

    headers: {
      Authorization: "Basic " + auth
    },

    payload: JSON.stringify(payload),

    muteHttpExceptions: true

  };

  //------------------------------------------------
  // API Call
  //------------------------------------------------

  const response = UrlFetchApp.fetch(

    "https://api.razorpay.com/v1/orders",

    options

  );

  Logger.log("HTTP Code : " + response.getResponseCode());

  Logger.log(response.getContentText());

  //------------------------------------------------
  // Parse Response
  //------------------------------------------------

  const result = JSON.parse(response.getContentText());

  const code = response.getResponseCode();

  if (code != 200 && code != 201) {

    throw new Error(

      result.error && result.error.description

        ? result.error.description

        : "Unable to create Razorpay order."

    );

  }

  Logger.log("Order Created Successfully");

  Logger.log("Order ID : " + result.id);

  return result;

}


/**
 * Test Order Creation
 */
function testCreateOrder() {

  const CUSTOMER_ID = "SK-2026-00048";   // Replace with an unpaid customer ID

  const order = createRazorpayOrder(CUSTOMER_ID);

  Logger.log(JSON.stringify(order, null, 2));

}


/**
 * Create Razorpay Order for Browser
 * Called from Script.html
 */
function createPaymentOrder(customerID) {

  Logger.log("================================");
  Logger.log("createPaymentOrder()");
  Logger.log("Received customerID = [" + customerID + "]");
  Logger.log("Type = " + typeof customerID);

  const order = createRazorpayOrder(customerID);

  const customer = getCustomer(customerID);

  return {

    success: true,

    key: CONFIG.RAZORPAY_KEY_ID,

    orderId: order.id,

    amount: order.amount,

    currency: order.currency,

    customerID: customer.customerID,

    name: customer.name,

    email: customer.email,

    institution: customer.institution

  };

}


/**
 * Test Browser Order
 */
function testCreatePaymentOrder() {

  const result = createPaymentOrder("SK-2026-00049");

  Logger.log(JSON.stringify(result, null, 2));

}


/*************************************************
 Verify Razorpay Payment
*************************************************/
function verifyPayment(paymentData) {

  try {

    Logger.log("====================================");
    Logger.log("Verifying Razorpay Payment");

    //------------------------------------------------
    // Read Secret
    //------------------------------------------------

    const secret = PropertiesService
      .getScriptProperties()
      .getProperty("RAZORPAY_KEY_SECRET");

    if (!secret) {
      throw new Error("RAZORPAY_KEY_SECRET not configured.");
    }

    //------------------------------------------------
    // Generate Expected Signature
    //------------------------------------------------

    const body =
      paymentData.razorpay_order_id +
      "|" +
      paymentData.razorpay_payment_id;

    const hash = Utilities.computeHmacSha256Signature(
      body,
      secret
    );

    const expectedSignature = bytesToHex(hash);

    //------------------------------------------------
    // Verify Signature
    //------------------------------------------------

    if (expectedSignature !== paymentData.razorpay_signature) {

      Logger.log("Signature Verification FAILED");

      return {

        success: false,

        message: "Invalid Payment Signature"

      };

    }

    Logger.log("Signature Verified");

    //------------------------------------------------
   // Update Spreadsheet
   //------------------------------------------------

    completePayment(

    paymentData.customerID,

    paymentData.razorpay_payment_id,

    CONFIG.PRODUCT_PRICE

);

   //------------------------------------------------
// Grant Folder Access
//------------------------------------------------

const customer = getCustomer(paymentData.customerID);

grantFolderAccess(customer.email);

//------------------------------------------------
// Send Bundle Email
//------------------------------------------------

sendBundleEmail(paymentData.customerID);
  
    //------------------------------------------------
    // Success
    //------------------------------------------------

    return {

      success: true,

      message: "Payment Verified Successfully"

    };

  }

  catch (err) {

    Logger.log(err);

    return {

      success: false,

      message: err.toString()

    };

  }

}