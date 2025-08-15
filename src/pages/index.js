import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";

export default function Home() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/posts");
    } else {
      router.push("/auth");
    }
  }, [currentUser, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-600">Loading...</h2>
      </div>
    </div>
  );
}