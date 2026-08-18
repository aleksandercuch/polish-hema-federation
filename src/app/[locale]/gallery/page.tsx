"use client";

import { useTranslations } from "next-intl";
import { UserAuth } from "@/contexts/AuthContext";
import { sectionParams, defaultSection } from "@/types/management.interface";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config/clientApp";

// COMPONENTS
import CreateSectionForm from "@/components/forms/createSectionForm";
import GalleryForm from "@/components/forms/GalleryForm";
import { Loader } from "@/components/loader/loader";
import { SubPageBanner } from "@/components/banner/SubPageBanner";

// MUI
import {
    Divider,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";

// STYLES
import colors from "@/utils/constants/colors";
import styles from "@/app/[locale]/subpage.module.css";

// UTILS
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";

const Page = () => {
    const t = useTranslations("NAVBAR");

    const router = useRouter();

    const currentUser = UserAuth();

    const [sectionsList, setSectionsList] = useState<sectionParams[]>([]);

    const [loading, setLoading] = useState(false);

    const [currentLocale, setCurrentLocale] = useState("en");

    const [mode, setMode] = useState<OPERATION_MODE>(OPERATION_MODE.None);

    const [sectionToEdition, setSectionToEdition] =
        useState<sectionParams>(defaultSection);

    const [addingImages, setAddingImages] = useState(false);

    const fetchSections = useCallback(async (isCancelled: () => boolean) => {
        setLoading(true);

        try {
            const snapshot = await getDocs(collection(db, "gallery"));

            if (isCancelled()) return;

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as sectionParams[];

            setSectionsList(data);
        } catch (error) {
            if (!isCancelled()) {
                console.error("Error retrieving gallery:", error);
            }
        } finally {
            if (!isCancelled()) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetchSections(() => cancelled);

        if (typeof window !== "undefined") {
            setCurrentLocale(window.location.pathname.split("/")[1]);
        }

        return () => {
            cancelled = true;
        };
    }, [fetchSections]);

    const openGallery = (section: sectionParams) => {
        router.push(`/${currentLocale}/gallery/${section.id}`);
    };

    const handleEditSection = (section: sectionParams) => {
        setSectionToEdition(section);

        setAddingImages(false);

        setMode(OPERATION_MODE.Edit);
    };

    const handleEditImages = (section: sectionParams) => {
        setSectionToEdition(section);

        setAddingImages(true);

        setMode(OPERATION_MODE.Edit);
    };

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
                    textAlign: "center",
                    width: "100%",
                    backgroundColor: `${colors.red}`,
                    position: "relative",
                    top: "35vh",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        padding: "30px 0",
                        color: `${colors.white}`,
                    }}
                >
                    {t("gallery")}
                </Typography>

                <Divider />
            </Grid>

            <Paper className={styles.subpageContainer}>
                {mode === OPERATION_MODE.None ? (
                    <Grid
                        container
                        spacing={4}
                        className={styles.postContainer}
                        justifyContent="center"
                    >
                        {currentUser?.user?.email && (
                            <Grid item xs={12} textAlign="center">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setMode(OPERATION_MODE.Add)}
                                >
                                    Dodaj nową galerię
                                </Button>
                            </Grid>
                        )}

                        {sectionsList.map((section) => (
                            <Grid item xs={12} md={3} key={section.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        textAlign: "center",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={section.members?.[0] as string}
                                        alt="Gallery preview"
                                    />

                                    <CardContent>
                                        <Typography variant="h5" gutterBottom>
                                            {currentLocale === "pl"
                                                ? section.namePL
                                                : section.nameENG}
                                        </Typography>

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => openGallery(section)}
                                        >
                                            {t("show-gallery")}
                                        </Button>

                                        {currentUser?.user?.email && (
                                            <Grid
                                                container
                                                spacing={1}
                                                justifyContent="center"
                                                sx={{
                                                    mt: 2,
                                                }}
                                            >
                                                <Grid item>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleEditSection(
                                                                section,
                                                            )
                                                        }
                                                    >
                                                        Edit name
                                                    </Button>
                                                </Grid>

                                                <Grid item>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleEditImages(
                                                                section,
                                                            )
                                                        }
                                                    >
                                                        Add images
                                                    </Button>
                                                </Grid>

                                                <Grid item>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="contained"
                                                    >
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container justifyContent="center">
                        {mode === OPERATION_MODE.Add && (
                            <CreateSectionForm
                                mode={OPERATION_MODE.Add}
                                setOpen={setMode}
                                loading={loading}
                                collection="gallery"
                                setLoading={setLoading}
                            />
                        )}

                        {mode === OPERATION_MODE.Edit &&
                            (addingImages ? (
                                <GalleryForm
                                    mode={OPERATION_MODE.Edit}
                                    section={sectionToEdition}
                                    setOpen={setMode}
                                    loading={loading}
                                    setLoading={setLoading}
                                    collection="gallery"
                                />
                            ) : (
                                <CreateSectionForm
                                    mode={OPERATION_MODE.Edit}
                                    section={sectionToEdition}
                                    setOpen={setMode}
                                    loading={loading}
                                    collection="gallery"
                                    setLoading={setLoading}
                                />
                            ))}
                    </Grid>
                )}
            </Paper>
        </Grid>
    );
};

export default Page;
