export function convertBlobToWav(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async function (event) {
      const arrayBuffer = event.target.result;
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const wavBuffer = audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

      resolve(wavBlob);
    };

    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(blob);
  });
}

function audioBufferToWav(buffer) {
  let numOfChannels = buffer.numberOfChannels;
  let length = buffer.length * numOfChannels * 2 + 44;
  let outputBuffer = new ArrayBuffer(length);
  let view = new DataView(outputBuffer);

  let writeString = function (view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  let offset = 0;
  writeString(view, offset, "RIFF");
  offset += 4;
  view.setUint32(offset, 36 + buffer.length * numOfChannels * 2, true);
  offset += 4;
  writeString(view, offset, "WAVE");
  offset += 4;
  writeString(view, offset, "fmt ");
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, numOfChannels, true);
  offset += 2;
  view.setUint32(offset, buffer.sampleRate, true);
  offset += 4;
  view.setUint32(offset, buffer.sampleRate * numOfChannels * 2, true);
  offset += 4;
  view.setUint16(offset, numOfChannels * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString(view, offset, "data");
  offset += 4;
  view.setUint32(offset, buffer.length * numOfChannels * 2, true);
  offset += 4;

  let interleaved = new Float32Array(buffer.length * numOfChannels);
  for (let channel = 0; channel < numOfChannels; channel++) {
    let channelData = buffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      interleaved[i * numOfChannels + channel] = channelData[i];
    }
  }

  let index = 44;
  let volume = 1;
  for (let i = 0; i < interleaved.length; i++) {
    view.setInt16(index, interleaved[i] * (0x7fff * volume), true);
    index += 2;
  }

  return outputBuffer;
}
