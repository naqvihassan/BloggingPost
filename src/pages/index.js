import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/posts");
    } else {
      router.push("/auth");
    }
  }, [currentUser]);
  return <h2>Redirecting...</h2>;
}