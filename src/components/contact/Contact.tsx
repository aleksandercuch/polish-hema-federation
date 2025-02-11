// CORE
"use client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
//import { UserAuth } from "@/context/auth-context";
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
import styles from "@/app/subpage.module.css";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { MuiFileInput } from "mui-file-input";

//FIREBASE
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
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
import { addRandomSuffix } from "@/utils/post/addRandomSuffix";
import { DEFAULT_AVATAR } from "@/utils/constants/constants";
import ContactForm from "@/utils/forms/contactForm";

// TYPES
import { contactParams, defaultContact } from "@/types/management.interface";
import { fileExists } from "@/utils/storage/fileExistInStorage";
import { Loader } from "../loader/loader";

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

    const deleteContact = async (data: contactParams) => {
        // Delete main file if it exists
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
        contactToEdition && setContactToEdition(defaultContact);
        setIsAdding(false);
        setIsEditing(false);
    };

    const fetchContact = async () => {
        setLoading(true);
        const contactCollection = collection(db, props.collectionName);

        getDocs(contactCollection)
            .then((querySnapshot) => {
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(), // Spread the document data
                })); // @ts-ignore
                setContactList(dataArray); // Logs the collection as an array
            })
            .catch((error) => {
                console.error("Error retrieving collection: ", error);
            });
        setLoading(false);
    };

    useEffect(() => {
        fetchContact();
    }, []);

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
                                            src={element.file || DEFAULT_AVATAR}
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
                                                {element.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">
                                                {element.descriptionPL}
                                            </Typography>
                                        </Grid>
                                        <Grid item container xs={12}>
                                            <Grid item container xs={6}>
                                                <Grid item xs={2}>
                                                    <LocalPhoneIcon />
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant="body1">
                                                        {element.phone}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item container xs={6}>
                                                <Grid item xs={2}>
                                                    <EmailIcon />
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant="body1">
                                                        {element.email}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
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
                                    onClick={() => setIsAdding(true)}
                                >
                                    Dodaj nowy kontakt
                                </Button>
                            </Grid>
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
