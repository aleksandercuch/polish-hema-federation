// CORE
"use client";
import { ComponentType, FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { convertFromRaw, EditorState, RawDraftContentState } from "draft-js";

//import { UserAuth } from "@/context/auth-context";
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    Avatar,
    Button,
    FormControl,
    Grid,
    Paper,
    Typography,
    TextField,
} from "@mui/material";
import ImageGallery from "react-image-gallery";
import styles from "@/app/subpage.module.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "./gallery.css";
// @ts-ignore
import draftToHtml from "draftjs-to-html";

//FIREBASE
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";
import { DEFAULT_AVATAR } from "@/utils/constants/constants";
import CreateSectionForm from "@/utils/forms/createSectionForm";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";
import { Loader } from "../loader/loader";

// TYPES
import {
    defaultMember,
    defaultSection,
    memberParams,
    sectionParams,
} from "@/types/management.interface";
import { MemberForm } from "@/utils/forms/memberForm";
import { fileExists } from "@/utils/storage/fileExistInStorage";

// UTILS
import { removeElementAtIndex } from "@/utils/array/deleteWithIndex";
import { isStringArray } from "@/types/typeGuards/isArrayofStrings";
import { convertImagesToGallery } from "@/utils/post/convertImagesToGallery";
import GalleryForm from "@/utils/forms/GalleryForm";

const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
};

const Gallery = () => {
    const [sectionsList, setSectionsList] = useState<sectionParams[]>([]);
    const [sectionToEdition, setSectionToEdition] =
        useState<sectionParams>(defaultSection);
    const [addingImages, setAddingImages] = useState<boolean>(false);
    const [mode, setMode] = useState<OPERATION_MODE>(OPERATION_MODE.None);
    const [loading, setLoading] = useState(false);

    const handleDeleteMember = async (
        section: sectionParams,
        member: memberParams
    ) => {
        if (!section.id) return;

        const confirmDelete = window.confirm(
            `Czy na pewno chcesz usunąć ${member.name}?`
        );
        if (!confirmDelete) return;
        setLoading(true);

        try {
            // Delete image if  exists
            if (member.file && (await fileExists(member.file))) {
                await deleteObject(ref(storage, member.file));
            }

            // Update document
            const updatedMembers = removeElementAtIndex(
                section.members as string[],
                member.id
            );
            // Updating an existing member
            await updateDoc(doc(db, "management", section.id), {
                name: section.name,
                members: updatedMembers,
            });

            alert(`Zakończyłeś usuwanie!`);
            fetchSections().then(() => setLoading(false));
        } catch (error) {
            alert(`Wystąpił błąd podczas usuwania ${member.name}`);
        }
    };
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
            // Delete images if they exist
            if (
                section.members &&
                section.members.length > 0 &&
                isStringArray(section.members)
            ) {
                await Promise.all(
                    section.members.map(async (member) => {
                        if (await fileExists(member)) {
                            await deleteObject(ref(storage, member));
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
                    ...doc.data(), // Spread the document data
                })); // @ts-ignore
                setSectionsList(dataArray); // Logs the collection as an array
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
                                                    handleEditSection(section)
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
                                                    handleEditImages(section)
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
                                                    handleDeleteSection(section)
                                                }
                                            >
                                                Usuń sekcję
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {section.members.length > 0 && (
                                        <Grid
                                            item
                                            xs={12}
                                            className={styles.galleryContainer}
                                        >
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
                            <Grid
                                item
                                container
                                xs={12}
                                sx={{ paddingBottom: "40px" }}
                            >
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="small"
                                    sx={{ mb: 2 }}
                                    onClick={() => setMode(OPERATION_MODE.Add)}
                                >
                                    Dodaj Nową Sekcję
                                </Button>
                            </Grid>
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
