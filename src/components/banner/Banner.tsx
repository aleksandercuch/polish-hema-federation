import { Grid } from "@mui/material";
import styles from "./banner.module.css";
import Image from "next/image";

export const Banner = () => {
    return (
        <Grid
            className={styles.banner}
            sx={{ height: { xs: "24vh", md: "calc(100vh - 100px)" } }}
        >
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/polish-hema-federation.firebasestorage.app/o/banner.jpg?alt=media&token=1f1dffd9-bb98-4e88-8e46-53324347f806"
                alt="Example image"
                fill
                priority
            />
        </Grid>
    );
};
