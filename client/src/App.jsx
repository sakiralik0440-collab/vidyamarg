import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./components/LanguageSelect";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const [languageChosen, setLanguageChosen] = useState(
    !!localStorage.getItem("appLanguage")
  );

  if (!languageChosen) {
    return <LanguageSelect onLanguageSelected={() => setLanguageChosen(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
      <h1 className="text-4xl font-bold text-orange-700 mb-4">{t("appName")}</h1>
      <p className="text-lg text-gray-700">Language system working ✅</p>
    </div>
  );
}

export default App;
