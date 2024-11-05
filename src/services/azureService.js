import {
  regionSpeech,
  subscriptionKeySpeech,
  subscriptionKeyTranslation,
  regionTranslation,
} from "../../general-config";

const transcribeAudio = async (audioFile, language) => {
  const transcriptionUrl = `https://${regionSpeech}.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-05-15-preview`;
  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append(
    "definition",
    JSON.stringify({
      locales: [{ en: "en-US", es: "es-ES", fr: "fr-FR" }[language] || "en-US"],
      profanityFilterMode: "Masked",
      channels: [0, 1],
    })
  );

  const response = await fetch(transcriptionUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKeySpeech,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Transcription failed");

  const data = await response.json();
  return data.combinedPhrases[0]?.text ?? "";
};

const translateText = async (text, targetLanguage) => {
  const translationUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`;
  const response = await fetch(translationUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKeyTranslation,
      "Ocp-Apim-Subscription-Region": regionTranslation,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ Text: text }]),
  });

  if (!response.ok) throw new Error("Translation failed");

  const data = await response.json();
  return data[0].translations[0]?.text ?? "";
};

export const transcribeAndTranslateAudio = async (
  audioFile,
  language = "es",
  targetLanguage = "en"
) => {
  try {
    const transcribedText = await transcribeAudio(audioFile, language);
    const translatedText = await translateText(transcribedText, targetLanguage);
    return translatedText;
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
};
