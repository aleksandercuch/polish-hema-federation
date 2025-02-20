"use client";

import { SubPageBanner } from "@/components/banner/SubPageBanner";
// COMPONENTS
import { Grid, Paper, Typography } from "@mui/material";
import styles from "@/app/[locale]/subpage.module.css";
import { LoginForm } from "@/components/login/LoginForm";

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
                    xs={12}
                >
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant="h3">Admin</Typography>
                    </Grid>
                    <LoginForm />
                </Grid>
            </Paper>
        </Grid>
    );
};
export default page;
