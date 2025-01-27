// CORE
"use client";
import { ComponentType, FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    convertFromRaw,
    EditorState,
    RawDraftContentState,
    convertToRaw,
} from "draft-js";
//import { UserAuth } from "@/context/auth-context";
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, FormControl, Grid, Paper, Typography } from "@mui/material";
import styles from "@/app/subpage.module.css";
// @ts-ignore
import draftToHtml from "draftjs-to-html";

//FIREBASE
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../firebase/config/clientApp";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

// COMPONENTS
import { SubPageBanner } from "@/components/banner/SubPageBanner";

// UTILS
import { Editor } from "@/utils/editor/editorImport";

interface pageParams {
    descriptionPL: any;
    descriptionENG: any;
}

const preprocessRawContentState = (
    rawContentState: RawDraftContentState
): RawDraftContentState => {
    const modifiedBlocks = rawContentState.blocks.map((block) => {
        if (block.type === "unstyled" && !block.text.trim()) {
            return {
                ...block,
                text: "\u200B", // Zero-width space character to preserve empty blocks
            };
        }
        return block;
    });

    return {
        ...rawContentState,
        blocks: modifiedBlocks,
    };
};

const convertDraftToHtmlWithEmptyBlocks = (
    description: RawDraftContentState
): string => {
    const preprocessedContentState = preprocessRawContentState(description);
    return draftToHtml(preprocessedContentState);
};

const Rules = () => {
    const [editorStatePL, setEditorStatePL] = useState(
        EditorState.createEmpty()
    );
    const [editorStateENG, setEditorStateENG] = useState(
        EditorState.createEmpty()
    );
    const [rules, setRules] = useState<pageParams | null>();

    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<pageParams>({
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

    const submitForm = (data: pageParams) => {
        updateDoc(doc(db, "rules", "Jln6vLueJh7byiux8FsW"), {
            descriptionPL: data.descriptionPL,
            descriptionENG: data.descriptionENG,
        })
            .then(() => {
                alert("Zmieniłeś zasady!");
                setIsEditing(false);
                fetchRules();
            })
            .catch((error) => {
                alert(error);
            });
    };

    const fetchRules = async () => {
        const rulesCollection = collection(db, "rules");
        const rulesDocRef = doc(rulesCollection, "Jln6vLueJh7byiux8FsW");

        getDoc(rulesDocRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const rulesData = docSnapshot.data();
                    setRules({
                        descriptionPL: rulesData.descriptionPL,
                        descriptionENG: rulesData.descriptionENG,
                    });
                } else {
                    alert("Coś poszło nie tak!");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchRulesToEditor = async () => {
        setEditorStatePL(
            EditorState.createWithContent(convertFromRaw(rules?.descriptionPL))
        );
        setEditorStateENG(
            EditorState.createWithContent(convertFromRaw(rules?.descriptionENG))
        );
    };

    useEffect(() => {
        if (isEditing) {
            fetchRulesToEditor();
        }
    }, [isEditing]);

    useEffect(() => {
        fetchRules();
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
                        <Typography variant="h3">Zasady</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
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
                                <Typography variant="h4">
                                    Polska wersja
                                </Typography>
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
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Anuluj
                                        </Button>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        )}
                        {rules && !isEditing && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: convertDraftToHtmlWithEmptyBlocks(
                                        rules.descriptionPL
                                    ),
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Rules;
