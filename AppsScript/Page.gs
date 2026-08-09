/*************************************************
 SAMRAMBA KERALAM 2030
 Page Renderer
*************************************************/

/**
 * Registration Page
 */
function showRegisterPage(e) {

  const template =
    HtmlService.createTemplateFromFile("Register");

  template.config = CONFIG;
  template.institution = e.parameter.institution || "";

  return template
    .evaluate()
    .setTitle("Student Registration")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


/**
 * Success Page
 */
function showSuccessPage(e) {

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


/**
 * Failure Page
 */
function showFailurePage(e) {

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


/**
 * Payment Page
 */
function showPaymentPage(e) {

  const customerID =
    (e.parameter.cid || "").trim();

  const token =
    (e.parameter.t || "").trim();

  if (!customerID) {

    return HtmlService
      .createHtmlOutput("<h2>Customer ID Missing</h2>");

  }

  if (!validateSecurityToken(customerID, token)) {

    return HtmlService
      .createHtmlOutput("<h2>Invalid Security Token</h2>");

  }

  const customer =
    getCustomer(customerID);

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