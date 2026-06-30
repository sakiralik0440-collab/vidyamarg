import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./components/LanguageSelect";
import StudentRegistrationForm from "./components/StudentRegistrationForm";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const [languageChosen, setLanguageChosen] = useState(
    !!localStorage.getItem("appLanguage")
  );

  if (!languageChosen) {
    return <LanguageSelect onLanguageSelected={() => setLanguageChosen(true)} />;
  }

  return <StudentRegistrationForm />;
}

export default App;
