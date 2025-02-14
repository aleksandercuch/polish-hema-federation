// CORE
"use client";
import { useCallback, useEffect, useState } from "react";

// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";

//FIREBASE
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

// UTILS

import { DEFAULT_AVATAR } from "@/utils/constants/constants";
import ContactForm from "@/utils/forms/contactForm";

// TYPES
import { contactParams, defaultContact } from "@/types/management.interface";
import { fileExists } from "@/utils/storage/fileExistInStorage";
import { Loader } from "../loader/loader";

//CONTEXT
import { UserAuth } from "@/contexts/AuthContext";
interface IProps {
    storageHref: string;
    collectionName: string;
}

const Contact = (props: IProps) => {
    const [contactList, setContactList] = useState<contactParams[]>([]);
    const [contactToEdition, setContactToEdition] =
        useState<contactParams>(defaultContact);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const currentUser = UserAuth();

    const deleteContact = async (data: contactParams) => {
        if (!data.file) return;
        else {
            const confirmDelete = window.confirm(
                "Czy na pewno chcesz usunąć ten kontakt?"
            );
            if (!confirmDelete) return;

            setLoading(true);

            if (await fileExists(data.file as string)) {
                await deleteObject(ref(storage, data.file as string)).then(
                    () => {
                        deleteDoc(doc(db, props.collectionName, data.id)).then(
                            () => {
                                fetchContact().then(() => setLoading(false));
                            }
                        );
                    }
                );
            } else {
                setLoading(false);
            }
        }
    };

    const editContact = (data: contactParams) => {
        setContactToEdition(data);
        setIsEditing(true);
    };

    const closeAdminPanel = () => {
        setContactToEdition(defaultContact);
        setIsAdding(false);
        setIsEditing(false);
    };

    const fetchContact = useCallback(async () => {
        setLoading(true);
        try {
            const contactCollection = collection(db, props.collectionName);
            const querySnapshot = await getDocs(contactCollection);
            const dataArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })); // @ts-expect-error: temporary solution: temporary solution
            setContactList(dataArray);
        } catch (error) {
            console.error("Error retrieving collection: ", error);
        } finally {
            setLoading(false);
        }
    }, [props.collectionName]);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    return (
        <Grid
            item
            container
            xs={12}
            sm={8}
            spacing={4}
            sx={{ justifyContent: "center" }}
        >
            {loading ? (
                <Grid item>
                    <Loader />
                </Grid>
            ) : (
                <>
                    {!isAdding && !isEditing ? (
                        <>
                            {contactList.map((element) => (
                                <Grid
                                    item
                                    key={element.id}
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
                                    <Grid item xs={12} lg={4}>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={
                                                (element.file as string) ||
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
                                            justifyContent: {
                                                xs: "center",
                                                lg: "flex-start",
                                            },

                                            textAlign: {
                                                xs: "center",
                                                lg: "left",
                                            },
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h5"
                                                component="h4"
                                            >
                                                {element.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">
                                                {element.descriptionPL}
                                            </Typography>
                                        </Grid>
                                        <Grid item container xs={12}>
                                            <Grid item container xs={12} lg={6}>
                                                <Grid item xs={1} lg={2}>
                                                    <LocalPhoneIcon />
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Typography variant="body1">
                                                        {element.phone}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={1}
                                                    lg={2}
                                                    sx={{
                                                        display: {
                                                            xs: "inherit",
                                                            lg: "none",
                                                        },
                                                    }}
                                                >
                                                    <LocalPhoneIcon />
                                                </Grid>
                                            </Grid>
                                            <Grid item container xs={12} lg={6}>
                                                <Grid item xs={1} lg={2}>
                                                    <EmailIcon />
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Typography variant="body1">
                                                        {element.email}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={1}
                                                    lg={2}
                                                    sx={{
                                                        display: {
                                                            xs: "inherit",
                                                            lg: "none",
                                                        },
                                                    }}
                                                >
                                                    <EmailIcon />
                                                </Grid>
                                            </Grid>
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
                                                        editContact(element)
                                                    }
                                                >
                                                    Edytuj {element.name}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                {" "}
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
                                                        deleteContact(element)
                                                    }
                                                >
                                                    Usuń {element.name}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                            {currentUser?.user?.email && (
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
                                        onClick={() => setIsAdding(true)}
                                    >
                                        Dodaj nowy kontakt
                                    </Button>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <ContactForm
                            contact={contactToEdition}
                            closeForm={closeAdminPanel}
                            fetchForm={fetchContact}
                            storageHref={props.storageHref}
                            collectionName={props.collectionName}
                            setIsEditing={setIsEditing}
                            setIsAdding={setIsAdding}
                            setLoading={setLoading}
                        />
                    )}
                </>
            )}
        </Grid>
    );
};

export default Contact;
