"use client";

import type React from "react";
import { Button, Card } from "antd";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const Index: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
  navigate("/admin");
  };

  const handleTutorLogin = async () => {
    try {
      const response = await fetch("https://edu-api.asianuniversity.uz/api/v1/tutor/hemis/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success && data.data.redirectUrl) {
        window.location.href = data.data.redirectUrl; // Redirect to the OAuth URL
      } else {
        console.error("Tutor login failed:", data.errorMessage || "No redirect URL");
      }
    } catch (error) {
      console.error("Error during tutor login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-700 mb-3">Xush kelibsiz</h1>
          <p className="text-gray-800 text-lg">Tizimga kirish usulini tanlang</p>
        </div>

        {/* Button Card */}
        <Card
          className="bg-transparent overflow-hidden"
        
        >
          <div className="space-y-6">
            <Button
              block
              onClick={handleAdminLogin}
              className="h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white"
              icon={<UserOutlined className="text-lg" />}
            >
              Admin sifatida tizimga kirish
            </Button>
            <Button
              block
              onClick={handleTutorLogin}
              className="h-14 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 border-0 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white"
              icon={<LoginOutlined className="text-lg" />}
            >
              Tutor sifatida tizimga kirish
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2024 Admin Panel. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;