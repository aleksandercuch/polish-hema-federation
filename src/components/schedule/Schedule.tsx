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

// COMPONENTS
import ScheduleForm from "@/components/forms/ScheduleForm";

// UTILS
import colors from "@/utils/constants/colors";

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
        <Card
            className={styles.schedule}
            sx={{
                display: { xs: "block", sm: "flex" },
                flexDirection: "row",
                flex: "100% 100%",
            }}
        >
            <CardMedia
                component="img"
                image={
                    "https://firebasestorage.googleapis.com/v0/b/polish-hema-federation.firebasestorage.app/o/kalendarz.jpg?alt=media&token=b684c3fa-85fd-4947-869a-9cceb0612ddd"
                }
                alt="Post picture error"
                sx={{
                    width: { sm: "50%", xs: "100%" },
                    border: `30px solid ${colors.red}`,
                }}
            />
            <Box
                sx={{
                    width: { sm: "50%", xs: "100%" },
                    alignContent: "center",
                    backgroundColor: `${colors.white}`,
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
        </Card>
    );
};
