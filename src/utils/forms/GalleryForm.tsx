// CORE
"use client";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, FormControl, Grid, Typography, Box } from "@mui/material";
import { MuiFileInput } from "mui-file-input";

// @ts-ignore

//FIREBASE
import { db, storage } from "../../../firebase/config/clientApp";
import { doc, updateDoc } from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

// TYPES
import { memberParams } from "@/types/management.interface";

// UTILS
import { OPERATION_MODE } from "../constants/operationModeEnum";
import { addRandomSuffix } from "../post/addRandomSuffix";
import { arraysEqual } from "../array/arrayIsEqual";

export interface sectionParams {
    id: string;
    name: string;
    members: memberParams[] | string[];
}

interface galleryRequest {
    members: File[] | string[];
}

interface IProps {
    setOpen: Dispatch<SetStateAction<OPERATION_MODE>>;
    mode: OPERATION_MODE;
    section?: sectionParams;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    collection: string;
}

const GalleryForm = (props: IProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const form = useForm<galleryRequest>({
        defaultValues: {
            members: [],
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = form;

    const handleImageUploads = async (
        newImages: (File | string)[]
    ): Promise<string[]> => {
        const oldImages = (props.section && props.section.members) || [];
        const newFiles = uploadedFiles.filter(
            (file) => file instanceof File
        ) as File[];
        const keptUrls = uploadedFiles.filter(
            (file) => typeof file === "string"
        ) as string[];

        // Identify deleted images
        const deletedImages = oldImages.filter(
            (url) => !keptUrls.includes(url as string)
        );

        // Upload new images
        const uploadPromises = newFiles.map(async (file) => {
            const storageRef = ref(
                storage,
                `gallery/${addRandomSuffix(file.name)}`
            );
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        });
        const newImageUrls = await Promise.all(uploadPromises);

        // Delete removed images
        await Promise.all(
            deletedImages.map(async (imageUrl) => {
                const imageRef = ref(storage, imageUrl as string);
                await deleteObject(imageRef).catch((error) =>
                    console.error("Error deleting file:", error)
                );
            })
        );

        return keptUrls.concat(newImageUrls);
    };

    const submitForm = async (data: galleryRequest) => {
        props.setLoading(true);
        if (props.section && props.section.id) {
            // Handle Images Upload
            const updatedImages = !arraysEqual(
                data.members as string[],
                props.section.members as string[]
            )
                ? await handleImageUploads(data.members)
                : [];

            updateDoc(doc(db, props.collection, props.section.id), {
                name: props.section.name,
                members:
                    data.members.length > 0
                        ? updatedImages
                        : props.section.members,
            })
                .then(() => {
                    alert(`Zakończyłeś edycję!`);
                    reset();
                    props.setOpen(OPERATION_MODE.None);
                })
                .catch((error) => {
                    alert(error);
                });
        }
        props.setLoading(false);
    };

    return (
        <FormControl
            component={"form"}
            onSubmit={handleSubmit(submitForm)}
            disabled={isSubmitting}
        >
            <Typography variant="h4" sx={{ mb: "10px" }}>
                {props.section && <>Dodajesz zdjęcia {props.section.name}</>}
            </Typography>

            <>
                <Typography variant="body1">
                    Edytuj wszystkie zdjęcia
                </Typography>
                <Controller
                    name={"members"}
                    control={control}
                    render={({ field }) => (
                        <MuiFileInput
                            multiple
                            inputProps={{
                                accept: ".png, .jpeg, .jpg",
                            }}
                            sx={{ mb: 3 }}
                            value={uploadedFiles}
                            onChange={(files) => {
                                setUploadedFiles(files as File[]); // Update state
                                field.onChange(files); // Pass the files to react-hook-form
                            }}
                        />
                    )}
                />
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        mt: 2,
                    }}
                >
                    {(uploadedFiles.length > 0
                        ? uploadedFiles
                        : (props.section?.members as string[])
                    ).map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                width: 100,
                                height: 100,
                            }}
                        >
                            <Image
                                src={
                                    uploadedFiles.length > 0 &&
                                    file instanceof File
                                        ? URL.createObjectURL(file)
                                        : (file as string) // Use URL if no valid File
                                }
                                alt={`Uploaded Preview ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                            />
                        </Box>
                    ))}
                </Box>
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
                            Zapisz sekcje
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
            </>
        </FormControl>
    );
};

export default GalleryForm;
