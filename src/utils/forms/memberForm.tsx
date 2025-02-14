// CORE
"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    Avatar,
    Button,
    FormControl,
    Grid,
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
import { doc, updateDoc } from "firebase/firestore";

// COMPONENTS
import { addRandomSuffix } from "@/utils/post/addRandomSuffix";
import { DEFAULT_AVATAR } from "@/utils/constants/constants";

// TYPES
import { memberParams, sectionParams } from "@/types/management.interface";
import { OPERATION_MODE } from "../constants/operationModeEnum";

interface IProps {
    setOpen: Dispatch<SetStateAction<OPERATION_MODE>>;
    mode: OPERATION_MODE;
    section: sectionParams;
    member?: memberParams;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

function updateArrayElement<T>(array: T[], index: number, newValue: T): T[] {
    if (index < 0 || index >= array.length) {
        throw new Error("Index out of bounds");
    }

    return array.map((item, i) => (i === index ? newValue : item));
}

export const MemberForm = (props: IProps) => {
    const [file, setFile] = useState<File>();

    const form = useForm<memberParams>({
        defaultValues: {
            name: props.member?.name || "",
            descriptionPL: props.member?.descriptionPL || "",
            descriptionENG: props.member?.descriptionENG || "",
            file: "",
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, errors },
    } = form;

    const submitForm = async (data: memberParams) => {
        props.setLoading(true);
        const sectionMembers = props.section.members as memberParams[];
        try {
            let downloadURL = "";

            if (data?.file instanceof File) {
                const fileName = `managementImages/${addRandomSuffix(
                    data.file.name
                )}`;
                const storageRef = ref(storage, fileName);

                const snapshot = await uploadBytes(storageRef, data.file);
                downloadURL = await getDownloadURL(snapshot.ref);

                if (
                    props.member?.file &&
                    typeof props.member.file === "string" &&
                    props.member.file.startsWith(
                        "https://firebasestorage.googleapis.com"
                    )
                ) {
                    const oldImageRef = ref(storage, props.member.file);
                    await deleteObject(oldImageRef).catch((error) => {
                        console.warn("Error deleting old image:", error);
                    });
                }
            }
            const newMember: memberParams = {
                id: props.member!.id || props.section.members.length,
                descriptionPL: data.descriptionPL,
                descriptionENG: data.descriptionENG,
                name: data.name,
                file:
                    downloadURL != ""
                        ? downloadURL
                        : (props.member!.file as string),
            };

            if (props.mode === OPERATION_MODE.Edit && props.member) {
                const updatedMembers = updateArrayElement(
                    sectionMembers,
                    props.member.id,
                    newMember
                );

                await updateDoc(doc(db, "management", props.section.id), {
                    name: props.section.name,
                    members: updatedMembers,
                });

                alert(`Zakończyłeś edycję ${data.name}!`);
            } else {
                sectionMembers.push(newMember);

                await updateDoc(doc(db, "management", props.section.id), {
                    name: props.section.name,
                    members: sectionMembers,
                });

                alert("Zauktualizowałeś sekcję!");
                reset();
            }
        } catch (error) {
            console.error("Wystąpił błąd:", error);
            alert(`Wystąpił błąd: ${error}`);
        }
        props.setLoading(false);
        props.setOpen(OPERATION_MODE.None);
    };

    useEffect(() => {
        if (props.member) {
            setValue("name", props.member.name || "");
            setValue("descriptionPL", props.member.descriptionPL || "");
            setValue("descriptionENG", props.member.descriptionENG || "");
        }
    }, [props.member, setValue]);

    return (
        <FormControl
            component={"form"}
            onSubmit={handleSubmit(submitForm)}
            disabled={isSubmitting}
        >
            {props.member && (
                <Typography variant="h4">
                    Edytujesz {props.member.name}
                </Typography>
            )}
            <Avatar
                alt="Remy Sharp"
                src={
                    file instanceof File
                        ? URL.createObjectURL(file)
                        : props.member
                        ? (props.member.file as string)
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
                    // @ts-expect-error
                    <MuiFileInput
                        inputProps={{
                            accept: ".png, .jpeg, .jpg",
                        }}
                        sx={{ mb: 3 }}
                        {...field}
                        onChange={(newFile) => {
                            setFile(newFile as File);
                            field.onChange(newFile);
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
                        onClick={() => props.setOpen(OPERATION_MODE.None)}
                    >
                        Anuluj
                    </Button>
                </Grid>
            </Grid>
        </FormControl>
    );
};
