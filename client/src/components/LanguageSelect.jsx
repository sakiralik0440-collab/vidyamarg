import { useTranslation } from "react-i18next";

function LanguageSelect({ onLanguageSelected }) {
  const { i18n } = useTranslation();

  const selectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("appLanguage", langCode);
    onLanguageSelected();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-8">
        Select Your Language / अपनी भाषा चुनें
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => selectLanguage("en")}
          className="bg-green-700 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-800 transition"
        >
          English
        </button>
        <button
          onClick={() => selectLanguage("hi")}
          className="bg-green-700 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-800 transition"
        >
          हिंदी
        </button>
      </div>
    </div>
  );
}

export default LanguageSelect;