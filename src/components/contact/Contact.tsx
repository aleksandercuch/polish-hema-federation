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
import styles from "@/app/subpage.module.css";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { MuiFileInput } from "mui-file-input";

// @ts-ignore
import draftToHtml from "draftjs-to-html";

//FIREBASE
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";

interface contactParams {
    id: string;
    name: string;
    descriptionENG: string;
    descriptionPL: string;
    file: any;
    phone: string;
    email: string;
    image: string;
}

const Contact = () => {
    const [contactList, setContactList] = useState<contactParams[]>([]);
    const [contactToEdition, setContactToEdition] = useState<contactParams>();

    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const form = useForm<contactParams>({
        defaultValues: {
            name: "",
            descriptionENG: "",
            descriptionPL: "",
            phone: "",
            email: "",
            file: undefined,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors, isValid, isSubmitted },
    } = form;

    const submitForm = (data: contactParams) => {
        if (contactToEdition) {
            const storageRef = ref(storage, `postsImages/${data.file.name}`);
            uploadBytes(storageRef, data.file).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                updateDoc(doc(db, "contact", contactToEdition.id), {
                    descriptionPL: data.descriptionPL,
                    descriptionENG: data.descriptionENG,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    file: downloadURL,
                })
                    .then(() => {
                        alert(`Zakończyłeś edycję ${data.name}!`);
                        setContactToEdition(undefined);
                        setIsEditing(false);
                        //  fetchRules();
                    })
                    .catch((error) => {
                        alert(error);
                    });
            });
        } else {
            const storageRef = ref(storage, `contactImages/${data.file.name}`);

            uploadBytes(storageRef, data.file)
                .then(async (snapshot) => {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    addDoc(collection(db, "contact"), {
                        descriptionPL: data.descriptionPL,
                        descriptionENG: data.descriptionENG,
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        file: downloadURL,
                    }).then(() => {
                        alert("Stworzyłeś nowy kontakt!");
                        setContactToEdition(undefined);
                        setIsEditing(false);
                        reset();
                    });
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    const editContact = (data: contactParams) => {
        setContactToEdition(data);
        setIsEditing(true);
    };

    const closeAdminPanel = () => {
        contactToEdition && setContactToEdition(undefined);
        setIsAdding(false);
        setIsEditing(false);
    };

    const fetchContact = async () => {
        const contactCollection = collection(db, "contact");

        getDocs(contactCollection)
            .then((querySnapshot) => {
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.data().id,
                    ...doc.data(), // Spread the document data
                }));
                setContactList(dataArray); // Logs the collection as an array
            })
            .catch((error) => {
                console.error("Error retrieving collection: ", error);
            });
    };

    useEffect(() => {
        fetchContact();
    }, []);
    return (
        <Grid container className={styles.mainContainer} xs={12}>
            <SubPageBanner />
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
                    spacing={8}
                    xs={12}
                >
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant="h3">Kontakt</Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={12}
                        sm={8}
                        spacing={4}
                        sx={{ justifyContent: "center" }}
                    >
                        {!isAdding && !isEditing && contactList.length ? (
                            <>
                                {contactList.map((element) => (
                                    <Grid
                                        item
                                        key={element.phone}
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
                                                    element.image ||
                                                    "/static/images/avatar/1.jpg"
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
                                        >
                                            <Button
                                                type="submit"
                                                color="error"
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2, mt: 2 }}
                                                onClick={() =>
                                                    editContact(element)
                                                }
                                            >
                                                Edytuj {element.name}
                                            </Button>
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
                            <FormControl
                                component={"form"}
                                onSubmit={handleSubmit(submitForm)}
                                disabled={isSubmitting}
                            >
                                {contactToEdition && (
                                    <Typography variant="h4">
                                        Edytujesz {contactToEdition.name}
                                    </Typography>
                                )}
                                <Avatar
                                    alt="Remy Sharp"
                                    src={
                                        contactToEdition
                                            ? contactToEdition.file
                                            : "/static/images/avatar/1.jpg"
                                    }
                                    sx={{
                                        width: 156,
                                        height: 156,
                                        margin: "auto",
                                        mb: "30px",
                                    }}
                                />
                                <Controller
                                    name={"file"}
                                    control={control}
                                    render={({ field }) => (
                                        <MuiFileInput
                                            inputProps={{
                                                accept: ".png, .jpeg, .jpg",
                                            }}
                                            sx={{ mb: 3 }}
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={"name"}
                                    control={control}
                                    rules={{
                                        required: "Podaj imię!",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            label="Imię"
                                            variant="outlined"
                                            defaultValue={
                                                contactToEdition
                                                    ? contactToEdition.name
                                                    : ""
                                            }
                                            size="small"
                                            type="text"
                                            error={Boolean(errors[field.name])}
                                            helperText={
                                                errors[field.name]?.message
                                            }
                                            fullWidth
                                            sx={{ mb: 3 }}
                                        />
                                    )}
                                />
                                <Controller
                                    name={"descriptionPL"}
                                    control={control}
                                    rules={{
                                        required: "Podaj opis!",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            label="Opis PL"
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            defaultValue={
                                                contactToEdition
                                                    ? contactToEdition.descriptionPL
                                                    : ""
                                            }
                                            size="small"
                                            type="text"
                                            error={Boolean(errors[field.name])}
                                            helperText={
                                                errors[field.name]?.message
                                            }
                                            fullWidth
                                            sx={{ mb: 3 }}
                                        />
                                    )}
                                />
                                <Controller
                                    name={"descriptionENG"}
                                    control={control}
                                    rules={{
                                        required: "Podaj opis ENG",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            label="Opis ENG"
                                            multiline
                                            rows={3}
                                            defaultValue={
                                                contactToEdition
                                                    ? contactToEdition.descriptionENG
                                                    : ""
                                            }
                                            variant="outlined"
                                            size="small"
                                            type="text"
                                            error={Boolean(errors[field.name])}
                                            helperText={
                                                errors[field.name]?.message
                                            }
                                            fullWidth
                                            sx={{ mb: 3 }}
                                        />
                                    )}
                                />
                                <Controller
                                    name={"phone"}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            label="Telefon"
                                            variant="outlined"
                                            defaultValue={
                                                contactToEdition
                                                    ? contactToEdition.phone
                                                    : ""
                                            }
                                            autoComplete="username"
                                            size="small"
                                            type="text"
                                            error={Boolean(errors[field.name])}
                                            helperText={
                                                errors[field.name]?.message
                                            }
                                            fullWidth
                                            sx={{ mb: 3 }}
                                        />
                                    )}
                                />
                                <Controller
                                    name={"email"}
                                    control={control}
                                    rules={{
                                        required: "Podaj email!",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            label="Email"
                                            variant="outlined"
                                            defaultValue={
                                                contactToEdition
                                                    ? contactToEdition.email
                                                    : ""
                                            }
                                            size="small"
                                            type="text"
                                            error={Boolean(errors[field.name])}
                                            helperText={
                                                errors[field.name]?.message
                                            }
                                            fullWidth
                                            sx={{ mb: 3 }}
                                        />
                                    )}
                                />
                                <Grid
                                    container
                                    direction="row"
                                    spacing={1}
                                    sx={{ mt: 5 }}
                                >
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            disabled={isSubmitting}
                                        >
                                            Zapisz zmiany
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="small"
                                            color="error"
                                            onClick={() => closeAdminPanel()}
                                        >
                                            Anuluj
                                        </Button>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Contact;
