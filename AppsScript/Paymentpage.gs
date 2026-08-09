/*************************************************
 SAMRAMBA KERALAM 2030
 Payment Page Controller
*************************************************/

function doGet_Backup(e) {

//------------------------------------------------
// Registration Page
//------------------------------------------------

if (e.parameter.page == "register") {

  const template =
    HtmlService.createTemplateFromFile("Register");

  template.config = CONFIG;

  template.institution =
    e.parameter.institution || "";

  return template
    .evaluate()
    .setTitle("Student Registration")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


  //----------------------------------------------
// Production Payment UI
//----------------------------------------------

if (e.parameter.page == "payment") {
  return showPaymentUI(e);
}

  //------------------------------------------------
  // Success Page
  //------------------------------------------------

  if (e.parameter.success == "1") {

    const template =
      HtmlService.createTemplateFromFile("Success");

    if (e.parameter.cid) {
      template.customer = getCustomer(e.parameter.cid);
    }

    template.config = CONFIG;

    return template
      .evaluate()
      .setTitle("Payment Successful")
      .setXFrameOptionsMode(
        HtmlService.XFrameOptionsMode.ALLOWALL
      );
  }

  //------------------------------------------------
  // Failure Page
  //------------------------------------------------

  if (e.parameter.failed == "1") {

    const template =
      HtmlService.createTemplateFromFile("Failure");

    if (e.parameter.cid) {
      template.customer = getCustomer(e.parameter.cid);
    }

    template.config = CONFIG;

    return template
      .evaluate()
      .setTitle("Payment Failed")
      .setXFrameOptionsMode(
        HtmlService.XFrameOptionsMode.ALLOWALL
      );
  }

  //------------------------------------------------
  // Payment Page
  //------------------------------------------------

  const customerID = (e.parameter.cid || "").trim();
  const token = (e.parameter.t || "").trim();

  if (!customerID) {
    return HtmlService
      .createHtmlOutput("<h2>Customer ID Missing</h2>");
  }

  if (!validateSecurityToken(customerID, token)) {
    return HtmlService
      .createHtmlOutput("<h2>Invalid Security Token</h2>");
  }

  const customer = getCustomer(customerID);

  if (!customer) {
    return HtmlService
      .createHtmlOutput("<h2>Customer Not Found</h2>");
  }

  const template =
    HtmlService.createTemplateFromFile("Payment Page");

  template.customer = customer;
  template.config = CONFIG;

  return template
    .evaluate()
    .setTitle(CONFIG.APP_NAME)
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


/*************************************************
 Customer Lookup API
*************************************************/

function getCustomerAPI(customerID) {

  try {

    customerID = (customerID || "").trim();

    const customer = getCustomer(customerID);

    if (!customer) {

      return {
        success: false,
        message: "Customer not found"
      };

    }

    return {

      success: true,

      customerID: customer.customerID,

      name: customer.name,

      email: customer.email,

      institution: customer.institution

    };

  }

  catch(err){

    return {

      success:false,

      message: err.toString()

    };

  }

}


/*************************************************
 Include HTML Files
*************************************************/

function include(filename) {

  const html = HtmlService.createTemplateFromFile(filename);

  return html.evaluate().getContent();

}