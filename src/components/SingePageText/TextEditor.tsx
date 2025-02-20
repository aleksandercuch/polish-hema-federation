// CORE
"use client";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    convertFromRaw,
    EditorState,
    convertToRaw,
    RawDraftContentState,
} from "draft-js";

// CONTEXT
import { UserAuth } from "@/contexts/AuthContext";

// ASSTES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, FormControl, Grid, Typography } from "@mui/material";

//FIREBASE
import { db } from "../../../firebase/config/clientApp";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

// UTILS
import { Editor } from "@/utils/editor/editorImport";
import { convertDraftToHtmlWithEmptyBlocks } from "@/utils/editor/convertFunction";

interface editorParams {
    descriptionPL: string | RawDraftContentState;
    descriptionENG: string | RawDraftContentState;
}

interface pageParams {
    collectionName: string;
    collectionId: string;
}

const TextEditorComponent = (props: pageParams) => {
    const [editorStatePL, setEditorStatePL] = useState(
        EditorState.createEmpty()
    );
    const [editorStateENG, setEditorStateENG] = useState(
        EditorState.createEmpty()
    );
    const [elements, setElements] = useState<editorParams | null>();
    const [isEditing, setIsEditing] = useState(false);
    const currentUser = UserAuth();
    const currentLocale = window.location.pathname.split("/")[1];

    const form = useForm<editorParams>({
        defaultValues: {
            descriptionPL: "",
            descriptionENG: "",
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const submitForm = (data: editorParams) => {
        updateDoc(doc(db, props.collectionName, props.collectionId), {
            descriptionPL: data.descriptionPL,
            descriptionENG: data.descriptionENG,
        })
            .then(() => {
                alert("Zmieniłeś zasady!");
                setIsEditing(false);
                fetchEditor();
            })
            .catch((error) => {
                alert(error);
            });
    };

    const fetchEditor = useCallback(async () => {
        const collectionRef = collection(db, props.collectionName);
        const docRef = doc(collectionRef, props.collectionId);

        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setElements({
                    descriptionPL: data.descriptionPL,
                    descriptionENG: data.descriptionENG,
                });
            } else {
                alert("Coś poszło nie tak!");
            }
        } catch (error) {
            console.log(error);
        }
    }, [props.collectionName, props.collectionId]);

    const fetchToEditor = useCallback(() => {
        if (!elements) return;

        setEditorStatePL(
            EditorState.createWithContent(
                convertFromRaw(elements.descriptionPL as RawDraftContentState)
            )
        );
        setEditorStateENG(
            EditorState.createWithContent(
                convertFromRaw(elements.descriptionENG as RawDraftContentState)
            )
        );
    }, [elements]);

    useEffect(() => {
        if (isEditing) {
            fetchToEditor();
        }
    }, [isEditing, fetchToEditor]);

    useEffect(() => {
        fetchEditor();
    }, [fetchEditor]);
    return (
        <>
            {currentUser?.user?.email && (
                <>
                    {!isEditing ? (
                        <Button
                            color="error"
                            type="submit"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                            onClick={() => setIsEditing(true)}
                            fullWidth
                        >
                            Edytuj
                        </Button>
                    ) : (
                        <FormControl
                            component={"form"}
                            onSubmit={handleSubmit(submitForm)}
                            disabled={isSubmitting}
                        >
                            <Typography variant="h4">Polska wersja</Typography>
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
                                            setEditorStatePL(newEditorState); // Update local state
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
                                            setEditorStateENG(newEditorState); // Update local state
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
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Anuluj
                                    </Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    )}{" "}
                </>
            )}
            {elements && !isEditing && (
                <div
                    style={{ padding: "0 5px" }}
                    dangerouslySetInnerHTML={{
                        __html: convertDraftToHtmlWithEmptyBlocks(
                            currentLocale == "pl"
                                ? (elements.descriptionPL as RawDraftContentState)
                                : (elements.descriptionENG as RawDraftContentState)
                        ),
                    }}
                />
            )}
        </>
    );
};

export default TextEditorComponent;
