"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/subpage.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import {
    convertFromRaw,
    EditorState,
    RawDraftContentState,
    convertToRaw,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// MOCKS
import { mockedPosts } from "@/mocks/posts.mocks";

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
} from "@mui/material";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

// UTILS
import { Editor } from "@/utils/editor/editorImport";
import { MuiFileInput } from "mui-file-input";
import { Post } from "@/types/post.type";
import { defaultPostValues } from "@/utils/post/postDefaultValues";

const page = () => {
    const [loading, setLoading] = useState(true);
    const { post, setPost } = usePost();
    const [isEditing, setIsEditing] = useState(false);
    const [editorStatePL, setEditorStatePL] = useState(
        EditorState.createEmpty()
    );
    const [editorStateENG, setEditorStateENG] = useState(
        EditorState.createEmpty()
    );

    const form = useForm<Post>({
        defaultValues: defaultPostValues,
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors, isValid, isSubmitted },
    } = form;

    const submitForm = (data: Post) => {
        // updateDoc(doc(db, "rules", "Jln6vLueJh7byiux8FsW"), {
        //     descriptionPL: data.descriptionPL,
        //     descriptionENG: data.descriptionENG,
        // })
        //     .then(() => {
        //         alert("Zmieniłeś zasady!");
        //         setIsEditing(false);
        //         fetchRules();
        //     })
        //     .catch((error) => {
        //         alert(error);
        //     });
    };

    const fetchPost = async () => {
        setLoading(true);
        try {
            // MOCKS
            const response = await mockedPosts;
            setPost(response[0]);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const convertImagesToGallery = (urls: string[]) => {
        const convertedImages = urls.map((url) => {
            return { original: url, thumbnail: url };
        });
        return convertedImages;
    };

    useEffect(() => {
        if (!post.id) {
            fetchPost();
        }
    }, []);

    return (
        <Grid container className={styles.mainContainer}>
            <Grid item className={styles.postBanner}>
                <Image src="/banner.jpg" alt="Example image" fill priority />
            </Grid>
            <Paper className={styles.subpageBackground}>
                <Paper>
                    <Link href={"/posts"}>
                        <Button>Wszystkie posty</Button>
                    </Link>
                </Paper>
                <Paper className={styles.postContainer}>
                    {post && (
                        <>
                            {!isEditing ? (
                                <Grid
                                    container
                                    direction="column"
                                    spacing={8}
                                    sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <Grid
                                        item
                                        container
                                        direction="column"
                                        spacing={3}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Grid item>
                                            <Typography variant="h3">
                                                {post.titlePL}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">
                                                {dayjs(post.date).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Image
                                                className={styles.postImage}
                                                src={post.mainFile}
                                                alt="Example image"
                                                fill
                                                priority
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            container
                                            direction="row"
                                            spacing={2}
                                        >
                                            <Grid item xs={6}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    fullWidth
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                >
                                                    Edytuj
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {" "}
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    fullWidth
                                                    onClick={() =>
                                                        console.log("test")
                                                    }
                                                >
                                                    Usuń
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item container>
                                        {post.descriptionPL}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        className={styles.galleryContainer}
                                    >
                                        {/* <ImageGallery
                                            items={convertImagesToGallery(
                                                post.images
                                            )}
                                            showFullscreenButton={true}
                                            startIndex={1}
                                        /> */}
                                    </Grid>
                                </Grid>
                            ) : (
                                <FormControl
                                    component={"form"}
                                    onSubmit={handleSubmit(submitForm)}
                                    disabled={isSubmitting}
                                >
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
                                            />
                                        )}
                                    />
                                    <Typography variant="h4">
                                        Polska wersja
                                    </Typography>
                                    <Controller
                                        name={"titlePL"}
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
                                                    post
                                                        ? post.descriptionPL
                                                        : ""
                                                }
                                                size="small"
                                                type="text"
                                                error={Boolean(
                                                    errors[field.name]
                                                )}
                                                helperText={
                                                    errors[field.name]?.message
                                                }
                                                fullWidth
                                                sx={{ mb: 3 }}
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
                                                label="Opis PL"
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                defaultValue={
                                                    post ? post.introPL : ""
                                                }
                                                size="small"
                                                type="text"
                                                error={Boolean(
                                                    errors[field.name]
                                                )}
                                                // helperText={
                                                //     errors[field.name]?.message
                                                // }
                                                fullWidth
                                                sx={{ mb: 3 }}
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
                                                onEditorStateChange={(
                                                    newEditorState
                                                ) => {
                                                    setEditorStatePL(
                                                        newEditorState
                                                    ); // Update local state
                                                    field.onChange(
                                                        convertToRaw(
                                                            newEditorState.getCurrentContent()
                                                        )
                                                    ); // Sync with react-hook-form
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
                                                label="Opis PL"
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                defaultValue={
                                                    post ? post.titleENG : ""
                                                }
                                                size="small"
                                                type="text"
                                                error={Boolean(
                                                    errors[field.name]
                                                )}
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
                                            required: "Podaj opis!",
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                label="Opis PL"
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                defaultValue={
                                                    post
                                                        ? post.descriptionENG
                                                        : ""
                                                }
                                                size="small"
                                                type="text"
                                                error={Boolean(
                                                    errors[field.name]
                                                )}
                                                // helperText={
                                                //     errors[field.name]?.message
                                                // }
                                                fullWidth
                                                sx={{ mb: 3 }}
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
                                                onEditorStateChange={(
                                                    newEditorState
                                                ) => {
                                                    setEditorStateENG(
                                                        newEditorState
                                                    ); // Update local state
                                                    field.onChange(
                                                        convertToRaw(
                                                            newEditorState.getCurrentContent()
                                                        )
                                                    ); // Sync with react-hook-form
                                                }}
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
                                                onClick={() =>
                                                    setIsEditing(false)
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
                </Paper>
            </Paper>
        </Grid>
    );
};

export default page;
