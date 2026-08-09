/*************************************************
 Send Registration Email
*************************************************/
function sendRegistrationEmail(customer) {

  //------------------------------------------------
  // Security Token
  //------------------------------------------------

  const token =
    generateSecurityToken(customer.customerID);

  //------------------------------------------------
  // Payment Link
  //------------------------------------------------

  const paymentLink =
    CONFIG.WEBAPP_URL +
    "?cid=" +
    encodeURIComponent(customer.customerID) +
    "&t=" +
    encodeURIComponent(token);

  //------------------------------------------------
  // Subject
  //------------------------------------------------

  const subject =
    "Your Customer ID | SAMRAMBA KERALAM 2030";

  //------------------------------------------------
  // HTML Email
  //------------------------------------------------

  const htmlBody = `
  <div style="font-family:Arial,sans-serif;padding:20px;line-height:1.6">

      <h2 style="color:#0B2E6D;">
      Welcome to SAMRAMBA KERALAM 2030
      </h2>

      <p>Dear <b>${customer.name}</b>,</p>

      <p>
      Thank you for registering for the
      <b>SAMRAMBA KERALAM 2030 Entrepreneurship Bundle.</b>
      </p>

      <p>Your Customer ID is:</p>

      <h1 style="color:#16A34A;">
      ${customer.customerID}
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

  //------------------------------------------------
  // Send Email
  //------------------------------------------------

  GmailApp.sendEmail(

    customer.email,

    subject,

    "Your email client doesn't support HTML.",

    {

      htmlBody: htmlBody

    }

  );

  Logger.log(
    "Registration email sent to: " +
    customer.email
  );

}

/*************************************************
 Send Admin Registration Email
*************************************************/
function sendAdminRegistrationEmail(customer) {

  let adminBody = "";

  adminBody += "New Customer Registration\n\n";

  adminBody += "Customer ID : " + customer.customerID + "\n";
  adminBody += "Name : " + customer.name + "\n";
  adminBody += "Email : " + customer.email + "\n";
  adminBody += "Institution : " + customer.institution + "\n";

  adminBody += "\n---------------------------------------\n";

  adminBody +=
    "Registration Source : " +
    (customer.source || "Unknown") +
    "\n";

  adminBody +=
    "Submission Time : " +
    getCurrentDateTime();

  GmailApp.sendEmail(

    CONFIG.ADMIN_EMAIL,

    "New Registration - " + customer.customerID,

    adminBody

  );

  Logger.log(
    "Admin notification sent."
  );

}
