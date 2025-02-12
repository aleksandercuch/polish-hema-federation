"use client";

import { SubPageBanner } from "@/components/banner/SubPageBanner";
// COMPONENTS
import Contact from "@/components/contact/Contact";
import { Grid, Paper, Typography } from "@mui/material";
import styles from "@/app/subpage.module.css";
import Gallery from "@/components/gallery/Gallery";

const page = () => {
    return (
        <Grid container className={styles.mainContainer} xs={12}>
            <SubPageBanner />
            <Paper className={styles.subpageContainer}>
                <Grid
                    container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        maxWidth: "none",
                        padding: "0 5px",
                    }}
                    spacing={8}
                    xs={12}
                >
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant="h3">Gallery</Typography>
                    </Grid>
                    <Gallery />
                </Grid>
            </Paper>
        </Grid>
    );
};
export default page;
