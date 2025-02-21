// CORE
import React from "react";
import dayjs from "dayjs";

// STYLES
import { Box, Paper, Grid, Typography, Divider } from "@mui/material";

// UTILS
import colors from "@/utils/constants/colors";

const Footer = () => {
    return (
        <>
            <Box
                sx={{
                    zIndex: "2",
                    position: "absolute",
                    width: "100%",
                }}
            >
                <Paper>
                    <Grid
                        container
                        sx={{
                            direction: "row",
                            justifyItems: "center",
                            alignItems: "center",
                            backgroundColor: `${colors.red}`,
                            color: `${colors.white}`,
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
