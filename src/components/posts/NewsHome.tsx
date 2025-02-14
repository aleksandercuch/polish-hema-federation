"use client";

// CORE
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
} from "@mui/material";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config/clientApp";

export const NewsHome = () => {
    const [posts, setPosts] = useState<PostT[]>([]);
    const { setPost } = usePost();
    const router = useRouter();
    const theme = useTheme();
    const isReversedPost = (index: number) => {
        return index == 2 || index == 3 ? true : false;
    };
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const handleNavigation = (post: PostT) => {
        setPost(post);
        router.push(`/posts/${post.id}`);
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
                        maxHeight: posts.length == 5 ? "240px" : "30vh",
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
                                xs: index % 2 == 0 ? "row" : "row-reverse",
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
                                    md: isReversedPost(index) ? "red" : "white",
                                    xs: index % 2 == 0 ? "white" : "red",
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
                                                    ? isReversedPost(index)
                                                        ? "inherit"
                                                        : "error"
                                                    : index % 2 == 0
                                                    ? "error"
                                                    : "inherit"
                                            }
                                        >
                                            {post.titlePL}
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
                                                {post.introPL}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                color={
                                                    !isSmallScreen
                                                        ? isReversedPost(index)
                                                            ? "inherit"
                                                            : "error"
                                                        : index % 2 == 0
                                                        ? "error"
                                                        : "inherit"
                                                }
                                                onClick={() =>
                                                    handleNavigation(post)
                                                }
                                            >
                                                Show More
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
            <Link href={"/posts"}>
                <Button
                    className={styles.postsButton}
                    variant="contained"
                    color="error"
                    fullWidth
                >
                    Wszystkie posty
                </Button>
            </Link>
        </Grid>
    );
};
