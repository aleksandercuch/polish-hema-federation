"use client";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";
import TextEditorComponent from "@/components/SingePageText/TextEditor";
import Contact from "@/components/contact/Contact";

//STYLES
import colors from "@/utils/constants/colors";
import styles from "@/app/[locale]/subpage.module.css";

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
                    {t("cooperation")}
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
                        storageHref="cooperationImages"
                        collectionName="cooperationContact"
                    />
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} sm={8} mt={4}>
                        <TextEditorComponent
                            collectionName="cooperation"
                            collectionId="MgjzyLQzaSOhPxrF6hjd"
                        />{" "}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};
export default Page;
