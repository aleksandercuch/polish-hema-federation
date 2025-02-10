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

// TYPES
import { contactParams } from "@/types/management.interface";
import { fileExists } from "@/utils/storage/fileExistInStorage";
import { Loader } from "../loader/loader";

const Contact = () => {
    // refactor na wzór managementu
    const [contactList, setContactList] = useState<contactParams[]>([]);
    const [contactToEdition, setContactToEdition] = useState<contactParams>();
    const [file, setFile] = useState<File>();
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const form = useForm<contactParams>({
        defaultValues: {
            id: contactToEdition?.id || "",
            name: contactToEdition?.name || "",
            descriptionPL: contactToEdition?.descriptionPL || "",
            descriptionENG: contactToEdition?.descriptionENG || "",
            phone: contactToEdition?.phone || "",
            email: contactToEdition?.email || "",
            file: null,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, errors, isValid, isSubmitted },
    } = form;

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
                        deleteDoc(doc(db, "contact", data.id)).then(() => {
                            fetchContact().then(() => setLoading(false));
                        });
                    }
                );
            } else {
                setLoading(false);
            }
        }
    };
    const submitForm = async (data: contactParams) => {
        setLoading(true);
        try {
            let downloadURL = "";

            // If a new file is uploaded
            if (data?.file?.name) {
                const fileName = `contactImages/${addRandomSuffix(
                    data.file.name
                )}`;
                const storageRef = ref(storage, fileName);

                // Upload new image
                const snapshot = await uploadBytes(storageRef, data.file);
                downloadURL = await getDownloadURL(snapshot.ref);

                // Delete old image if it exists and is stored in Firebase
                if (
                    contactToEdition?.file &&
                    typeof contactToEdition.file === "string" &&
                    contactToEdition.file.startsWith(
                        "https://firebasestorage.googleapis.com"
                    )
                ) {
                    const oldImageRef = ref(storage, contactToEdition.file);
                    await deleteObject(oldImageRef).catch((error) => {
                        console.warn("Error deleting old image:", error);
                    });
                }
            }

            if (contactToEdition) {
                // Updating an existing contact
                await updateDoc(doc(db, "contact", contactToEdition.id), {
                    descriptionPL: data.descriptionPL,
                    descriptionENG: data.descriptionENG,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    file: downloadURL || contactToEdition.file,
                });
                setIsEditing(false);
                alert(`Zakończyłeś edycję ${data.name}!`);
            } else {
                // Creating a new contact
                await addDoc(collection(db, "contact"), {
                    descriptionPL: data.descriptionPL,
                    descriptionENG: data.descriptionENG,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    file: downloadURL,
                });
                setIsAdding(false);
                alert("Stworzyłeś nowy kontakt!");
                reset(); // Reset form fields after creation
            }

            setContactToEdition(undefined);
        } catch (error) {
            console.error("Wystąpił błąd:", error);
            alert(`Wystąpił błąd: ${error}`);
        }
        fetchContact().then(() => setLoading(false));
    };

    const editContact = (data: contactParams) => {
        setContactToEdition(data);
        setIsEditing(true);
    };

    const closeAdminPanel = () => {
        contactToEdition && setContactToEdition(undefined);
        reset();
        setIsAdding(false);
        setIsEditing(false);
    };

    const fetchContact = async () => {
        setLoading(true);
        const contactCollection = collection(db, "contact");

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

    useEffect(() => {
        if (contactToEdition) {
            setValue("name", contactToEdition.name || "");
            setValue("descriptionPL", contactToEdition.descriptionPL || "");
            setValue("descriptionENG", contactToEdition.descriptionENG || "");
            setValue("phone", contactToEdition.phone || "");
            setValue("email", contactToEdition.email || "");
        }
    }, [contactToEdition, setValue]);
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
                                                            element.file ||
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
                                                            {element.name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="body1">
                                                            {
                                                                element.descriptionPL
                                                            }
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        container
                                                        xs={12}
                                                    >
                                                        <Grid
                                                            item
                                                            container
                                                            xs={6}
                                                        >
                                                            <Grid item xs={2}>
                                                                <LocalPhoneIcon />
                                                            </Grid>
                                                            <Grid item xs={10}>
                                                                <Typography variant="body1">
                                                                    {
                                                                        element.phone
                                                                    }
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            container
                                                            xs={6}
                                                        >
                                                            <Grid item xs={2}>
                                                                <EmailIcon />
                                                            </Grid>
                                                            <Grid item xs={10}>
                                                                <Typography variant="body1">
                                                                    {
                                                                        element.email
                                                                    }
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
                                                                editContact(
                                                                    element
                                                                )
                                                            }
                                                        >
                                                            Edytuj{" "}
                                                            {element.name}
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
                                                                deleteContact(
                                                                    element
                                                                )
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
                                                onClick={() =>
                                                    setIsAdding(true)
                                                }
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
                                                Edytujesz{" "}
                                                {contactToEdition.name}
                                            </Typography>
                                        )}
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={
                                                file instanceof File
                                                    ? URL.createObjectURL(file)
                                                    : contactToEdition
                                                    ? contactToEdition.file
                                                    : DEFAULT_AVATAR
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
                                                    onChange={(newFile) => {
                                                        setFile(
                                                            newFile as File
                                                        ); // Update state
                                                        field.onChange(newFile); // Pass the files to react-hook-form
                                                    }}
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
                                                    size="small"
                                                    type="text"
                                                    error={Boolean(
                                                        errors[field.name]
                                                    )}
                                                    helperText={
                                                        errors[field.name]
                                                            ?.message
                                                    }
                                                    fullWidth
                                                    sx={{ mb: 3 }}
                                                    {...field}
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
                                                    size="small"
                                                    type="text"
                                                    error={Boolean(
                                                        errors[field.name]
                                                    )}
                                                    helperText={
                                                        errors[field.name]
                                                            ?.message
                                                    }
                                                    fullWidth
                                                    sx={{ mb: 3 }}
                                                    {...field}
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
                                                    variant="outlined"
                                                    size="small"
                                                    type="text"
                                                    error={Boolean(
                                                        errors[field.name]
                                                    )}
                                                    helperText={
                                                        errors[field.name]
                                                            ?.message
                                                    }
                                                    fullWidth
                                                    sx={{ mb: 3 }}
                                                    {...field}
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
                                                    autoComplete="username"
                                                    size="small"
                                                    type="text"
                                                    error={Boolean(
                                                        errors[field.name]
                                                    )}
                                                    helperText={
                                                        errors[field.name]
                                                            ?.message
                                                    }
                                                    fullWidth
                                                    sx={{ mb: 3 }}
                                                    {...field}
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
                                                    size="small"
                                                    type="text"
                                                    error={Boolean(
                                                        errors[field.name]
                                                    )}
                                                    helperText={
                                                        errors[field.name]
                                                            ?.message
                                                    }
                                                    fullWidth
                                                    sx={{ mb: 3 }}
                                                    {...field}
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
                                                    onClick={() =>
                                                        closeAdminPanel()
                                                    }
                                                >
                                                    Anuluj
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Contact;
