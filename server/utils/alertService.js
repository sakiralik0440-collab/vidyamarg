const twilio = require("twilio");
const { getTemplate } = require("./alertTemplates");

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Send SMS to a single number
const sendSMS = async (toNumber, message) => {
  try {
    // Format number to E.164 format (+91XXXXXXXXXX for India)
    const formattedNumber = formatPhoneNumber(toNumber);

    const result = await client.messages.create({
      body: message,
      from: TWILIO_NUMBER,
      to: formattedNumber,
    });

    console.log(`✅ SMS sent to ${formattedNumber}: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error(`❌ SMS failed to ${toNumber}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send WhatsApp message to a single number
const sendWhatsApp = async (toNumber, message) => {
  try {
    const formattedNumber = formatPhoneNumber(toNumber);

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_NUMBER}`,
      to: `whatsapp:${formattedNumber}`,
    });

    console.log(`✅ WhatsApp sent to ${formattedNumber}: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error(`❌ WhatsApp failed to ${toNumber}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send alert to ALL family contacts of a student
const sendAlertToFamily = async (familyContacts, alertType, language = "en", templateArgs = [], useWhatsApp = false) => {
  const message = getTemplate(alertType, language, ...templateArgs);

  if (!message) {
    return { success: false, error: "Invalid alert type" };
  }

  const results = [];

  for (const contact of familyContacts) {
    const phoneNumber = contact.phoneNumber;
    if (!phoneNumber) continue;

    let result;
    if (useWhatsApp) {
      result = await sendWhatsApp(phoneNumber, message);
    } else {
      result = await sendSMS(phoneNumber, message);
    }

    results.push({
      contact: contact.name,
      phone: phoneNumber,
      relation: contact.relation,
      ...result,
    });

    // Small delay between messages to avoid rate limiting
    await delay(500);
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(`📱 Alert sent: ${successCount}/${familyContacts.length} successful`);

  return {
    success: true,
    message,
    results,
    successCount,
    totalContacts: familyContacts.length,
  };
};

// Send alert to primary contact only
const sendAlertToPrimary = async (familyContacts, alertType, language = "en", templateArgs = []) => {
  const primaryContact = familyContacts.find((c) => c.isPrimary) || familyContacts[0];

  if (!primaryContact) {
    return { success: false, error: "No primary contact found" };
  }

  const message = getTemplate(alertType, language, ...templateArgs);
  return await sendSMS(primaryContact.phoneNumber, message);
};

// Format Indian phone number to E.164 format
const formatPhoneNumber = (number) => {
  // Remove all non-digits
  const digits = number.replace(/\D/g, "");

  // If already has country code (91XXXXXXXXXX = 12 digits)
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  // If 10 digit Indian number, add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  // Return as-is with + if it has a country code already
  return `+${digits}`;
};

// Small delay helper to avoid rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  sendSMS,
  sendWhatsApp,
  sendAlertToFamily,
  sendAlertToPrimary,
};