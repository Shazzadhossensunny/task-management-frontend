// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div
        className="container bg-white p-8 mx-auto mt-[-40px] relative z-10"
        style={{
          borderRadius: "15px",
          boxShadow:
            "0px 1px 3px rgba(0,0,0,0.12), 0px 23px 44px rgba(176,183,195,0.14)",
          maxWidth: "500px",
        }}
      >
        <img src="/images/not-found.png" className="mx-auto w-full max-w-sm" />
        <p className="text-lg text-gray-600 mb-8 text-center my-4">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-[#60E5AE] text-black text-lg font-semibold rounded-lg flex justify-center"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
