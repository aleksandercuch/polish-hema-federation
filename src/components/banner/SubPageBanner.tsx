import Grid from "@mui/material/Grid/Grid";
import styles from "./banner.module.css";
import Image from "next/image";

export const SubPageBanner = () => {
    return (
        <Grid item className={styles.subBanner}>
            <Image src="/banner.jpg" alt="Example image" fill priority />
        </Grid>
    );
};
