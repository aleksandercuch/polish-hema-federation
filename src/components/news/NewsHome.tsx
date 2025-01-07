"use client";

// CORE
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//TYPES
import { Post } from "@/types/post.type";

// MOCKS
import { mockedPosts } from "@/mocks/posts.mocks";

// STYLES
import styles from "./news.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

// CONTEXT
import { usePost } from "@/contexts/PostsContext";

export const NewsHome = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const { post, setPost } = usePost();
    const router = useRouter();

    const isReversedPost = (index: number) => {
        return index == 2 || index == 3 ? true : false;
    };

    const handleNavigation = (post: Post) => {
        setPost(post);
        router.push(`/posts/${post.id}`);
    };
    const fetchPosts = async () => {
        setLoading(true);
        try {
            // MOCKS
            const response = await mockedPosts;
            setPosts(response);
            setLoading(false);
        } catch (error) {
            console.log(error);
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
        >
            {posts.map((post, index) => (
                <Grid item xs={6} key={post.id}>
                    <Card
                        sx={{
                            display: "flex",
                            flexDirection: isReversedPost(index)
                                ? "row-reverse"
                                : "row",
                            flex: "50% 50%",
                            textAlign: "center",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                width: "50%",
                                alignContent: "center",
                                backgroundColor: isReversedPost(index)
                                    ? "red"
                                    : "white",
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
                                        <Typography
                                            component="div"
                                            variant="h5"
                                            color={
                                                isReversedPost(index)
                                                    ? "inherit"
                                                    : "error"
                                            }
                                        >
                                            {post.title}
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
                                                {post.intro}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                color={
                                                    isReversedPost(index)
                                                        ? "inherit"
                                                        : "error"
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
                            image={post.images[0]}
                            alt="Post picture error"
                            sx={{
                                width: "50%",
                            }}
                        />
                    </Card>
                </Grid>
            ))}
            <Button fullWidth>Pokaż wszystko</Button>
        </Grid>
    );
};
