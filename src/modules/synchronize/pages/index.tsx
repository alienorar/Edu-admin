
import { useGetSyncSchedule, useGetSyncDepartment, useGetSyncEmployee } from "../hooks/queries";
import { useState } from "react";
import { Card, Button, Input, Typography, Space } from "antd";

import { RefreshCw, Building, Users } from "lucide-react";
import { openNotification } from "@utils";

const { Title, Text } = Typography;


const Index = () => {
  // State for education year (default to current year)
  const [educationYear, setEducationYear] = useState(new Date().getFullYear().toString());

  // Hooks for sync operations with enabled: false to prevent auto-fetch
  const { refetch: syncSchedule } = useGetSyncSchedule({}, { enabled: false });
  const { refetch: syncDepartment } = useGetSyncDepartment({ enabled: false });
  const { refetch: syncEmployee } = useGetSyncEmployee({ enabled: false });

  // Handle button clicks
  const handleScheduleSync = async () => {
    if (!educationYear) {
      openNotification("error", "Xatolik", "Iltimos, o'quv yilini kiriting!");
      return;
    }

    try {
      const response = await syncSchedule();
      if (response.data?.success) {
        openNotification("success", "Muvaffaqiyat", "Schedule muvafaqiyatli yangilandi!");
      } else {
        openNotification("error", "Xatolik", "Schedule yangilashda xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("Schedule sync error:", error);
      openNotification("error", "Xatolik", "Schedule yangilashda xatolik yuz berdi!");
    }
  };

  const handleDepartmentSync = async () => {
    try {
      await syncDepartment();
      openNotification("success", "Muvaffaqiyat", "Department muvafaqiyatli yangilandi!");
    } catch (error) {
      console.error("Department sync error:", error);
      openNotification("error", "Xatolik", "Department yangilashda xatolik yuz berdi!");
    }
  };

  const handleEmployeeSync = async () => {
    try {
      await syncEmployee();
      openNotification("success", "Muvaffaqiyat", "Employee muvafaqiyatli yangilandi!");
    } catch (error) {
      console.error("Employee sync error:", error);
      openNotification("error", "Xatolik", "Employee yangilashda xatolik yuz berdi!");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Title level={2} style={{ color: "#1f2937" }}>
          Ma'lumotlarni sinxronlash
        </Title>
        <Text type="secondary">Schedule, department va employee ma'lumotlarini yangilang</Text>
      </div>

      {/* Schedule Sync Section */}
      <Card
        title={
          <Space>
            <RefreshCw size={20} className="text-violet-500" />
            <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
              Schedule Yangilash
            </Title>
          </Space>
        }
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
        styles={{ body: { padding: "20px" } }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space align="center" size="middle">
            <Text style={{ color: "#1f2937" }}>O'quv yili:</Text>
            <Input
              type="number"
              value={educationYear}
              onChange={(e) => setEducationYear(e.target.value)}
              placeholder="Masalan: 2025"
              style={{
                width: "150px",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
                background: "rgba(255, 255, 255, 0.7)",
              }}
            />
            <Button
              type="primary"
              onClick={handleScheduleSync}
              style={{
                background: "linear-gradient(to right, #7c3aed, #4f46e5)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s",
                color: "white",
                padding: "6px 16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
              }}
            >
              Schedule yangilash
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Other Sync Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          title={
            <Space>
              <Building size={20} className="text-violet-500" />
              <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                Department Yangilash
              </Title>
            </Space>
          }
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            color: "white",
            padding: "6px 16px",
          }}
          styles={{ body: { padding: "20px" } }}
        >
          <Button
            type="primary"
            onClick={handleDepartmentSync}
            block
            style={{
              background: "linear-gradient(to right, #7c3aed, #4f46e5)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
            }}
          >
            Department yangilash
          </Button>
        </Card>

        <Card
          title={
            <Space>
              <Users size={20} className="text-violet-500" />
              <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                Employee Yangilash
              </Title>
            </Space>
          }
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            color: "white",
            padding: "6px 16px",
          }}
          styles={{ body: { padding: "20px" } }}
        >
          <Button
            type="primary"
            onClick={handleEmployeeSync}
            block
            style={{
              background: "linear-gradient(to right, #7c3aed, #4f46e5)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
            }}
          >
            Employee yangilash
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
