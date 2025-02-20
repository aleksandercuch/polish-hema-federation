// CORE
"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    Avatar,
    Button,
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import styles from "@/app/[locale]/subpage.module.css";

//FIREBASE
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";
import { Loader } from "../loader/loader";

// TYPES
import {
    defaultMember,
    defaultSection,
    memberParams,
    sectionParams,
} from "@/types/management.interface";
import { isMemberParams } from "@/types/typeGuards/isMemberParams";

// UTILS
import { removeElementAtIndex } from "@/utils/array/deleteWithIndex";
import { MemberForm } from "@/utils/forms/memberForm";
import { fileExists } from "@/utils/storage/fileExistInStorage";
import { DEFAULT_AVATAR } from "@/utils/constants/constants";
import CreateSectionForm from "@/utils/forms/createSectionForm";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";

//CONTEXT
import { UserAuth } from "@/contexts/AuthContext";

const Management = () => {
    const [sectionsList, setSectionsList] = useState<sectionParams[]>([]);
    const [sectionToEdition, setSectionToEdition] =
        useState<sectionParams>(defaultSection);
    const [memberToEdition, setMemberToEdition] =
        useState<memberParams>(defaultMember);
    const [mode, setMode] = useState<OPERATION_MODE>(OPERATION_MODE.None);
    const [loading, setLoading] = useState(false);
    const currentUser = UserAuth();
    const t = useTranslations("NAVBAR");
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
            if (member.file && (await fileExists(member.file as string))) {
                await deleteObject(ref(storage, member.file as string));
            }

            const updatedMembers = removeElementAtIndex(
                section.members as memberParams[],
                member.id
            );
            await updateDoc(doc(db, "management", section.id), {
                name: section.name,
                members: updatedMembers,
            });

            alert(`Zakończyłeś usuwanie!`);
            fetchSections().then(() => setLoading(false));
        } catch (error) {
            alert(`Wystąpił ${error} podczas usuwania ${member.name}`);
        }
    };
    const handleAddMember = (section: sectionParams) => {
        setMode(OPERATION_MODE.Add);
        setSectionToEdition(section);
    };

    const handleEditSection = (section: sectionParams) => {
        setMode(OPERATION_MODE.Edit);
        setSectionToEdition(section);
    };

    const handleEditMember = (section: sectionParams, member: memberParams) => {
        setMode(OPERATION_MODE.Edit);
        setSectionToEdition(section);
        setMemberToEdition(member);
    };

    const handleDeleteSection = async (section: sectionParams) => {
        if (!section.id) return;

        const confirmDelete = window.confirm(
            "Czy na pewno chcesz usunąć tą sekcję?"
        );
        if (!confirmDelete) return;
        setLoading(true);
        try {
            if (section.members && section.members.length > 0) {
                const members = section.members as memberParams[];
                await Promise.all(
                    members.filter(isMemberParams).map(async (member) => {
                        if (await fileExists(member.file as string)) {
                            await deleteObject(
                                ref(storage, member.file as string)
                            );
                        }
                    })
                );
            }

            await deleteDoc(doc(db, "management", section.id)).then(() => {
                fetchSections();
                alert("Sekcja została usunięta.");
            });
            setLoading(false);
        } catch (error) {
            console.error("Błąd podczas usuwania posta:", error);
            alert("Wystąpił błąd podczas usuwania posta.");
        }
    };

    const fetchSections = async () => {
        const managementCollection = collection(db, "management");

        getDocs(managementCollection)
            .then((querySnapshot) => {
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })); //@ts-expect-error: temporary solution
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
            setMemberToEdition(defaultMember);
        }
    }, [mode]);
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
                    {t("management")}
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
                                            <Grid
                                                item
                                                container
                                                xs={12}
                                                spacing={2}
                                            >
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
                                                        sx={{ mb: 5 }}
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
                                                        justifyContent:
                                                            "center",
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
                                                                handleAddMember(
                                                                    section
                                                                )
                                                            }
                                                        >
                                                            Dodaj Osobę
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
                                            {section.members &&
                                                Array.isArray(
                                                    section.members
                                                ) &&
                                                section.members //  @ts-expect-error: temporary solution
                                                    .filter(isMemberParams)
                                                    .map((member) => (
                                                        <Grid
                                                            item
                                                            key={member.id}
                                                            container
                                                            xs={12}
                                                            md={6}
                                                            sx={{
                                                                paddingBottom:
                                                                    "40px",
                                                                textAlign: {
                                                                    xs: "center",
                                                                    sm: "left",
                                                                },
                                                            }}
                                                            spacing={2}
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                lg={4}
                                                            >
                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={
                                                                        (member.file as string) ||
                                                                        DEFAULT_AVATAR
                                                                    }
                                                                    sx={{
                                                                        width: 120,
                                                                        height: 120,
                                                                        margin: "auto",
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                container
                                                                xs={12}
                                                                lg={8}
                                                                spacing={2}
                                                                sx={{
                                                                    justifyContent:
                                                                        {
                                                                            xs: "center",
                                                                            lg: "flex-start",
                                                                        },

                                                                    textAlign: {
                                                                        xs: "center",
                                                                        lg: "left",
                                                                    },
                                                                }}
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                >
                                                                    <Typography
                                                                        variant="h5"
                                                                        component="h4"
                                                                    >
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography variant="body1">
                                                                        {
                                                                            member.descriptionPL
                                                                        }
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            {currentUser?.user
                                                                ?.email && (
                                                                <Grid
                                                                    item
                                                                    container
                                                                    xs={12}
                                                                    sx={{
                                                                        justifyContent:
                                                                            "center",
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
                                                                                handleEditMember(
                                                                                    section,
                                                                                    member
                                                                                )
                                                                            }
                                                                        >
                                                                            Edytuj{" "}
                                                                            {
                                                                                member.name
                                                                            }
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
                                                                                handleDeleteMember(
                                                                                    section,
                                                                                    member
                                                                                )
                                                                            }
                                                                        >
                                                                            Usuń
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    ))}
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
                                                color="error"
                                                size="small"
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
                                            {sectionToEdition.id ? (
                                                // ADD MEMBER
                                                <>
                                                    <MemberForm
                                                        mode={
                                                            OPERATION_MODE.Edit
                                                        }
                                                        section={
                                                            sectionToEdition
                                                        }
                                                        setOpen={setMode}
                                                        loading={loading}
                                                        setLoading={setLoading}
                                                    />
                                                </>
                                            ) : (
                                                // ADD SECTION
                                                <>
                                                    <CreateSectionForm
                                                        mode={
                                                            OPERATION_MODE.Add
                                                        }
                                                        setOpen={setMode}
                                                        loading={loading}
                                                        setLoading={setLoading}
                                                        collection={
                                                            "management"
                                                        }
                                                    />
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        //EDITION
                                        <>
                                            {sectionToEdition &&
                                            memberToEdition.id >= 0 ? (
                                                // EDIT MEMBER
                                                <>
                                                    <MemberForm
                                                        mode={
                                                            OPERATION_MODE.Edit
                                                        }
                                                        section={
                                                            sectionToEdition
                                                        }
                                                        member={memberToEdition}
                                                        setOpen={setMode}
                                                        loading={loading}
                                                        setLoading={setLoading}
                                                    />
                                                </>
                                            ) : (
                                                // EDIT SECTION NAME
                                                <>
                                                    <CreateSectionForm
                                                        mode={
                                                            OPERATION_MODE.Edit
                                                        }
                                                        section={
                                                            sectionToEdition
                                                        }
                                                        setOpen={setMode}
                                                        loading={loading}
                                                        collection={
                                                            "management"
                                                        }
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
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Management;
