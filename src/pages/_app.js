import "@/styles/globals.css";
import { AuthProvider } from "@/context/authContext";
import { PostsProvider } from "@/context/postContext";
import { CommentsProvider } from "@/context/commentContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
        <PostsProvider>
          <CommentsProvider>
            <Component {...pageProps} />
          </CommentsProvider>
      </PostsProvider>
    </AuthProvider>
  );
}
