import React, { useState } from "react";
import { Us, Pl } from "react-flags-select";
import styles from "./navbar.module.css";

export const ChangeLanguageFlag = () => {
    const [plSelected, setPlSelected] = useState(true);

    const handleChangeLanguage = () => {
        setPlSelected(!plSelected);
    };
    return (
        <>
            {plSelected ? (
                <Us
                    className={styles.flagIcon}
                    onClick={handleChangeLanguage}
                />
            ) : (
                <Pl
                    className={styles.flagIcon}
                    onClick={handleChangeLanguage}
                />
            )}
        </>
    );
};
