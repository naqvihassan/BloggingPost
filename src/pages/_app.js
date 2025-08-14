import "@/styles/globals.css";
import { AuthProvider } from "@/context/authContext";
import { PostsProvider } from "@/context/postContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
        <PostsProvider>
        <Component {...pageProps} />
      </PostsProvider>
    </AuthProvider>
  );
}
