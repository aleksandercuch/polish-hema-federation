import { Box, Paper, Grid, Typography, Divider } from "@mui/material";
import React from "react";
import dayjs from "dayjs";

const Footer = () => {
    return (
        <>
            <Box
                sx={{
                    zIndex: "2",
                    position: "relative",
                }}
            >
                <Paper>
                    <Grid
                        container
                        sx={{
                            direction: "row",
                            justifyItems: "center",
                            alignItems: "center",
                            backgroundColor: "#d32f2f",
                            color: "white",
                        }}
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid
                                container
                                sx={{
                                    direction: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item>
                                    <Box mb={4}>
                                        <Typography variant="body1">
                                            Copyright©{" "}
                                            {dayjs(new Date()).format("YYYY")}.
                                            All rights reserved.
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
};

export default Footer;
