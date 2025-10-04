"use client";

import { useEffect } from "react";
import {  useSearchParams, } from "react-router-dom";
// import { setTeacherToken } from "../../../../utils/token-service";
import { openNotification } from "@utils";
import { setAccessToken } from "../../../../utils/token-service";


const Callback = () => {
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Callback page loaded, token:", token); // Debugging uchun

    if (token) {
      try {
        // Tokenni saqlash
        setAccessToken(token);
        console.log("Access token set in auth service");
        // Teacher-panel ga yo‘naltirish
        // navigate("/super-admin-panel/tutor-statistics", { replace: true });
        openNotification("success", "Success", "Successfully authenticated!");
      } catch (error) {
        console.error("Error setting access token:", error);
        openNotification("error", "Error", "Authentication failed: Unable to set token");
        // navigate("/login", { replace: true });
      }
    } else {
      console.error("No token found in URL parameters");
      openNotification("error", "Error", "Authentication failed: No token provided");
    //   navigate("/login", { replace: true });
    }
  },);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Processing authentication...
        </p>
      </div>
    </div>
  );
};

export default Callback;