"use client";
import React, { useEffect, useState } from "react";
import { Gb, Pl } from "react-flags-select";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";

export const ChangeLanguageFlag = () => {
    const [currentLocale, setCurrentLocale] = useState("");

    const router = useRouter();
    const changeLanguage = async (newLocale: string) => {
        const currentPath = window.location.pathname;

        const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, "");
        if (pathWithoutLocale === "") {
            await router.push(`/${newLocale}`);
        } else {
            await router.push(`/${newLocale}${pathWithoutLocale}`);
        }
    };

    useEffect(() => {
        const currentLocale = window.location.pathname.split("/")[1];
        setCurrentLocale(currentLocale);
    }, []);
    return (
        <>
            {currentLocale === "pl" ? (
                <Gb
                    className={styles.flagIcon}
                    onClick={() => changeLanguage("en")}
                />
            ) : (
                <Pl
                    className={styles.flagIcon}
                    onClick={() => changeLanguage("pl")}
                />
            )}
        </>
    );
};
