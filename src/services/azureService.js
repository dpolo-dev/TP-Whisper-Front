import {
  regionSpeech,
  subscriptionKeySpeech,
  subscriptionKeyTranslation,
  regionTranslation,
} from "../../general-config";

export const transcribeAndTranslateAudio = async (
  audioFile,
  language = "es",
  targetLanguage = "en"
) => {
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

  const transcriptionResponse = await fetch(transcriptionUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKeySpeech,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!transcriptionResponse.ok) throw new Error("Transcription failed");
  const transcribedText = (await transcriptionResponse.json())
    .combinedPhrases[0].text;

  try {
    const translationResponse = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKeyTranslation,
          "Ocp-Apim-Subscription-Region": regionTranslation,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: transcribedText }]),
      }
    );

    if (!translationResponse.ok) throw new Error("Translation failed");
    const translatedText = (await translationResponse.json())[0].translations[0]
      .text;
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return transcribedText;
  }
};
