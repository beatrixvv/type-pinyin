const result = document.getElementById("result-text");
const copyButton = document.getElementById("copy-button");
const original = document.getElementById("original-text");
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
result.innerText = convert(original.value);
// When input change
original.addEventListener("input", (e) => {
  result.innerText = convert(original.value);
});

// Remove default text
original.addEventListener(
  "click",
  (e) => {
    clear();
  },
  { once: true }
);

// Copy text
copyButton.addEventListener("click", (e) => {
  navigator.clipboard.writeText(result.innerText);
});

// Clear text
clearButton.addEventListener("click", (e) => {
  clear();
});

function convert(original) {
  let result = [];
  const lines = original.split("\n");
  const regexHanzi = /[\u4e00-\u9fff]/;

  lines.forEach((line) => {
    if (regexHanzi.test(line)) {
      result.push(hanziToPinyin(line));
    } else {
      result.push(pinyinToPinyin(line));
    }
  });

  return result.join("\n");
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
