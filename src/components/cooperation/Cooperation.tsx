import { Avatar, Button, Grid, Typography } from "@mui/material";
import TextEditorComponent from "../SingePageText/TextEditor";
import {
    defaultMember,
    defaultSection,
    memberParams,
    sectionParams,
} from "@/types/management.interface";
import { useEffect, useState } from "react";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";
import { DEFAULT_AVATAR } from "@/utils/constants/constants";
import { deleteObject, ref } from "firebase/storage";
import { fileExists } from "@/utils/storage/fileExistInStorage";
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";
import { storage, db } from "../../../firebase/config/clientApp";
import { Loader } from "../loader/loader";
import {
    cooperationParams,
    defaultCooperation,
} from "@/types/cooperation.interface";
import { removeElementAtIndex } from "@/utils/array/deleteWithIndex";
import { MemberForm } from "@/utils/forms/memberForm";

export const Cooperation = () => {
    const [cooperation, setCooperation] =
        useState<cooperationParams>(defaultCooperation);
    const [memberToEdition, setMemberToEdition] =
        useState<memberParams>(defaultMember);

    const [mode, setMode] = useState<OPERATION_MODE>(OPERATION_MODE.None);
    const [loading, setLoading] = useState(false);

    const handleEditMember = (section: sectionParams, member: memberParams) => {
        setMode(OPERATION_MODE.Edit);
        setMemberToEdition(member);
    };

    // const handleDeleteMember = async (
    //     member: memberParams
    // ) => {

    //     const confirmDelete = window.confirm(
    //         `Czy na pewno chcesz usunąć ${member.name}?`
    //     );
    //     if (!confirmDelete) return;
    //     setLoading(true);

    //     try {
    //         // Delete image if  exists
    //         if (member.file && (await fileExists(member.file))) {
    //             await deleteObject(ref(storage, member.file));
    //         }

    //         // Update document
    //         const updatedMembers = removeElementAtIndex(
    //             cooperation?.members,
    //             member.id
    //         );
    //         // Updating an existing member
    //         await updateDoc(doc(db, "management", section.id), {
    //             descriptionAng: cooperation?.descriptionAng,
    //             descriptionPl: cooperation?.descriptionPl,
    //             members: updatedMembers,
    //         });

    //         alert(`Zakończyłeś usuwanie!`);
    //         fetchSections().then(() => setLoading(false));
    //     } catch (error) {
    //         alert(`Wystąpił błąd podczas usuwania ${member.name}`);
    //     }
    // };
    // const handleAddMember = (section: sectionParams) => {
    //     setMode(OPERATION_MODE.Add);
    //     setSectionToEdition(section);
    // };

    const fetchCooperation = async () => {
        const cooperationCollection = collection(db, "cooperation");

        getDocs(cooperationCollection)
            .then((querySnapshot) => {
                const dataArray = querySnapshot.docs.map((doc) => ({
                    ...doc.data(), // Spread the document data
                })); // @ts-ignore
                setCooperation(dataArray); // Logs the collection as an array
                console.log(dataArray);
            })
            .catch((error) => {
                console.error("Error retrieving collection: ", error);
            });
    };

    useEffect(() => {
        if (mode === OPERATION_MODE.None) {
            fetchCooperation();
        }
    }, [mode]);
    return (
        <Grid
            container
            direction="row"
            sx={{
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "none",
                padding: "0 5px",
            }}
            spacing={8}
            xs={12}
        >
            <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="h3">Cooperation</Typography>
            </Grid>
            {loading ? (
                <Grid item>
                    <Loader />
                </Grid>
            ) : (
                <>
                    {mode === OPERATION_MODE.None ? (
                        <>
                            <Grid item xs={12} sm={8}>
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    md={6}
                                    sx={{
                                        paddingBottom: "40px",
                                        textAlign: {
                                            xs: "center",
                                            sm: "left",
                                        },
                                    }}
                                    spacing={2}
                                >
                                    {cooperation &&
                                        cooperation.members &&
                                        cooperation.members.map((member) => (
                                            <Grid item xs={12} key={member.id}>
                                                <Grid item xs={12} lg={4}>
                                                    <Avatar
                                                        alt="Remy Sharp"
                                                        src={
                                                            member.file ||
                                                            DEFAULT_AVATAR
                                                        }
                                                        sx={{
                                                            width: 156,
                                                            height: 156,
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
                                                >
                                                    <Grid item xs={12}>
                                                        <Typography
                                                            variant="h5"
                                                            component="h4"
                                                        >
                                                            {member.name}
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
                                                    {" "}
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
                                                            Edytuj {member.name}
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
                                            </Grid>
                                        ))}
                                    <Grid
                                        item
                                        container
                                        xs={6}
                                        sx={{ paddingBottom: "40px" }}
                                    >
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            size="small"
                                            sx={{ mb: 2 }}
                                            onClick={() =>
                                                setMode(OPERATION_MODE.Add)
                                            }
                                        >
                                            Dodaj nowy kontakt
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextEditorComponent
                                    collectionName="cooperation"
                                    collectionId="MgjzyLQzaSOhPxrF6hjd"
                                />{" "}
                            </Grid>
                        </>
                    ) : (
                        <>
                            {mode === OPERATION_MODE.Add ? (
                                <>
                                    <MemberForm
                                        mode={OPERATION_MODE.Edit}
                                        section={sectionToEdition}
                                        setOpen={setMode}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                </>
                            ) : (
                                <>
                                    <MemberForm
                                        mode={OPERATION_MODE.Edit}
                                        section={sectionToEdition}
                                        setOpen={setMode}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </Grid>
    );
};
