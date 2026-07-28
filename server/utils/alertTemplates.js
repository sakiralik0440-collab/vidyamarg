// All message templates in English and Hindi
// {name} = student name, {class} = class name, {deadline} = date

const templates = {
  // Dropout risk alert
  dropoutRisk: {
    en: (studentName) =>
      `[VidyaMarg] ALERT: ${studentName} has not updated their academic record for over 6 months. Please check if they are continuing their studies. Contact school immediately.`,
    hi: (studentName) =>
      `[VidyaMarg] सूचना: ${studentName} ने 6 महीने से अपना शैक्षणिक रिकॉर्ड अपडेट नहीं किया है। कृपया जांचें कि वे पढ़ाई जारी रख रहे हैं या नहीं।`,
  },

  // Dropout confirmed
  dropoutConfirmed: {
    en: (studentName) =>
      `[VidyaMarg] URGENT: ${studentName} has been marked as dropout due to 12+ months of inactivity. Please contact them immediately to help them return to education.`,
    hi: (studentName) =>
      `[VidyaMarg] जरूरी: ${studentName} को 12 महीने से अधिक की निष्क्रियता के कारण ड्रॉपआउट चिह्नित किया गया है। कृपया तुरंत संपर्क करें।`,
  },

  // Admission deadline reminder
  admissionDeadline: {
    en: (studentName, collegeName, deadline) =>
      `[VidyaMarg] REMINDER: ${studentName}'s admission deadline for ${collegeName} is on ${deadline}. Please complete the application immediately.`,
    hi: (studentName, collegeName, deadline) =>
      `[VidyaMarg] याद दिलाना: ${studentName} के लिए ${collegeName} में प्रवेश की अंतिम तिथि ${deadline} है। कृपया तुरंत आवेदन पूरा करें।`,
  },

  // Result/success alert
  resultSuccess: {
    en: (studentName, className, marks) =>
      `[VidyaMarg] CONGRATULATIONS! ${studentName} has passed ${className} with ${marks}% marks. Great achievement! Keep it up.`,
    hi: (studentName, className, marks) =>
      `[VidyaMarg] बधाई हो! ${studentName} ने ${className} में ${marks}% अंकों के साथ उत्तीर्ण किया है। शानदार उपलब्धि!`,
  },

  // Interview/job opportunity
  jobOpportunity: {
    en: (studentName, companyName, position) =>
      `[VidyaMarg] OPPORTUNITY: ${studentName} has received an interview call from ${companyName} for ${position}. Please respond immediately via the VidyaMarg app.`,
    hi: (studentName, companyName, position) =>
      `[VidyaMarg] अवसर: ${studentName} को ${companyName} से ${position} के लिए साक्षात्कार कॉल मिली है। कृपया तुरंत VidyaMarg ऐप के माध्यम से जवाब दें।`,
  },

  // Custom message (teacher sends manually)
  custom: {
    en: (studentName, message) =>
      `[VidyaMarg] Message about ${studentName}: ${message}`,
    hi: (studentName, message) =>
      `[VidyaMarg] ${studentName} के बारे में संदेश: ${message}`,
  },
};

const getTemplate = (type, language = "en", ...args) => {
  const template = templates[type];
  if (!template) return null;
  const langTemplate = template[language] || template.en;
  return langTemplate(...args);
};

module.exports = { templates, getTemplate };