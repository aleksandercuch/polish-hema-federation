"use client";

// CORE
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// MATERIAL
import { Button, Grid, FormControl } from "@mui/material";
import { MuiFileInput } from "mui-file-input";

// FIREBASE
import { storage } from "../../../firebase/config/clientApp";
import { ref, uploadBytes } from "firebase/storage";

// COMPONENTS
import { Loader } from "@/components/loader/loader";

interface IProps {
    closeFormControl: Dispatch<SetStateAction<boolean>>;
}

interface Schedule {
    mainFile: File;
}

const ScheduleForm = (props: IProps) => {
    const [loading, setLoading] = useState(false);

    const [mainFile, setMainFile] = useState<File[]>([]);

    const form = useForm<Schedule>({
        defaultValues: {
            mainFile: undefined,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = form;

    const submitForm = async (data: Schedule) => {
        if (!mainFile || mainFile.length === 0) {
            console.error("No file selected.");
            return;
        }

        setLoading(true);

        try {
            const storageRef = ref(storage, `regulamin.pdf`);

            await uploadBytes(storageRef, mainFile[0]).then(() => {
                alert("Zaktualizowałeś harmonogram!");
                props.closeFormControl(false);
            });
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!loading ? (
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
                                    accept: ".pdf",
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

export default ScheduleForm;
