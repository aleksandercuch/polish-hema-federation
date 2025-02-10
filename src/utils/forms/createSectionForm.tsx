// CORE
"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
//import { UserAuth } from "@/context/auth-context";

// ASSETES
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    Button,
    FormControl,
    Grid,
    Typography,
    TextField,
} from "@mui/material";

// @ts-ignore

//FIREBASE
import { db } from "../../../firebase/config/clientApp";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

// COMPONENTS
import { Loader } from "@/components/loader/loader";

// TYPES
import { memberParams } from "@/types/management.interface";
import { OPERATION_MODE } from "../constants/operationModeEnum";

export interface sectionParams {
    id: string;
    name: string;
    members: memberParams[];
}

interface IProps {
    setOpen: Dispatch<SetStateAction<OPERATION_MODE>>;
    mode: OPERATION_MODE;
    section?: sectionParams;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const CreateSectionForm = (props: IProps) => {
    const form = useForm<sectionParams>({
        defaultValues: {
            name: props.section ? props.section.name : "",
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors, isValid, isSubmitted },
    } = form;

    const submitForm = (data: sectionParams) => {
        props.setLoading(true);
        if (props.section && props.section.id) {
            // EDITION
            updateDoc(doc(db, "management", props.section.id), {
                name: data.name,
                members: props.section.members,
            })
                .then(() => {
                    alert(`Zakończyłeś edycję ${data.name}!`);
                    reset();
                    props.setOpen(OPERATION_MODE.None);
                })
                .catch((error) => {
                    alert(error);
                });
        } else {
            //ADDING
            addDoc(collection(db, "management"), {
                name: data.name,
                members: [],
            }).then(() => {
                alert("Stworzyłeś nową sekcję!");
                reset();
                props.setOpen(OPERATION_MODE.None);
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
                {props.mode === OPERATION_MODE.Edit && props.section ? (
                    <>Edytujesz {props.section.name}</>
                ) : (
                    <>Dodajesz nową sekcję</>
                )}
            </Typography>

            <>
                {" "}
                <Controller
                    name={"name"}
                    control={control}
                    rules={{
                        required: "Podaj nazwę!",
                    }}
                    render={({ field }) => (
                        <TextField
                            label="Nazwa sekcji"
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

export default CreateSectionForm;
