// CORE
"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface IProps {
    closeForm: () => void;
    fetchForm: () => Promise<void>;
    storageHref: string;
    collectionName: string;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    setIsAdding: Dispatch<SetStateAction<boolean>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    contact: contactParams;
}

const ContactForm = (props: IProps) => {
    const [contactToEdition, setContactToEdition] = useState<contactParams>();
    const [file, setFile] = useState<File>();

    const form = useForm<contactParams>({
        defaultValues: {
            id: props.contact?.id || "",
            name: props.contact?.name || "",
            descriptionPL: props.contact?.descriptionPL || "",
            descriptionENG: props.contact?.descriptionENG || "",
            phone: props.contact?.phone || "",
            email: props.contact?.email || "",
            file: null,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, errors },
    } = form;

    const submitForm = async (data: contactParams) => {
        props.setLoading(true);
        try {
            let downloadURL = "";

            // If a new file is uploaded
            if (data?.file?.name) {
                const fileName = `${props.storageHref}/${addRandomSuffix(
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
            if (props.contact.id != "") {
                // Updating an existing contact
                await updateDoc(
                    doc(db, props.collectionName, props.contact.id),
                    {
                        descriptionPL: data.descriptionPL,
                        descriptionENG: data.descriptionENG,
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        file: downloadURL || props.contact.file,
                    }
                );
                props.setIsEditing(false);
                alert(`Zakończyłeś edycję ${data.name}!`);
            } else {
                // Creating a new contact
                await addDoc(collection(db, props.collectionName), {
                    descriptionPL: data.descriptionPL,
                    descriptionENG: data.descriptionENG,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    file: downloadURL,
                });
                props.setIsAdding(false);
                alert("Stworzyłeś nowy kontakt!");
                reset(); // Reset form fields after creation
            }

            setContactToEdition(undefined);
        } catch (error) {
            console.error("Wystąpił błąd:", error);
            alert(`Wystąpił błąd: ${error}`);
        }
        props.fetchForm().then(() => props.setLoading(false));
    };

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
                    file instanceof File
                        ? URL.createObjectURL(file)
                        : props.contact
                        ? props.contact.file
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
                            setFile(newFile as File); // Update state
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
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name]?.message}
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
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name]?.message}
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
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name]?.message}
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
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name]?.message}
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
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name]?.message}
                        fullWidth
                        sx={{ mb: 3 }}
                        {...field}
                    />
                )}
            />
            <Grid container direction="row" spacing={1} sx={{ mt: 5 }}>
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
                        onClick={() => props.closeForm()}
                    >
                        Anuluj
                    </Button>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default ContactForm;
