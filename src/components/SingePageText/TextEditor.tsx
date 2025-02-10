// CORE
"use client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
//import { UserAuth } from "@/context/auth-context";

// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, FormControl, Grid, Paper, Typography } from "@mui/material";
// @ts-ignore

//FIREBASE
import { db } from "../../../firebase/config/clientApp";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";

// UTILS
import { Editor } from "@/utils/editor/editorImport";
import { convertDraftToHtmlWithEmptyBlocks } from "@/utils/editor/convertFunction";

interface editorParams {
    descriptionPL: any;
    descriptionENG: any;
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

    const form = useForm<editorParams>({
        defaultValues: {
            descriptionPL: "",
            descriptionENG: "",
        },
    });

    const onEditorStatePLChange = function (editorState: EditorState) {
        setEditorStatePL(editorState);
        const { blocks } = convertToRaw(editorState.getCurrentContent());

        let text = editorState.getCurrentContent().getPlainText("\u0001");
    };
    const onEditorStateENGChange = function (editorState: EditorState) {
        setEditorStateENG(editorState);
        const { blocks } = convertToRaw(editorState.getCurrentContent());

        let text = editorState.getCurrentContent().getPlainText("\u0001");
    };

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors, isValid, isSubmitted },
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

    const fetchEditor = async () => {
        const collectionRef = collection(db, props.collectionName);
        const docRef = doc(collectionRef, props.collectionId);

        getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setElements({
                        descriptionPL: data.descriptionPL,
                        descriptionENG: data.descriptionENG,
                    });
                } else {
                    alert("Coś poszło nie tak!");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchToEditor = async () => {
        setEditorStatePL(
            EditorState.createWithContent(
                convertFromRaw(elements?.descriptionPL)
            )
        );
        setEditorStateENG(
            EditorState.createWithContent(
                convertFromRaw(elements?.descriptionENG)
            )
        );
    };

    useEffect(() => {
        if (isEditing) {
            fetchToEditor();
        }
    }, [isEditing]);

    useEffect(() => {
        fetchEditor();
    }, []);
    return (
        <>
            {!isEditing ? (
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{ mb: 2 }}
                    onClick={() => setIsEditing(true)}
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
                                onEditorStateChange={(newEditorState) => {
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
                                onEditorStateChange={(newEditorState) => {
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
                                onClick={() => setIsEditing(false)}
                            >
                                Anuluj
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            )}
            {elements && !isEditing && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: convertDraftToHtmlWithEmptyBlocks(
                            elements.descriptionPL
                        ),
                    }}
                />
            )}
        </>
    );
};

export default TextEditorComponent;
