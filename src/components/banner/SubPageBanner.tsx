import Grid from "@mui/material/Grid/Grid";
import styles from "./banner.module.css";
import Image from "next/image";

export const SubPageBanner = () => {
    return (
        <Grid item className={styles.subBanner}>
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/polish-hema-federation.firebasestorage.app/o/banner.jpg?alt=media&token=1f1dffd9-bb98-4e88-8e46-53324347f806"
                alt="Example image"
                fill
                priority
            />
        </Grid>
    );
};
