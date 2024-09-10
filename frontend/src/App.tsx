import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { backend } from 'declarations/backend';
import PostList from './components/PostList';
import NewPostModal from './components/NewPostModal';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  createdAt: bigint;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async (title: string, body: string, author: string) => {
    try {
      setLoading(true);
      await backend.createPost(title, body, author);
      await fetchPosts();
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ mb: 2 }}
        >
          New Post
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <PostList posts={posts} />
        )}
        <NewPostModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </Box>
    </Container>
  );
}

export default App;
