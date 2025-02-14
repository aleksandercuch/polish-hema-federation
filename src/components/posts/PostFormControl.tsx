"use client";

// CORE
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/subpage.module.css";
import { Controller, useForm } from "react-hook-form";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";

// MATERIAL
import {
    Button,
    Grid,
    Paper,
    Typography,
    FormControl,
    TextField,
    Box,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";

// FIREBASE
import { db, storage } from "../../../firebase/config/clientApp";
import {
    getDownloadURL,
    ref,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { Editor } from "@/utils/editor/editorImport";

// UTILS
import { PostT } from "@/types/post.type";
import { defaultPostValues } from "@/utils/post/postDefaultValues";

// COMPONENTS
import { Loader } from "../loader/loader";
import { OPERATION_MODE } from "@/utils/constants/operationModeEnum";
import { addRandomSuffix } from "@/utils/post/addRandomSuffix";
import { arraysEqual } from "@/utils/array/arrayIsEqual";

interface IProps {
    closeFormControl: Dispatch<SetStateAction<boolean>>;
    mode: OPERATION_MODE;
}

const PostFormControl = (props: IProps) => {
    const [loading, setLoading] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [mainFile, setMainFile] = useState<File[]>([]);
    const { post, setPost } = usePost();
    const [editorStatePL, setEditorStatePL] = useState(
        EditorState.createEmpty()
    );
    const [editorStateENG, setEditorStateENG] = useState(
        EditorState.createEmpty()
    );

    const form = useForm<PostT>({
        defaultValues: post.id ? post : defaultPostValues,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = form;

    const submitForm = async (data: PostT) => {
        setLoading(true);

        try {
            const postRef = post.id ? doc(db, "posts", post.id) : null;
            const isEditMode = props.mode === OPERATION_MODE.Edit;
            let mainFileUrl = post.mainFile;

            mainFileUrl = await handleMainFileUpload(
                data.mainFile,
                mainFileUrl
            );

            const updatedImages = !arraysEqual(
                data.images as string[],
                post.images as string[]
            )
                ? await handleImageUploads(data.images)
                : [];

            const postData = {
                titleENG: data.titleENG,
                titlePL: data.titlePL,
                introENG: data.introENG,
                introPL: data.introPL,
                descriptionENG: data.descriptionENG,
                descriptionPL: data.descriptionPL,
                mainFile: mainFileUrl,
                images: updatedImages.length > 0 ? updatedImages : post.images,
                date: new Date(),
            };

            if (isEditMode && postRef) {
                await updateDoc(postRef, postData);
                alert("Post successfully updated!");
            } else {
                await addDoc(collection(db, "posts"), postData);
                alert("Post successfully added!");
            }
        } catch (error) {
            console.error("Error processing post:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMainFileUpload = async (
        newMainFile: File | string | null,
        existingMainFileUrl: string
    ): Promise<string> => {
        if (!newMainFile) return existingMainFileUrl;

        if (newMainFile instanceof File) {
            const mainFileRef = ref(
                storage,
                `posts/${addRandomSuffix(newMainFile.name)}`
            );
            await uploadBytes(mainFileRef, newMainFile);

            if (existingMainFileUrl) {
                await deleteObject(ref(storage, existingMainFileUrl)).catch(
                    (error) =>
                        console.error("Error deleting old main file:", error)
                );
            }
            return await getDownloadURL(mainFileRef);
        }

        if (typeof newMainFile === "string" && newMainFile.trim() !== "") {
            return newMainFile;
        }

        return existingMainFileUrl;
    };

    const handleImageUploads = async (
        newImages: (File | string)[]
    ): Promise<string[]> => {
        const oldImages = post.images || [];
        const newFiles = uploadedFiles.filter(
            (file) => file instanceof File
        ) as File[];
        const keptUrls = uploadedFiles.filter(
            (file) => typeof file === "string"
        ) as string[];

        const deletedImages = oldImages.filter(
            (url) => !keptUrls.includes(url as string)
        );

        const uploadPromises = newFiles.map(async (file) => {
            const storageRef = ref(
                storage,
                `posts/${addRandomSuffix(file.name)}`
            );
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        });
        const newImageUrls = await Promise.all(uploadPromises);

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

    const fetchDescriptionsToEditor = async () => {
        setEditorStatePL(
            EditorState.createWithContent(convertFromRaw(post.descriptionPL))
        );
        setEditorStateENG(
            EditorState.createWithContent(convertFromRaw(post.descriptionENG))
        );
    };

    useEffect(() => {
        if (props.mode === OPERATION_MODE.Add) {
            post.id && setPost(defaultPostValues);
            reset();
        }
        if (props.mode === OPERATION_MODE.Edit) {
            fetchDescriptionsToEditor();
        }
    }, []);

    return (
        <>
            {loading ? (
                <FormControl
                    component={"form"}
                    onSubmit={handleSubmit(submitForm)}
                    disabled={isSubmitting}
                >
                    {(mainFile.length > 0 || post.mainFile) && (
                        <Image
                            className={styles.postImage}
                            src={
                                mainFile.length > 0 &&
                                mainFile[0] instanceof File
                                    ? URL.createObjectURL(mainFile[0])
                                    : post.mainFile
                            }
                            alt="Example image"
                            fill
                            priority
                        />
                    )}
                    <Controller
                        name={"mainFile"}
                        control={control}
                        render={({ field }) => (
                            <MuiFileInput
                                inputProps={{
                                    accept: ".png, .jpeg, .jpg",
                                }}
                                sx={{ mb: 3 }}
                                {...field}
                                onChange={(file) => {
                                    setMainFile([file] as File[]);
                                    field.onChange(file);
                                }}
                            />
                        )}
                    />
                    <Typography variant="h4">Polska wersja</Typography>
                    <Controller
                        name={"titlePL"}
                        control={control}
                        rules={{
                            required: "Podaj opis!",
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Tytuł PL"
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
                        name={"introPL"}
                        control={control}
                        rules={{
                            required: "Podaj opis!",
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Intro PL"
                                variant="outlined"
                                multiline
                                rows={3}
                                size="small"
                                type="text"
                                error={Boolean(errors[field.name])}
                                fullWidth
                                sx={{ mb: 3 }}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="descriptionPL"
                        control={control}
                        rules={{ required: "Wypełnij!" }}
                        render={({ field }) => (
                            <Editor
                                editorState={editorStatePL}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={(newEditorState) => {
                                    setEditorStatePL(newEditorState);
                                    field.onChange(
                                        convertToRaw(
                                            newEditorState.getCurrentContent()
                                        )
                                    );
                                }}
                            />
                        )}
                    />
                    <Typography variant="h4" sx={{ mt: 3 }}>
                        Angielska wersja
                    </Typography>
                    <Controller
                        name={"titleENG"}
                        control={control}
                        rules={{
                            required: "Podaj opis!",
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Tytuł ENG"
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
                        name={"introENG"}
                        control={control}
                        rules={{
                            required: "Podaj opis!",
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Intro ENG"
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
                        name="descriptionENG"
                        control={control}
                        rules={{ required: "Wypełnij!" }}
                        render={({ field }) => (
                            <Editor
                                editorState={editorStateENG}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={(newEditorState) => {
                                    setEditorStateENG(newEditorState);
                                    field.onChange(
                                        convertToRaw(
                                            newEditorState.getCurrentContent()
                                        )
                                    );
                                }}
                            />
                        )}
                    />
                    <Controller
                        name={"images"}
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
                                    setUploadedFiles(files as File[]);
                                    field.onChange(files);
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
                            : post.images
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
                                            : (file as string)
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
                                variant="contained"
                                size="small"
                                disabled={isSubmitting}
                            >
                                Zapisz zmiany
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => props.closeFormControl(false)}
                            >
                                Anuluj
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default PostFormControl;
