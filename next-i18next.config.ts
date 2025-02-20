/** @type {import('next-i18next').UserConfig} */
const i18nConfig = {
    i18n: {
        defaultLocale: "en",
        locales: ["en", "pl"],
    },
};

export const languages = i18nConfig.i18n.locales;

export default i18nConfig;
