import { Locale, routing } from "./routing";

interface RequestConfigParams {
    requestLocale?: string;
}

const getRequestConfig = async ({ requestLocale }: RequestConfigParams) => {
    let locale: string | undefined = requestLocale;

    if (!locale || !routing.locales.includes(locale as Locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        translations: (await import(`@/messages/${locale}.json`)).default,
    };
};

export default getRequestConfig;
