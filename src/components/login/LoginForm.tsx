"use client";

// CORE
import { Controller, useForm } from "react-hook-form";
import { UserAuth } from "@/contexts/AuthContext";

// ASSETES
import { Button, FormControl, Grid, TextField } from "@mui/material";

//FIREBASE
import { EMAIL_PATTERN } from "@/utils/constants/constants";

interface LoginParams {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const currentUser = UserAuth();

    const form = useForm<LoginParams>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    const submitForm = async (data: LoginParams) => {
        currentUser?.signIn(data.email, data.password).catch((error: any) => {
            console.log(error);
        });
    };

    const handleLogout = async () => {
        currentUser!.logout().catch((error: any) => {
            console.log(error);
        });
    };

    return (
        <>
            {currentUser?.user?.email ? (
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="outlined"
                        onClick={handleLogout}
                        fullWidth
                    >
                        Wyloguj
                    </Button>
                </Grid>
            ) : (
                <FormControl
                    component={"form"}
                    onSubmit={handleSubmit(submitForm)}
                    sx={{ margin: "auto", mt: "10px" }}
                >
                    <Controller
                        name={"email"}
                        control={control}
                        rules={{
                            required: "Email jest potrzebny!",
                            pattern: {
                                value: EMAIL_PATTERN,
                                message: "Zły format!",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                label="e-mail"
                                variant="outlined"
                                size="small"
                                type="email"
                                error={Boolean(errors[field.name])}
                                helperText={errors[field.name]?.message}
                                fullWidth
                                sx={{ mb: 3 }}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name={"password"}
                        control={control}
                        rules={{
                            required: "Wprowadź hasło!",
                        }}
                        render={({ field }) => (
                            <TextField
                                label="password"
                                type={"password"}
                                variant="outlined"
                                size="small"
                                error={Boolean(errors[field.name])}
                                helperText={errors[field.name]?.message}
                                fullWidth
                                {...field}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{ marginTop: "20px" }}
                    >
                        Zaloguj
                    </Button>
                </FormControl>
            )}
        </>
    );
};
