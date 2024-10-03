import { regionSpeech, subscriptionKeySpeech } from "../../general-config";

export const transcribeAudio = async (audioFile, language = "es") => {
  const url = `https://${regionSpeech}.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-05-15-preview`;

  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append(
    "definition",
    JSON.stringify({
      locales: [getLocale(language)],
      profanityFilterMode: "Masked",
      channels: [0, 1],
    })
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKeySpeech,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  const result = await response.json();
  return result;
};

export const getLocale = (language) => {
  switch (language) {
    case "en":
      return "en-US";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    default:
      return "en-US";
  }
};
