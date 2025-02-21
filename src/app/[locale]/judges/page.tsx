"use client";
import { useTranslations } from "next-intl";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";
import TextEditorComponent from "@/components/SingePageText/TextEditor";

// STYLES
import styles from "@/app/[locale]/subpage.module.css";
import colors from "@/utils/constants/colors";
import { Divider, Grid, Paper, Typography } from "@mui/material";

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
                    <Grid item xs={12} sm={8} mt={4}>
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
export default Page;
