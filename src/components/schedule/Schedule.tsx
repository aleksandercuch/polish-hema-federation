"use client";

// CORE
import { useEffect, useState } from "react";
import dayjs from "dayjs";

// ASSETS
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import styles from "./schedule.module.css";

// FIREBASE
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/config/clientApp";

// UTILS
import ScheduleForm from "@/utils/forms/ScheduleForm";

// CONTEXT
import { UserAuth } from "@/contexts/AuthContext";
interface Schedule {
    mainFile: string;
}

export const Schedule = () => {
    const [editMode, setEditMode] = useState(false);
    const [schedule, setSchedule] = useState<string>();
    const currentUser = UserAuth();

    const fetchSchedule = async () => {
        try {
            const fileRef = ref(storage, `regulamin.pdf`);

            const url = await getDownloadURL(fileRef);

            setSchedule(url);
        } catch (error) {
            console.error("Error getting file:", error);
        }
    };

    const downloadSchedule = async (filePath: string) => {
        try {
            const storage = getStorage();
            const fileRef = ref(storage, filePath);

            const url: string = await getDownloadURL(fileRef);

            if (!url) {
                throw new Error("Failed to get download URL.");
            }

            const link: HTMLAnchorElement = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.download = filePath.split("/").pop() || "download.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    return (
        <Card className={styles.schedule}>
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
                                Harmonogram Zawodów{" "}
                                {dayjs(new Date()).format("YYYY")}
                            </Typography>
                        </Grid>
                        {!editMode ? (
                            <Grid
                                item
                                container
                                alignItems="center"
                                direction="column"
                                spacing={2}
                            >
                                {" "}
                                {currentUser?.user?.email && (
                                    <Grid item xs={6}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => setEditMode(true)}
                                        >
                                            Edytuj harmonogram
                                        </Button>
                                    </Grid>
                                )}
                                {schedule && (
                                    <Grid item xs={6}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() =>
                                                downloadSchedule(schedule)
                                            }
                                        >
                                            Pokaż Harmonogram
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        ) : (
                            <ScheduleForm closeFormControl={setEditMode} />
                        )}
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
                    border: "30px solid #d32f2f",
                }}
            />
        </Card>
    );
};
