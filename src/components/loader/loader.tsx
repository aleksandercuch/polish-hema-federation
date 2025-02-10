import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export const Loader = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <CircularProgress color="error" />
        </Box>
    );
};
