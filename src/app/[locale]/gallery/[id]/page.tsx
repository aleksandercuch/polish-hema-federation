"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase/config/clientApp";

import { Loader } from "@/components/loader/loader";
import { sectionParams, defaultSection } from "@/types/management.interface";

import { convertImagesToGallery } from "@/utils/post/convertImagesToGallery";
import styles from "@/app/[locale]/subpage.module.css";

import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import colors from "@/utils/constants/colors";
import { SubPageBanner } from "@/components/banner/SubPageBanner";

const GalleryDetails = () => {
    const t = useTranslations("NAVBAR");
    const { id } = useParams();
    const router = useRouter();

    const [gallery, setGallery] = useState<sectionParams>(defaultSection);

    const [loading, setLoading] = useState(true);

    const [currentLocale, setCurrentLocale] = useState("en");

    const fetchGallery = useCallback(
        async (isCancelled: () => boolean) => {
            if (!id) return;

            try {
                const snap = await getDoc(doc(db, "gallery", id as string));

                if (isCancelled()) return;

                if (snap.exists()) {
                    setGallery({
                        id: snap.id,
                        ...snap.data(),
                    } as sectionParams);
                }
            } catch (error) {
                console.error("Gallery fetch error:", error);
            } finally {
                if (!isCancelled()) {
                    setLoading(false);
                }
            }
        },
        [id],
    );

    useEffect(() => {
        let cancelled = false;

        fetchGallery(() => cancelled);

        if (typeof window !== "undefined") {
            setCurrentLocale(window.location.pathname.split("/")[1]);
        }

        return () => {
            cancelled = true;
        };
    }, [fetchGallery]);

    if (loading) {
        return <Loader />;
    }

    return (
        <Grid container className={styles.mainContainer} xs={12}>
            <SubPageBanner />
            <Grid
                item
                xs={12}
                sx={{
                    width: "100%",
                    backgroundColor: `${colors.red}`,
                    position: "relative",
                    top: "35vh",
                }}
            >
                <Grid
                    container
                    direction={{ xs: "column", md: "row" }}
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        position: "relative",
                        padding: "30px 20px",
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            color: `${colors.white}`,
                            textAlign: "center",
                            fontSize: {
                                xs: "2rem",
                                sm: "2.5rem",
                                md: "3rem",
                            },
                        }}
                    >
                        {currentLocale === "pl"
                            ? gallery.namePL
                            : gallery.nameENG}
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={() => router.push(`/${currentLocale}/gallery`)}
                        sx={{
                            position: { xs: "static", md: "absolute" },
                            left: { md: 20 },
                            mt: { xs: 2, md: 0 },
                            color: colors.white,
                            borderColor: colors.white,
                        }}
                    >
                        {t("return-gallery")}
                    </Button>
                </Grid>

                <Divider />
            </Grid>
            <Paper className={styles.subpageContainer}>
                <Grid
                    item
                    sx={{
                        width: "100%",
                    }}
                >
                    <ImageGallery
                        items={convertImagesToGallery(
                            gallery.members as string[],
                        )}
                        showFullscreenButton
                        startIndex={0}
                    />
                </Grid>
            </Paper>
        </Grid>
    );
};

export default GalleryDetails;
