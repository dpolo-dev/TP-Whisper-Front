import { useContext } from "react";
import SpainFlag from "./../../asset/flags/es.svg";
import FranceFlag from "./../../asset/flags/fr.svg";
import UKFlag from "./../../asset/flags/gb.svg";
import { LanguageContext } from "../../context/LanguageContext";

const flags = [
  { src: SpainFlag, alt: "Spain", code: "es" },
  { src: FranceFlag, alt: "France", code: "fr" },
  { src: UKFlag, alt: "United Kingdom", code: "en" },
];

const FlagSelector = ({ currentLanguage, onSelect }) => {
  return flags.map((flag) => (
    <img
      key={flag.code}
      src={flag.src}
      alt={flag.alt}
      className={`flag ${currentLanguage === flag.code ? "selected" : ""}`}
      onClick={() => onSelect(flag.code)}
    />
  ));
};

const LanguageSelector = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    targetLanguage,
    setTargetLanguage,
  } = useContext(LanguageContext);

  return (
    <div className="language-selectors">
      <div className="language-selector">
        <span>Select Source Language:</span>
        <FlagSelector
          currentLanguage={selectedLanguage}
          onSelect={setSelectedLanguage}
        />
      </div>
      <div className="language-selector">
        <span>Select Target Language:</span>
        <FlagSelector
          currentLanguage={targetLanguage}
          onSelect={setTargetLanguage}
        />
      </div>
    </div>
  );
};

export default LanguageSelector;
