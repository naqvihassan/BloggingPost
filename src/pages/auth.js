import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";

export default function AuthPage() {
  const { signUp, logIn, currentUser } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push("/posts");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          alert("Please enter your name");
          setIsLoading(false);
          return;
        }
        signUp(name, email, password);
        router.push("/posts");
      } else {
        logIn(email, password);
        router.push("/posts");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Classic Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
            The Literary Journal
          </h1>
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="px-4 text-gray-500 text-sm">◆</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            {isSignup ? "Begin your storytelling journey" : "Welcome back, storyteller"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800" 
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
            {isSignup ? "Create Your Account" : "Log In"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" 
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white transition-all duration-300 hover:-translate-y-px focus:-translate-y-px focus:shadow-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" 
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white transition-all duration-300 hover:-translate-y-px focus:-translate-y-px focus:shadow-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" 
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white transition-all duration-300 hover:-translate-y-px focus:-translate-y-px focus:shadow-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
              {isSignup && (
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-medium py-4 rounded transition-all duration-300 relative overflow-hidden ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl'
              } text-white`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  isSignup ? "Create Account" : "Log In"
                )}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </form>
          
          {/* Switch Form */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            
            <p className="text-gray-600 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </p>
            
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className={`font-medium px-8 py-3 rounded border border-gray-300 transition-all duration-300 relative overflow-hidden ${
                isLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:-translate-y-1 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="relative z-10">
                {isSignup ? "Log In Instead" : "Create New Account"}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="px-4 text-gray-400">◆ ◆ ◆</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <p className="text-gray-500 italic text-sm" style={{ fontFamily: "'Crimson Text', Georgia, serif" }}>
            "Every great story begins with a single word"
          </p>
        </div>
      </div>
    </div>
  );
}