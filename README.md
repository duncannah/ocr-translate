# OCR-Translate

## WIP - Work in progress

OCR-Translate is a tool to translate text from images on webpages.

## Setup overview

We need a seperate server setup to allow for web scraping and possibly local OCR.

1. Server (`server`) - Connects extension with the OCR and translation APIs
2. Client (`webextension`) - Web extension that sends image data to the server, interfaces with the user

Due to the nature of the extension, it won't be allowed on a webstore.

## Services

### OCR

-   Google (using Drive API)

### Translation

-   Google Translate
-   Microsoft Translator
-   Yandex Translate
-   DeepL

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
