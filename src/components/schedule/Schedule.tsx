"use client";

import styles from "./schedule.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
export const Schedule = () => {
    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "row-reverse",
                flex: "50% 50%",
                textAlign: "center",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    width: "50%",
                    alignContent: "center",
                    backgroundColor: "white",
                }}
            >
                <CardContent>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={4}
                    >
                        <Grid item>
                            <Typography component="div" variant="h5">
                                Harmonogram Zawodów
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            container
                            alignItems="center"
                            direction="column"
                            spacing={2}
                        >
                            <Grid item>
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    sx={{
                                        color: "text.secondary",
                                        maxWidth: "250px",
                                    }}
                                >
                                    Jakiś krótki opis
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="outlined">
                                    Pokaż Harmonogram
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Box>
            <CardMedia
                component="img"
                image={
                    "https://historicalmartialarts.eu/wp-content/uploads/2022/12/K_HemaEventCalendar.jpg"
                }
                alt="Post picture error"
                sx={{
                    width: "50%",
                    border: "30px solid red",
                }}
            />
        </Card>
    );
};
