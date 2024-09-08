import path from 'path';
import i18n from "i18next";
import resourcesToBackend from 'i18next-resources-to-backend';
import HttpBackend from 'i18next-http-backend'
import ChainedBackend from 'i18next-chained-backend'

import { initReactI18next } from "react-i18next";

const hostUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const resourcesLangCard = {
  en: {
    translation: {
      LangCard: {
        cardTitle: "Welcome to our App",
        cardDescription: "Learn how to use the Trans component",
        regularText: "This is a regular translation.",
        transText: "This is a <strong>Trans component</strong> example with a <3>link<1/></3>.",
        linkText: "documentation",
        switchLanguage: "Switch to French"
      }
    }
  },

  fr: {
    translation: {
      LangCard: {
        cardTitle: "Bienvenue dans notre Application",
        cardDescription: "Apprenez à utiliser le composant Trans",
        regularText: "Ceci est une traduction régulière.",
        transText: "Voici un exemple de composant <strong>Trans</strong> avec un <3>lien<1/></3>.",
        linkText: "documentation",
        switchLanguage: "Passer à la langue vietnamienne"
      }
    }
  },

  vi: {
    translation: {
      LangCard: {
        cardTitle: "Chào mừng đến với ứng dụng của chúng tôi",
        cardDescription: "Học cách sử dụng thành phần Trans",
        regularText: "Đây là một ví dụ về dịch thuật thông thường.",
        transText: "Đây là một ví dụ về thành phần <strong>Trans</strong> với một <3>liên kết<1/></3>.",
        linkText: "tài liệu",
        switchLanguage: "Chuyển sang tiếng Anh"
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .use(ChainedBackend)
  .init({
    backend: {
      backends: [
        // if a namespace can't be loaded via normal http-backend loadPath, 
        //then the inMemoryLocalBackend will try to return the correct resources
        HttpBackend, 
        // with dynamic import, 
        // you have to use the "default" key of the module
        // ( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_defaults )
        resourcesToBackend((language, namespace, callback) => {
          const filePath = `./translations/${language}/${namespace}.json`
          console.log("resourcesToBackend: trying to load resources from", filePath);
          import(filePath)
            .then((resources) => {
              console.log("resourcesToBackend: loaded resources", resources, "from", filePath);
              callback(null, resources)
            })
            .catch((error) => {
              console.error("resourcesToBackend: error loading resources", error);
              console.error("current location:", process.cwd());
              callback(error, null)
            })
        })
      ],
      backendOptions: [{
        loadPath: `${hostUrl}/translations/{{lng}}/{{ns}}.json`
      }]
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    partialBundledLanguages: true
  })

export default i18n;
