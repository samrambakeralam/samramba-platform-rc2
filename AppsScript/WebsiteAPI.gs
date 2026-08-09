/*************************************************
 SAMRAMBA KERALAM 2030
 Website Registration API
*************************************************/

/*************************************************
DEPRECATED

Used during GitHub fetch() testing.

Retained for reference only.

Not used in Version 1.0.
*************************************************/

function registerStudent(formData) {

  try {

    Logger.log("===== WEBSITE REGISTRATION =====");
    Logger.log(JSON.stringify(formData));

    // Basic Validation
    if (!formData.name || !formData.email || !formData.institution) {

      return {
        success: false,
        message: "Please fill all required fields."
      };

    }

    //------------------------------------------------
    // TODO
    // In the next step we will:
    // 1. Generate Customer ID
    // 2. Save to the correct Institution Sheet
    // 3. Generate Security Token
    // 4. Return Payment URL
    //------------------------------------------------

    return {

      success: true,

      message: "Validation Successful",

      data: formData

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


function doPost(e) {

  try {

    const action = (e.parameter.action || "").trim();

    //------------------------------------------------
    // REGISTER
    //------------------------------------------------

    if (action === "register") {

      const formData = {

        name: (e.parameter.name || "").trim(),

        email: (e.parameter.email || "").trim(),

        institution: (e.parameter.institution || "").trim()

      };

      Logger.log("===== REGISTER REQUEST =====");
      Logger.log(JSON.stringify(formData));

      const result = processRegistration(formData);

      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);

    }

    //------------------------------------------------
    // VERIFY PAYMENT
    //------------------------------------------------

    if (action === "verifyPayment") {

      const paymentData = {

        customerID: (e.parameter.customerID || "").trim(),

        razorpay_payment_id:
          (e.parameter.razorpay_payment_id || "").trim(),

        razorpay_order_id:
          (e.parameter.razorpay_order_id || "").trim(),

        razorpay_signature:
          (e.parameter.razorpay_signature || "").trim()

      };

      Logger.log("===== VERIFY PAYMENT =====");
      Logger.log(JSON.stringify(paymentData));

      const result = verifyPayment(paymentData);

      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);

    }

    //------------------------------------------------
    // INVALID ACTION
    //------------------------------------------------

    return ContentService
      .createTextOutput(JSON.stringify({

        success: false,

        message: "Invalid action."

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

  catch (err) {

    Logger.log(err);

    return ContentService
      .createTextOutput(JSON.stringify({

        success: false,

        message: err.toString()

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

}