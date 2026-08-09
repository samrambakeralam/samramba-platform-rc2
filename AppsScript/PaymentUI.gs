/*************************************************
 SAMRAMBA KERALAM 2030
 Production Payment UI
*************************************************/

function showPaymentUI(e) {

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
      HtmlService.createTemplateFromFile("PaymentUI");

  template.customer = customer;
  template.config = CONFIG;

  return template
      .evaluate()
      .setTitle(CONFIG.APP_NAME)
      .setXFrameOptionsMode(
          HtmlService.XFrameOptionsMode.ALLOWALL
      );

}
