import Grid from "@mui/material/Grid/Grid";
import styles from "./banner.module.css";
import Image from "next/image";

export const SubPageBanner = () => {
    return (
        <Grid
            item
            className={styles.subBanner}
            sx={{ height: { xs: "24vh", md: "calc(100vh - 100px)" } }}
        >
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/polish-hema-federation.firebasestorage.app/o/banner.jpg?alt=media&token=7ac1b107-f9b0-4c0c-b5fd-9b3729c0e181"
                alt="Example image"
                fill
                priority
            />
        </Grid>
    );
};
