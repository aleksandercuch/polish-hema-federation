"use client";

// CORE
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

//TYPES
import { PostT } from "@/types/post.type";

// STYLES
import styles from "./news.module.css";
import {
    Button,
    Grid,
    Box,
    Typography,
    CardMedia,
    CardContent,
    Card,
    useTheme,
    useMediaQuery,
    createTheme,
    ThemeProvider,
} from "@mui/material";

// FIREBASE
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config/clientApp";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";
import { Loader } from "../loader/loader";

// UTILS
import colors from "@/utils/constants/colors";

export const NewsHome = () => {
    const [posts, setPosts] = useState<PostT[]>([]);
    const { setPost } = usePost();
    const router = useRouter();
    const theme = useTheme();
    const t = useTranslations("COMMON");
    const currentLocale = window.location.pathname.split("/")[1];
    const isReversedPost = (index: number) => {
        return index == 2 || index == 3 ? true : false;
    };
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const handleNavigation = (post: PostT) => {
        setPost(post);
        router.push(`${currentLocale}/posts/${post.id}`);
    };
    const fetchPosts = async () => {
        try {
            const q = query(
                collection(db, "posts"),
                orderBy("date", "desc"),
                limit(6)
            );

            const snapshot = await getDocs(q);

            const newPosts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as PostT[];

            setPosts(newPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const colorTheme = createTheme({
        palette: {
            secondary: {
                main: "#FFFFFF",
            },
        },
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Grid
            container
            direction="row"
            className={styles.news}
            justifyContent={"center"}
            sx={{
                maxHeight: { md: "100vh", xs: "none" },
                marginTop: { md: "100vh", xs: "35vh" },
            }}
        >
            {posts.length > 0 ? (
                <ThemeProvider theme={colorTheme}>
                    {posts.map((post, index) => (
                        <Grid
                            item
                            xs={12}
                            md={
                                posts.length != 6 &&
                                posts.length % 2 != 0 &&
                                index == posts.length - 1
                                    ? 12
                                    : 6
                            }
                            sx={{
                                maxHeight: {
                                    md: `${
                                        posts.length == 5 ? "240px" : "30vh"
                                    }`,
                                    xs: `${
                                        posts.length == 5 ? "240px" : "60vh"
                                    }`,
                                },
                                display: { xs: "none", sm: "block" },
                            }}
                            key={post.id}
                        >
                            <Card
                                sx={{
                                    display: { sm: "flex", xs: "block" },
                                    flexDirection: {
                                        md: isReversedPost(index)
                                            ? "row-reverse"
                                            : "row",
                                        xs:
                                            index % 2 == 0
                                                ? "row"
                                                : "row-reverse",
                                    },
                                    flex: "50% 50%",
                                    textAlign: "center",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { sm: "50%", xs: "100%" },
                                        alignContent: "center",
                                        backgroundColor: {
                                            md: isReversedPost(index)
                                                ? `${colors.red}`
                                                : `${colors.white}`,
                                            xs:
                                                index % 2 == 0
                                                    ? `${colors.white}`
                                                    : `${colors.red}`,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ margin: "10px" }}>
                                        <Grid
                                            container
                                            direction="column"
                                            alignItems="center"
                                            spacing={4}
                                        >
                                            <Grid item>
                                                <Typography
                                                    component="div"
                                                    variant="h5"
                                                    color={
                                                        !isSmallScreen
                                                            ? isReversedPost(
                                                                  index
                                                              )
                                                                ? "secondary"
                                                                : "error"
                                                            : index % 2 == 0
                                                            ? "error"
                                                            : "secondary"
                                                    }
                                                >
                                                    {currentLocale == "pl"
                                                        ? post.titlePL
                                                        : post.titleENG}
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
                                                            color: !isSmallScreen
                                                                ? isReversedPost(
                                                                      index
                                                                  )
                                                                    ? `${colors.white}`
                                                                    : "text.secondary"
                                                                : index % 2 == 0
                                                                ? "text.secondary"
                                                                : `${colors.white}`,
                                                            maxWidth: "250px",
                                                        }}
                                                    >
                                                        {currentLocale == "pl"
                                                            ? post.introPL
                                                            : post.introENG}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button
                                                        variant="outlined"
                                                        color={
                                                            !isSmallScreen
                                                                ? isReversedPost(
                                                                      index
                                                                  )
                                                                    ? "secondary"
                                                                    : "error"
                                                                : index % 2 == 0
                                                                ? "error"
                                                                : "secondary"
                                                        }
                                                        onClick={() =>
                                                            handleNavigation(
                                                                post
                                                            )
                                                        }
                                                    >
                                                        {t("show-more")}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Box>
                                <CardMedia
                                    component="img"
                                    image={post.mainFile as string}
                                    alt="Post picture error"
                                    sx={{
                                        width: { sm: "50%", xs: "100%" },
                                        maxHeight: "700px",
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </ThemeProvider>
            ) : (
                <Grid
                    item
                    sx={{
                        height: { md: "100vh", xs: "none" },
                        background: `${colors.white}`,
                        width: "100%",
                        alignContent: "center",
                        justifyContent: "center",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <Loader />
                </Grid>
            )}
            <Link href={`/${currentLocale}/posts`}>
                <Button
                    className={styles.postsButton}
                    variant="contained"
                    color="error"
                    fullWidth
                >
                    {t("show-all-posts")}
                </Button>
            </Link>
        </Grid>
    );
};
