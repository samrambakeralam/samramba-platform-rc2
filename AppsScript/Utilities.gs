/*************************************************
 SAMRAMBA KERALA 2030
 Utility Functions
*************************************************/


/**
 * Generate Secure Token
 * Used in Payment Page URL
 */
function generateSecurityToken(customerID) {

  const secret = PropertiesService
      .getScriptProperties()
      .getProperty("TOKEN_SECRET");

  const signature = Utilities.computeHmacSha256Signature(
    customerID,
    secret
  );

  return Utilities.base64EncodeWebSafe(signature);
}


/**
 * Validate Security Token
 */
function validateSecurityToken(customerID, token) {

  const expected = generateSecurityToken(customerID);

  return expected === token;
}


/**
 * Find Customer Row by Customer ID
 * Searches ALL sheets automatically
 */
function findCustomer(customerID) {

  Logger.log("====================================");
  Logger.log("findCustomer() START");
  Logger.log("Received Customer ID = [" + customerID + "]");
  Logger.log("Type = " + typeof customerID);

  if (!customerID) {
    Logger.log("ERROR: customerID is empty or undefined.");
    return null;
  }

  // Always open the spreadsheet by ID
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  Logger.log("Spreadsheet = " + ss.getName());

  const sheets = ss.getSheets();

  for (let i = 0; i < sheets.length; i++) {

    const sheet = sheets[i];

    Logger.log("------------------------------------");
    Logger.log("Checking Sheet : " + sheet.getName());

    const values = sheet.getDataRange().getValues();

    Logger.log("Rows : " + values.length);

    for (let r = 1; r < values.length; r++) {

      const id = String(values[r][CONFIG.COL_CUSTOMER_ID - 1]).trim();

      if (r < 5) {
        Logger.log("Row " + (r + 1) + " -> [" + id + "]");
      }

      if (id === String(customerID).trim()) {

        Logger.log("CUSTOMER FOUND");
        Logger.log("Sheet : " + sheet.getName());
        Logger.log("Row : " + (r + 1));

        return {
          sheet: sheet,
          row: r + 1
        };

      }

    }

  }

  Logger.log("CUSTOMER NOT FOUND");

  return null;

}


/**
 * Get Customer Details
 */
function getCustomer(customerID) {

  const result = findCustomer(customerID);

  if (!result) {

    Logger.log("getCustomer() returned NULL");

    return null;

  }

  const sheet = result.sheet;
  const row = result.row;

  Logger.log("Loading Customer Details from Row : " + row);

  return {

    sheet: sheet,

    row: row,

    customerID: customerID,

    name: sheet.getRange(row, CONFIG.COL_NAME).getValue(),

    email: sheet.getRange(row, CONFIG.COL_EMAIL).getValue(),

    institution: sheet.getRange(row, CONFIG.COL_INSTITUTION).getValue(),

    paymentStatus: sheet.getRange(row, CONFIG.COL_PAYMENT_STATUS).getValue()

  };

}


/**
 * Update Payment Status
 */
function updatePaymentStatus(customerID, status) {

  const result = findCustomer(customerID);

  if (!result) return;

  result.sheet
        .getRange(result.row, CONFIG.COL_PAYMENT_STATUS)
        .setValue(status);

}


/**
 * Update Delivery Status
 */
function updateDeliveryStatus(customerID, status) {

  const result = findCustomer(customerID);

  if (!result) return;

  result.sheet
        .getRange(result.row, CONFIG.COL_DELIVERY_STATUS)
        .setValue(status);

}


/**
 * Current Date & Time
 */
function getCurrentDateTime() {

  return Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd-MM-yyyy HH:mm:ss"
  );

}

/*************************************************
 DEBUG - Check Spreadsheet
*************************************************/
function checkSpreadsheet() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  Logger.log("====================================");
  Logger.log("Spreadsheet Name : " + ss.getName());
  Logger.log("Spreadsheet ID   : " + ss.getId());
  Logger.log("====================================");

  const sheets = ss.getSheets();

  sheets.forEach(function(sheet) {
    Logger.log("Sheet : " + sheet.getName());
  });

}


function showSheetNames() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  ss.getSheets().forEach(sheet => {

    Logger.log("[" + sheet.getName() + "]");

  });

}


function testFindCustomer() {

  const customerID = "SK-2026-00035";

  Logger.log("TEST FUNCTION CUSTOMER ID = " + customerID);

  const result = findCustomer(customerID);

  Logger.log("RESULT = " + JSON.stringify(result));

}


/*************************************************
 Complete Payment
*************************************************/
function completePayment(customerID, paymentID, amount) {

  const result = findCustomer(customerID);

  if (!result) {
    throw new Error("Customer not found.");
  }

  const sheet = result.sheet;
  const row = result.row;

  const now = getCurrentDateTime();

  // Payment Details
  sheet.getRange(row, CONFIG.COL_PAYMENT_STATUS).setValue("Paid");
  sheet.getRange(row, CONFIG.COL_PAYMENT_ID).setValue(paymentID);
  sheet.getRange(row, CONFIG.COL_PAYMENT_DATE).setValue(now);
  sheet.getRange(row, CONFIG.COL_AMOUNT).setValue(amount);

  // Library Access
  sheet.getRange(row, CONFIG.COL_DELIVERY_STATUS).setValue("Active");
  sheet.getRange(row, CONFIG.COL_DELIVERY_DATE).setValue(now);

  Logger.log("====================================");
  Logger.log("Payment Completed");
  Logger.log("Customer : " + customerID);
  Logger.log("Payment ID : " + paymentID);
  Logger.log("Amount : " + amount);
  Logger.log("Access Activated");

  return true;

}


/*************************************************
 Convert Byte Array to Hex String
*************************************************/
function bytesToHex(bytes) {

  return bytes.map(function(byte) {

    const value = (byte < 0) ? byte + 256 : byte;

    return ("0" + value.toString(16)).slice(-2);

  }).join("");

}


/*************************************************
 Grant Folder Access
*************************************************/
function grantFolderAccess(customerEmail) {

  const folder =
    DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);

  const viewers = folder.getViewers();

  const exists = viewers.some(function(user) {

    return user.getEmail().toLowerCase() ===
           customerEmail.toLowerCase();

  });

  if (!exists) {

    folder.addViewer(customerEmail);

    Logger.log("Folder access granted to: " + customerEmail);

  } else {

    Logger.log("Folder access already exists.");

  }

}