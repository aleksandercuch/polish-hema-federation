"use client";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";
import styles from "@/app/[locale]/subpage.module.css";
import TextEditorComponent from "@/components/SingePageText/TextEditor";
import Contact from "@/components/contact/Contact";

const page = () => {
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
                    backgroundColor: "#d32f2f",
                    position: "relative",
                    top: "35vh",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{ padding: "30px 0", color: "white" }}
                >
                    {t("judges")}
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
export default page;
