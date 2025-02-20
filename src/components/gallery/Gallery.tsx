// CORE
"use client";
import { useEffect, useState } from "react";

// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, Grid, Typography } from "@mui/material";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

//FIREBASE
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

// COMPONENTS
import CreateSectionForm from "@/utils/forms/createSectionForm";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";
import { Loader } from "../loader/loader";

// TYPES
import { defaultSection, sectionParams } from "@/types/management.interface";
import { isStringArray } from "@/types/typeGuards/isArrayofStrings";

// UTILS
import { convertImagesToGallery } from "@/utils/post/convertImagesToGallery";
import { fileExists } from "@/utils/storage/fileExistInStorage";
import GalleryForm from "@/utils/forms/GalleryForm";

// CONTEXT
import { UserAuth } from "@/contexts/AuthContext";

const Gallery = () => {
    const [sectionsList, setSectionsList] = useState<sectionParams[]>([]);
    const [sectionToEdition, setSectionToEdition] =
        useState<sectionParams>(defaultSection);
    const [addingImages, setAddingImages] = useState<boolean>(false);
    const [mode, setMode] = useState<OPERATION_MODE>(OPERATION_MODE.None);
    const [loading, setLoading] = useState(false);
    const currentUser = UserAuth();

    const handleEditImages = (section: sectionParams) => {
        setMode(OPERATION_MODE.Edit);
        setAddingImages(true);
        setSectionToEdition(section);
    };

    const handleEditSection = (section: sectionParams) => {
        setMode(OPERATION_MODE.Edit);
        setSectionToEdition(section);
    };

    const handleDeleteSection = async (section: sectionParams) => {
        if (!section.id) return;

        const confirmDelete = window.confirm(
            "Czy na pewno chcesz usunąć tą galerię?"
        );
        if (!confirmDelete) return;
        setLoading(true);
        try {
            if (
                section.members &&
                section.members.length > 0 &&
                isStringArray(section.members as string[])
            ) {
                await Promise.all(
                    section.members.map(async (member) => {
                        if (await fileExists(member as string)) {
                            await deleteObject(ref(storage, member as string));
                        }
                    })
                );
            }

            // Delete the Firestore document
            await deleteDoc(doc(db, "gallery", section.id)).then(() => {
                fetchSections();
                alert("Sekcja została usunięta.");
            });
            setLoading(false);

            // Redirect or update UI after deletion
        } catch (error) {
            console.error("Błąd podczas usuwania posta:", error);
            alert("Wystąpił błąd podczas usuwania posta.");
        }
    };

    const fetchSections = async () => {
        const galleryCollection = collection(db, "gallery");

        getDocs(galleryCollection)
            .then((querySnapshot) => {
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })); // @ts-expect-error: temporary solution
                setSectionsList(dataArray);
            })
            .catch((error) => {
                console.error("Error retrieving collection: ", error);
            });
    };

    useEffect(() => {
        if (mode === OPERATION_MODE.None) {
            fetchSections();
            setSectionToEdition(defaultSection);
            setAddingImages(false);
        }
    }, [mode]);
    return (
        <>
            {loading || sectionsList.length <= 0 ? (
                <Grid item>
                    <Loader />
                </Grid>
            ) : (
                <Grid
                    item
                    container
                    xs={12}
                    sm={8}
                    spacing={4}
                    sx={{ justifyContent: "center" }}
                >
                    {mode === OPERATION_MODE.None ? (
                        <>
                            {sectionsList.map((section) => (
                                <Grid
                                    item
                                    key={section.id}
                                    container
                                    xs={12}
                                    sx={{
                                        paddingBottom: "40px",
                                        textAlign: {
                                            xs: "center",
                                            sm: "left",
                                        },
                                        justifyContent: "center",
                                    }}
                                    spacing={2}
                                >
                                    <Grid item container xs={12} spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                component="h3"
                                            >
                                                {section.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {currentUser?.user?.email && (
                                        <Grid
                                            item
                                            container
                                            xs={12}
                                            sx={{
                                                justifyContent: "center",
                                            }}
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    color="error"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        mt: 2,
                                                    }}
                                                    onClick={() =>
                                                        handleEditSection(
                                                            section
                                                        )
                                                    }
                                                >
                                                    Edytuj nazwę
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    color="error"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        mt: 2,
                                                    }}
                                                    onClick={() =>
                                                        handleEditImages(
                                                            section
                                                        )
                                                    }
                                                >
                                                    Dodaj Zdjęcia
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    type="submit"
                                                    color="error"
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        mt: 2,
                                                    }}
                                                    onClick={() =>
                                                        handleDeleteSection(
                                                            section
                                                        )
                                                    }
                                                >
                                                    Usuń sekcję
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                    {section.members.length > 0 && (
                                        <Grid item xs={12}>
                                            <ImageGallery
                                                items={convertImagesToGallery(
                                                    section.members as string[]
                                                )}
                                                showFullscreenButton={true}
                                                startIndex={1}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                            {currentUser?.user?.email && (
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    sx={{ paddingBottom: "40px" }}
                                >
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        sx={{ mb: 2 }}
                                        onClick={() =>
                                            setMode(OPERATION_MODE.Add)
                                        }
                                    >
                                        Dodaj Nową Sekcję
                                    </Button>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <>
                            {mode === OPERATION_MODE.Add ? (
                                <>
                                    <CreateSectionForm
                                        mode={OPERATION_MODE.Add}
                                        setOpen={setMode}
                                        loading={loading}
                                        collection={"gallery"}
                                        setLoading={setLoading}
                                    />
                                </>
                            ) : (
                                //EDITION
                                <>
                                    {addingImages ? (
                                        <>
                                            <GalleryForm
                                                mode={OPERATION_MODE.Edit}
                                                section={sectionToEdition}
                                                setOpen={setMode}
                                                loading={loading}
                                                setLoading={setLoading}
                                                collection={"gallery"}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <CreateSectionForm
                                                mode={OPERATION_MODE.Edit}
                                                section={sectionToEdition}
                                                setOpen={setMode}
                                                loading={loading}
                                                collection={"gallery"}
                                                setLoading={setLoading}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Grid>
            )}
        </>
    );
};

export default Gallery;
