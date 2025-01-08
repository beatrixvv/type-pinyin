const result = document.getElementById("result-text");
const showHanzi = document.getElementById("show-hanzi");
const copyButton = document.getElementById("copy-button");
const copyTooltip = document.getElementById("copy-tooltip");
const fullScreen = document.getElementById("full-screen");
const original = document.getElementById("original-text");
const inputImg = document.getElementById("input-img");
const clearButton = document.getElementById("clear-button");

const convertionDict = {
  a: ["ā", "á", "ǎ", "à", "a"],
  e: ["ē", "é", "ě", "è", "e"],
  i: ["ī", "í", "ǐ", "ì", "i"],
  o: ["ō", "ó", "ǒ", "ò", "o"],
  u: ["ū", "ú", "ǔ", "ù", "u"],
  ü: ["ǖ", "ǘ", "ǚ", "ǜ", "ü"],
  v: ["ǖ", "ǘ", "ǚ", "ǜ", "ü"],
  A: ["Ā", "Á", "Ǎ", "À", "A"],
  E: ["Ē", "É", "Ě", "È", "E"],
  I: ["Ī", "Í", "Ǐ", "Ì", "I"],
  O: ["Ō", "Ó", "Ǒ", "Ò", "O"],
  U: ["Ū", "Ú", "Ǔ", "Ù", "U"],
  Ü: ["Ǖ", "Ǘ", "Ǚ", "Ǜ", "Ü"],
  V: ["Ǖ", "Ǘ", "Ǚ", "Ǜ", "Ü"],
};
const vowels = Object.keys(convertionDict).join("");
const medial = ["i", "u", "ü", "v", "I", "U", "Ü", "V"];
const toneNum = Object.values(convertionDict)[0].length;

// Display the converted pinyin
// In first init
convert(original.value, result);
// When input change
original.addEventListener("input", (e) => {
  convert(original.value, result);
});

// Remove default text
original.addEventListener("click", clear, { once: true });

// Show hanzi
showHanzi.addEventListener("change", (e) => {
  convert(original.value, result);
});

// Copy text
copyButton.addEventListener("click", (e) => {
  navigator.clipboard.writeText(result.innerText);
  // Show tooltip
  copyTooltip.classList.add("visible");
  // Hide the tooltip after 2 seconds
  setTimeout(() => {
    copyTooltip.classList.remove("visible");
  }, 800);
});

// Full screen feature
fullScreen.addEventListener("click", () => {
  if (result.requestFullscreen) {
    result.requestFullscreen(); // For most browsers
  } else if (result.webkitRequestFullscreen) {
    result.webkitRequestFullscreen(); // For Safari
  } else if (result.msRequestFullscreen) {
    result.msRequestFullscreen(); // For IE11
  }
});

// OCR feature
inputImg.addEventListener("change", (e) => {
  const file = inputImg.files[0];
  if (!file) return;
  if (file.type.startsWith("image/")) {
    // Remove click event that remove the default text
    original.removeEventListener("click", clear, { once: true });
    // Read the image
    const reader = new FileReader();
    reader.onload = async function (e) {
      const imageUrl = e.target.result;
      original.value = "Processing file...";

      // OCR
      const worker = await Tesseract.createWorker("chi_sim");
      const ret = await worker.recognize(imageUrl);
      original.value = ret.data.text.replace(/[^\S\r\n]+/g, "");
      await worker.terminate();
      convert(original.value, result);
      inputImg.value = "";
    };
    reader.readAsDataURL(file);
  } else {
    original.value = "Image only!";
    inputImg.value = "";
    result.innerText = "";
  }
});

// Clear text
clearButton.addEventListener("click", (e) => {
  clear();
});

function convertPinyin(original, result) {
  let resultArr = [];
  const lines = original.split("\n");
  const regexHanzi = /[\u4e00-\u9fff]/;

  lines.forEach((line) => {
    if (regexHanzi.test(line)) {
      resultArr.push(hanziToPinyin(line));
    } else {
      resultArr.push(pinyinToPinyin(line));
    }
  });
  result.innerText = resultArr.join("\n");
}

function convertHanziPinyin(original, result) {
  result.innerHTML = "";
  const lines = original.split("\n");
  const regexHanzi = /[\u4e00-\u9fff]/;

  lines.forEach((line) => {
    let divLine = document.createElement("div");
    divLine.className = "result-line";
    if (regexHanzi.test(line)) {
      wordArr = line.split("");
      wordArr.forEach((word) => {
        // WordContainer will encapsulate hanzi and pinyin
        let wordContainer = document.createElement("div");
        wordContainer.className = "word-container";
        let hanzi = document.createElement("div");
        hanzi.className = "hanzi";
        hanzi.innerText = word;
        let pinyin = document.createElement("div");
        pinyin.className = "pinyin";
        pinyin.innerText = hanziToPinyin(word);

        wordContainer.appendChild(hanzi);
        wordContainer.appendChild(pinyin);
        divLine.appendChild(wordContainer);
      });
    } else {
      divLine.innerText = pinyinToPinyin(line);
    }
    result.appendChild(divLine);
  });
}

function convert(original, result) {
  if (showHanzi.checked) {
    return convertHanziPinyin(original, result);
  } else {
    return convertPinyin(original, result);
  }
}

function hanziToPinyin(line) {
  const { pinyin } = pinyinPro;
  const result = pinyin(line, { nonZh: "consecutive" });
  return result;
}

function pinyinToPinyin(line) {
  let result = "";

  // Get the words
  const regexWord = /(^[^\d]*\d)|((?<=\d)[^\d]*\d)/g;
  const matches = [...line.matchAll(regexWord)];
  if (matches.length == 0) return line;
  const words = matches.map((match) => match[0]);

  // Substitute to the desired tone
  words.forEach((word) => {
    const regexNoChar = /^[^a-zA-Z]*$/;
    const regexWithSpace = /(.+)((?<=\s)[^\d]*\d)/;

    if (regexNoChar.test(word)) {
      result += word;
    } else {
      // Put the intonation on the word closest to the number
      const spaceMatch = word.match(regexWithSpace);
      if (spaceMatch !== null) {
        result += spaceMatch[1];
        word = spaceMatch[2];
      }

      const regexVowel = new RegExp(`[${vowels}]`, "g");
      const vowelMatch = word.match(regexVowel);
      const tone = parseInt(word[word.length - 1]) - 1;

      if (vowelMatch != null && tone >= 0 && tone < toneNum) {
        if (vowelMatch.length == 1) {
          word = word.replace(
            vowelMatch[0],
            convertionDict[vowelMatch[0]][tone]
          );
        } else if (vowelMatch.length > 1) {
          if (medial.includes(vowelMatch[0])) {
            word = word.replace(
              vowelMatch[1],
              convertionDict[vowelMatch[1]][tone]
            );
          } else {
            word = word.replace(
              vowelMatch[0],
              convertionDict[vowelMatch[0]][tone]
            );
          }
        }
        // Remove the numbered tone
        result += word.slice(0, word.length - 1);
      } else {
        result += word;
      }
    }
  });
  return result;
}

function clear() {
  original.value = "";
  result.innerText = "";
}
