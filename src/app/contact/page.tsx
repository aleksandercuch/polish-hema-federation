"use client";

import { SubPageBanner } from "@/components/banner/SubPageBanner";
// COMPONENTS
import Contact from "@/components/contact/Contact";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import styles from "@/app/subpage.module.css";

const page = () => {
    return (
        <Grid container className={styles.mainContainer} xs={12}>
            <SubPageBanner />
            <Grid
                item
                xs={12}
                sx={{
                    textAlign: "center",
                    width: "100%",
                    backgroundColor: "#d32f2f",
                    position: "relative",
                    top: "35vh",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ padding: "30px 0", color: "white" }}
                >
                    Kontakt
                </Typography>
                <Divider />
            </Grid>
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
                    xs={12}
                >
                    <Contact
                        storageHref="contactImages"
                        collectionName="contact"
                    />
                </Grid>
            </Paper>
        </Grid>
    );
};
export default page;
