"use client";

// CORE
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// MATERIAL
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FacebookIcon from "@mui/icons-material/Facebook";
import styles from "./navbar.module.css";

// COMPONENTS
import { ChangeLanguageFlag } from "./ChangeLanguageFlag";
import { useEffect } from "react";

interface NavLinkParams {
    name: string;
    isReflink: boolean;
    url: string;
    ref?: string;
}

export const ResponsiveAppBar = () => {
    const t = useTranslations("NAVBAR");
    const [currentLocale, setCurrentLocale] = React.useState("");
    const navLinks: NavLinkParams[] = [
        {
            name: t("news"),
            isReflink: true,
            url: `/${currentLocale}`,
            ref: "NewsHome",
        },
        {
            name: t("schedule"),
            isReflink: true,
            url: `/${currentLocale}`,
            ref: "Schedule",
        },
        {
            name: t("rules"),
            isReflink: false,
            url: `/${currentLocale}/rules`,
        },
        {
            name: t("management"),
            isReflink: false,
            url: `/${currentLocale}/management`,
        },
        {
            name: t("contact"),
            isReflink: false,
            url: `/${currentLocale}/contact`,
        },
        {
            name: t("gallery"),
            isReflink: false,
            url: `/${currentLocale}/gallery`,
        },
        {
            name: t("judges"),
            isReflink: false,
            url: `/${currentLocale}/judges`,
        },
        {
            name: t("cooperation"),
            isReflink: false,
            url: `/${currentLocale}/cooperation`,
        },
        {
            name: t("clubs"),
            isReflink: true,
            url: `/${currentLocale}`,

            ref: "OpenLayersMap",
        },
    ];
    const pathname = usePathname();
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleTransition = async (link: NavLinkParams) => {
        if (link.ref) {
            if (pathname === "/") {
                document
                    .getElementById(link.ref)
                    ?.scrollIntoView({ behavior: "smooth" });
            } else {
                await router.push(link.url);

                const intervalId = setInterval(() => {
                    const element = document.getElementById(link.ref as string);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                        clearInterval(intervalId);
                    }
                }, 1000);
            }
        } else {
            await router.push(link.url);
        }
        handleCloseNavMenu();
    };

    useEffect(() => {
        const currentLocale = window.location.pathname.split("/")[1];
        setCurrentLocale(currentLocale);
    }, []);
    return (
        <AppBar
            position="fixed"
            sx={{ backgroundColor: "white", color: "black" }}
        >
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Link href={`/${currentLocale}`}>
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/polish-hema-federation.firebasestorage.app/o/Logo.jpg?alt=media&token=be8db20e-c749-49bd-82cc-2ed577a69c57"
                            alt="Example image"
                            width={100}
                            height={100}
                            priority
                        />
                    </Link>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                            justifyContent: "right",
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {navLinks.map((navLink, index) => (
                                <MenuItem
                                    key={index}
                                    onClick={() => handleTransition(navLink)}
                                    sx={{ padding: "20px 50px 20px 20px" }}
                                >
                                    <Typography sx={{ textAlign: "center" }}>
                                        {navLink.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {
                                xs: "none",
                                md: "flex",
                                justifyContent: "center",
                            },
                        }}
                    >
                        {navLinks.map((navLink, index) => (
                            <Button
                                key={index}
                                onClick={() => handleTransition(navLink)}
                                sx={{
                                    my: 2,
                                    color: "black",
                                    display: "block",
                                    padding: "0 20px",
                                    margin: "0",
                                    height: "100px",
                                }}
                            >
                                {navLink.name}
                            </Button>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            my: 2,
                            display: "flex",
                        }}
                    >
                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "flex",
                                },
                                mr: "30px",
                            }}
                        >
                            <a
                                href="https://www.facebook.com/FederPoland"
                                target="_blank"
                            >
                                <FacebookIcon className={styles.mediaIcon} />
                            </a>
                        </Box>
                        <ChangeLanguageFlag />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
