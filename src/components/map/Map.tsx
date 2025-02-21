"use client";

// CORE
import { useTranslations } from "next-intl";
import React from "react";

// MATERIAL
import { Grid, Typography } from "@mui/material";

// UTILS
import colors from "@/utils/constants/colors";

const MapEmbed = () => {
    const t = useTranslations("COMMON");

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
                    color: `${colors.white}`,
                    width: "100%",
                    height: "60px",
                    textAlign: "center",
                    backgroundColor: `${colors.red}`,
                    marginBottom: "-60px",
                    zIndex: "100",
                    alignContent: "center",

                    fontWeight: "500",
                    fontSize: "0.875rem",
                }}
            >
                {t("polish-clubs")}
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
