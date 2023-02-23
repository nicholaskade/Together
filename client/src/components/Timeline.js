import { useEffect, useState } from "react";
import { usePostsDispatch } from "./context/PostsContext";
import { useLikedPostsDispatch } from "./context/LikedPostsContext";
import Posts from "./Posts";
import { useUser } from "./context/UserContext";

function Timeline() {
  const postsDispatch = usePostsDispatch();
  const likedPostsDispatch = useLikedPostsDispatch();
  const [errors, setErrors] = useState([]);
  const uid = useUser().user.id;

  useEffect(() => {
    fetch("/posts").then((response) => {
      if (response.ok) {
        response.json().then((posts) => {
          postsDispatch({
            type: "mount",
            posts: posts,
          });
        });
      } else {
        response.json().then((data) => setErrors(data.errors));
      }
    });

    fetch(`/user/${uid}/likes`).then((response) => {
      if (response.ok) {
        response.json().then((likedPosts) => {
          likedPostsDispatch({
            type: "mount",
            likedPosts: likedPosts,
          });
        });
      } else {
        response.json().then((data) => setErrors(data.errors));
      }
    });
  }, [uid]);

  return (
    <div id="posts-container">
      <Posts />
    </div>
  );
}

export default Timeline;
