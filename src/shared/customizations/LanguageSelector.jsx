import { useContext } from 'react';
import SpainFlag from './../../asset/flags/es.svg';
import FranceFlag from './../../asset/flags/fr.svg';
import UKFlag from './../../asset/flags/gb.svg';
import { LanguageContext } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="language-selector">
      <img
        src={SpainFlag}
        alt="Spain"
        className={`flag ${selectedLanguage === 'es' ? 'selected' : ''}`}
        onClick={() => handleLanguageChange('es')}
      />
      <img
        src={FranceFlag}
        alt="France"
        className={`flag ${selectedLanguage === 'fr' ? 'selected' : ''}`}
        onClick={() => handleLanguageChange('fr')}
      />
      <img
        src={UKFlag}
        alt="United Kingdom"
        className={`flag ${selectedLanguage === 'en' ? 'selected' : ''}`}
        onClick={() => handleLanguageChange('en')}
      />
    </div>
  );
};

export default LanguageSelector;
