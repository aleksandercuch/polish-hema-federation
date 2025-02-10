"use client";
import { Grid, Paper, Typography } from "@mui/material";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";
import styles from "@/app/subpage.module.css";
import TextEditorComponent from "@/components/SingePageText/TextEditor";

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
                        <Typography variant="h3">Judges</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextEditorComponent
                            collectionName="judges"
                            collectionId="5MhxZbiqHBODQRnlE63j"
                        />{" "}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};
export default page;
