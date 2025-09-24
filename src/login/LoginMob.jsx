import React, { useState } from "react";
import Google from "../assets/images/google.png";
import supabase from "../supabase";
import Facebook from "../assets/images/facebook.png";
import { MdEmail } from "react-icons/md";
import LoginBg from "../assets/images/loginbg.jpg";
import { useNavigate } from "react-router-dom";

const LoginMob = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const { data: sessionData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        // Provide more user-friendly error messages
        if (authError.message.includes("Email not confirmed")) {
          setError(
            "Please check your email and click the confirmation link before logging in."
          );
        } else if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.");
        } else {
          setError(authError.message);
        }
        return;
      }

      console.log("Logged in:", sessionData.user);

      // Get user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", sessionData.user.id)
        .single();

      if (profileError) {
        console.warn("Profile not found, treating as regular user");
        navigate("/");
        return;
      }

      // Navigate based on role - FIXED: moved before any return statements
      if (profile.role === "admin") {
        navigate("/AdminSeller/admin/dashboard");
      } else if (profile.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error("Facebook login error:", err);
      setError("Facebook login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-6 px-10 border rounded-md md:rounded-tl-none md:rounded-bl-none w-full ">
      <h1 className="text-2xl text-center">Login in or sign up in seconds</h1>

      <p className="text-gray-500 text-sm text-center">
        Use your email or another services to continue with sowis.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter your email address"
          className="border rounded px-2 py-1"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1 mt-4">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="*******"
          className="border rounded px-2 py-1"
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
        <input type="checkbox" />
        <p>
          By confirming the order, I accept the{" "}
          <span className="text-blue-600 underline cursor-pointer">
            terms of the user{" "}
          </span>
          agreement.
        </p>
      </div>

      <button
        className={`flex border justify-center rounded-full px-8 py-1 ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-400 hover:bg-gray-500"
        }`}
        onClick={handleSignin}
        disabled={loading}
      >
        <p className="text-gray-100">{loading ? "Signing in..." : "Sign in"}</p>
      </button>

      <button
        onClick={() => navigate("/register")}
        className="flex gap-1 justify-center hover:underline"
      >
        <p>No account?</p>
        <p className="text-blue-600 text-base">Sign up</p>
      </button>

      <button className="border rounded-md bg-white p-1">
        <div className="flex gap-5 justify-center">
          <MdEmail className="w-5 h-5" />
          <p>Continue with Email</p>
        </div>
      </button>

      <button
        className="border rounded-md bg-white p-1 hover:bg-gray-50"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <div className="flex gap-5 items-center justify-center">
          <img src={Google} alt="google" className="w-7 h-7" />
          <p>Continue with Google</p>
        </div>
      </button>

      <button
        className="border rounded-md bg-white p-1 hover:bg-gray-50"
        onClick={handleFacebookLogin}
        disabled={loading}
      >
        <div className="flex gap-5 justify-center">
          <img src={Facebook} alt="facebook" className="w-5 h-5" />
          <p>Continue with Facebook</p>
        </div>
      </button>
    </div>
  );
};

export default LoginMob;
