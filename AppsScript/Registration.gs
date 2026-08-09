/*************************************************
 SAMRAMBA KERALAM 2030
 Registration.gs
 Customer Registration & Email Notification
*************************************************/

function onFormSubmit(e) {

  // Make sure this was triggered by a Google Form
  if (!e || !e.range) {
    throw new Error("This function must be triggered by a Google Form submission.");
  }

  const sheet = SpreadsheetApp
  .openById(CONFIG.SPREADSHEET_ID)
  .getSheetByName(e.range.getSheet().getName());
  const row = e.range.getRow();

  //==================================================
  // Columns
  //==================================================

  const CUSTOMERID_COL = CONFIG.COL_CUSTOMER_ID;
  const NAME_COL = CONFIG.COL_NAME;
  const EMAIL_COL = CONFIG.COL_EMAIL;
  const INSTITUTION_COL = CONFIG.COL_INSTITUTION;
  const STATUS_COL = CONFIG.COL_PAYMENT_STATUS;

  //==================================================
  // Customer Details
  //==================================================

  const name = sheet.getRange(row, NAME_COL).getValue();
  const email = sheet.getRange(row, EMAIL_COL).getValue();
  const institution = sheet.getRange(row, INSTITUTION_COL).getValue();

  //==================================================
  // Generate Customer ID
  //==================================================

  const customerID = generateCustomerID();

  // Save Customer ID

  sheet.getRange(row, CUSTOMERID_COL).setValue(customerID);

  // Payment Status

  sheet.getRange(row, STATUS_COL).setValue("Pending");

  //==================================================
  // Generate Secure Token
  //==================================================

  const token = generateSecurityToken(customerID);

  //==================================================
  // Payment Page Link
  //==================================================

  const paymentLink =
    CONFIG.WEBAPP_URL +
    "?cid=" +
    encodeURIComponent(customerID) +
    "&t=" +
    encodeURIComponent(token);

  //==================================================
  // Customer Email
  //==================================================

  const subject = "Your Customer ID | SAMRAMBA KERALAM 2030";

  const htmlBody = `
  <div style="font-family:Arial,sans-serif;padding:20px;line-height:1.6">

      <h2 style="color:#0B2E6D;">
      Welcome to SAMRAMBA KERALAM 2030
      </h2>

      <p>Dear <b>${name}</b>,</p>

      <p>
      Thank you for registering for the
      <b>SAMRAMBA KERALAM 2030 Entrepreneurship Bundle.</b>
      </p>

      <p>Your Customer ID is:</p>

      <h1 style="color:#16A34A;">
      ${customerID}
      </h1>

      <p>
      Please keep this Customer ID for future reference.
      </p>

      <br>

      <a href="${paymentLink}"
      style="
      background:#16A34A;
      color:#ffffff;
      padding:15px 28px;
      text-decoration:none;
      border-radius:8px;
      font-size:18px;
      display:inline-block;">
      Pay ₹${CONFIG.PRODUCT_PRICE}
      </a>

      <br><br>

      <p>
      After successful payment, your bundle will be delivered automatically.
      </p>

      <hr>

      <p>
      Regards,<br>
      <b>SAMRAMBA KERALAM 2030</b><br>
      ${CONFIG.SUPPORT_EMAIL}
      </p>

  </div>
  `;

  GmailApp.sendEmail(
    email,
    subject,
    "Your email client doesn't support HTML.",
    {
      htmlBody: htmlBody
    }
  );

  //==================================================
  // Admin Email
  //==================================================

  let adminBody = "";

  adminBody += "New Customer Registration\n\n";

  adminBody += "Customer ID : " + customerID + "\n";
  adminBody += "Name : " + name + "\n";
  adminBody += "Email : " + email + "\n";
  adminBody += "Institution : " + institution + "\n";

  adminBody += "\n---------------------------------------\n\n";

  const responses = e.namedValues;

  for (const question in responses) {

    adminBody +=
      question +
      " : " +
      responses[question].join(", ") +
      "\n";

  }

  adminBody += "\n---------------------------------------\n";
  adminBody += "Submission Time : " + getCurrentDateTime();

  GmailApp.sendEmail(
    CONFIG.ADMIN_EMAIL,
    "New Registration - " + customerID,
    adminBody
  );

}


/*************************************************
 Generate Sequential Customer ID
*************************************************/
function generateCustomerID() {

  const lock = LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    const props = PropertiesService.getScriptProperties();

    let lastNumber = props.getProperty("LAST_CUSTOMER_NUMBER");

    if (lastNumber == null) {
      lastNumber = 0;
    }

    lastNumber = Number(lastNumber) + 1;

    props.setProperty(
      "LAST_CUSTOMER_NUMBER",
      lastNumber
    );

    const year = new Date().getFullYear();

    return "SK-" +
           year +
           "-" +
           Utilities.formatString("%05d", lastNumber);

  }

  finally {

    lock.releaseLock();

  }

}

/*************************************************
 Master Registration Function
 Used by:
 1. Google Form
 2. Register.html
*************************************************/
function processRegistration(data) {

  try {

    Logger.log("====================================");
    Logger.log("MASTER REGISTRATION");
    Logger.log(JSON.stringify(data));

    //------------------------------------------------
    // Validation
    //------------------------------------------------

    if (!data.name || data.name.trim() === "") {

      return {

        success: false,

        message: "Name is required."

      };

    }

    if (!data.email || data.email.trim() === "") {

      return {

        success: false,

        message: "Email is required."

      };

    }

    if (!data.institution || data.institution.trim() === "") {

      return {

        success: false,

        message: "Institution is required."

      };

    }

    //------------------------------------------------
// Validation Passed
//------------------------------------------------

Logger.log("Validation Successful");

//-----------------------------------------------
// Open Spreadsheet
//-----------------------------------------------

const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

//-----------------------------------------------
// Find Institution Sheet
//-----------------------------------------------

const sheet = ss.getSheetByName(data.institution);

if (!sheet) {

  return {

    success: false,

    message: "Institution sheet not found."

  };

}

//-----------------------------------------------
// Generate Customer ID
//-----------------------------------------------

const customerID = generateCustomerID();

Logger.log("Customer ID : " + customerID);

//-----------------------------------------------
// Write New Row
//-----------------------------------------------

sheet.appendRow([
  new Date(),
  customerID,
  data.name,
  data.email,
  data.institution,
  "Pending"
]);

const row = sheet.getLastRow();

Logger.log(
  "Customer saved to " +
  sheet.getName() +
  " at row " +
  row
);

//-----------------------------------------------
// Create Razorpay Order
//-----------------------------------------------

const order = createRazorpayOrder(customerID);

Logger.log("Razorpay Order Created");
Logger.log(order.id);

//-----------------------------------------------
// Return
//-----------------------------------------------

return {

  success: true,

  message: "Registration Successful",

  customerID: customerID,

  razorpay: {

    key: CONFIG.RAZORPAY_KEY_ID,

    orderID: order.id,

    amount: order.amount,

    currency: order.currency

  }

};

}

catch(err){

  Logger.log(err);

  return {

    success:false,

    message:err.toString()

  };

}

}