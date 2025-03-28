# Pinyin Converter 

This project is a simple web application that converts Chinese text (both Hanzi and Pinyin) into readable Pinyin. Users can input text manually or upload an image containing Chinese characters. The application uses an OCR (Optical Character Recognition) engine to extract text from images and a Pinyin conversion library to generate Pinyin. It also provides options to display Hanzi, copy results, and view the output in fullscreen mode.

You can try the live version of the Pinyin Converter here: [Pinyin Converter Live](https://beatrixvv.github.io/type-pinyin/).


## Features
* Text Conversion:\
  Converts input Chinese text into Pinyin.
    * Supports both numerical tone notation (ni3 hao3) and Hanzi (你好).
    * Converts both forms to accented Pinyin (nǐ hǎo).

* OCR Support:\
  Upload an image with Chinese characters and extract the text for conversion.

* Display Options:\
  Toggle visibility of Hanzi characters and Pinyin text.

* Copy to Clipboard:\
  Copy the converted Pinyin text to the clipboard.

* Fullscreen Mode:\
  View the Pinyin text in fullscreen mode for better readability.


## Technologies Used
* HTML/CSS/JavaScript:\
  For front-end structure, styling, and functionality.

* Bootstrap Icons:\
  For icons used in buttons and UI elements.
  
* Tesseract.js:\
  An OCR library to extract text from images.

* Pinyin-pro:\
  A library for converting Chinese characters to Pinyin.


## Installation
1. Clone the repository:
```bash
git clone https://github.com/beatrixvv/type-pinyin.git
```

2. Navigate to the project directory:
```bash
cd type-pinyin
```

3. Open the `index.html` file in your browser, or use a local server if preferred.


## Usage
1. Manual Input:\
   Enter Chinese text directly into the text area. The corresponding Pinyin will appear above it.

2. Upload an Image:\
   Click "Upload Image" to select an image containing Chinese text. The app will use OCR to extract the text and convert it into Pinyin.

3. Show Hanzi:\
   Toggle the checkbox to display the original Hanzi characters alongside the Pinyin.

4. Clear Input:\
   Press the "Clear" button to reset the text area.

5. Copy Pinyin:\
   Click the copy icon to copy the Pinyin text to the clipboard.

6. Fullscreen Mode:\
   Click the fullscreen icon to view the result in fullscreen mode for better readability.


## Contributing
Feel free to fork the repository and submit pull requests. Contributions are always welcome!
