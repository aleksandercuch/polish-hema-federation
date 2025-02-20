import { Locale, routing } from "./routing";

const getRequestConfig = async ({ requestLocale }: any) => {
    let locale: string | undefined = await requestLocale;

    if (!locale || !routing.locales.includes(locale as Locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        translations: (await import(`@/messages/${locale}.json`)).default,
    };
};

export default getRequestConfig;
