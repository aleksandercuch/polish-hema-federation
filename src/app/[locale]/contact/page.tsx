"use client";
import { useTranslations } from "next-intl";

// COMPONENTS
import Contact from "@/components/contact/Contact";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import { SubPageBanner } from "@/components/banner/SubPageBanner";

// STYLES
import styles from "@/app/[locale]/subpage.module.css";
import colors from "@/utils/constants/colors";

const Page = () => {
    const t = useTranslations("NAVBAR");

    return (
        <Grid container className={styles.mainContainer} xs={12}>
            <SubPageBanner />
            <Grid
                item
                xs={12}
                sx={{
                    textAlign: "center",
                    width: "100%",
                    backgroundColor: `${colors.red}`,
                    position: "relative",
                    top: "35vh",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ padding: "30px 0", color: `${colors.white}` }}
                >
                    {t("contact")}
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
export default Page;
