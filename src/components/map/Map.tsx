import React from "react";
import { Grid, Typography } from "@mui/material";

const MapEmbed = () => {
    return (
        <Grid
            container
            sx={{
                width: "100%",
                height: "80vh",
                position: "relative",
                zIndex: "2",
            }}
        >
            <Typography
                sx={{
                    color: "white",
                    width: "100%",
                    height: "60px",
                    textAlign: "center",
                    backgroundColor: "#d32f2f",
                    marginBottom: "-60px",
                    zIndex: "100",
                    alignContent: "center",

                    fontWeight: "500",
                    fontSize: "0.875rem",
                }}
            >
                KLUBY W POLSCE
            </Typography>
            <iframe
                src="https://www.google.com/maps/d/embed?mid=1alcHTXsv1w0kUQmG6Www0kHqYyMD4BY_"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
            ></iframe>
        </Grid>
    );
};

export default MapEmbed;
