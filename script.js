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
  ü: ["ū", "ú", "ǔ", "ù", "ü"],
  v: ["ū", "ú", "ǔ", "ù", "ü"],
  A: ["Ā", "Á", "Ǎ", "À", "A"],
  E: ["Ē", "É", "Ě", "È", "E"],
  I: ["Ī", "Í", "Ǐ", "Ì", "I"],
  O: ["Ō", "Ó", "Ǒ", "Ò", "O"],
  U: ["Ū", "Ú", "Ǔ", "Ù", "U"],
  Ü: ["Ū", "Ú", "Ǔ", "Ù", "Ü"],
  V: ["Ū", "Ú", "Ǔ", "Ù", "Ü"],
};
const vowels = Object.keys(convertionDict).join("");
const medial = ["i", "u", "ü", "v", "I", "U", "Ü", "V"];

// Display the converted pinyin
// In first init
result.innerText = convert(original.value);
// When input change
original.addEventListener("input", (e) => {
  result.innerText = convert(original.value);
});

// Remove default text
original.addEventListener("click", (e) => {
  if (original.classList.contains("init")) {
    original.classList.remove("init");
    clear();
  }
});

// Copy text
copyButton.addEventListener("click", (e) => {
  navigator.clipboard.writeText(result.innerText);
});

// Clear text
clearButton.addEventListener("click", (e) => {
  clear();
});

function convert(original) {
  let result = "";

  // Get the words
  const regexWord = /(^[^\d]*\d)|((?<=\d)[^\d]*\d)/g;
  const matches = [...original.matchAll(regexWord)];
  if (matches.length == 0) return original;
  const words = matches.map((match) => match[0]);

  // Substitute to the desired tone
  words.forEach((word) => {
    const regexNoLetter = /^[^a-zA-Z]*$/;
    if (regexNoLetter.test(word)) {
      result += word;
    } else {
      const regexVowel = new RegExp(`[${vowels}]`, "g");
      const vowelMatch = word.match(regexVowel);
      const tone = parseInt(word[word.length - 1]) - 1;
      if (vowelMatch.length == 1) {
        word = word.replace(vowelMatch[0], convertionDict[vowelMatch[0]][tone]);
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
    }
  });
  return result;
}

function clear() {
  original.value = "";
  result.innerText = "";
}
