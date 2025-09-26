import { useGetSyncSchedule } from "../hooks/queries";
import { useGetSyncDepartment } from "../hooks/queries";
import { useGetSyncEmployee } from "../hooks/queries";
import { useState } from "react";

const Index = () => {
  // State for success message and education year (default to current year)
  const [successMessage, setSuccessMessage] = useState("");
  const [educationYear, setEducationYear] = useState(new Date().getFullYear().toString());

  // Hooks for sync operations with enabled: false to prevent auto-fetch
  const { refetch: syncSchedule } = useGetSyncSchedule(
    {}, // No parameters initially
    { enabled: false }
  );
  const { refetch: syncDepartment } = useGetSyncDepartment({ enabled: false });
  const { refetch: syncEmployee } = useGetSyncEmployee({ enabled: false });

  // Handle button clicks
  const handleScheduleSync = async () => {
    if (!educationYear) {
      setSuccessMessage("Iltimos, o'quv yilini kiriting!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      // Pass educationYear as a parameter to refetch
      const response = await syncSchedule();
      if (response.data?.success) {
        setSuccessMessage("Schedule muvafaqiyatli yangilandi!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Schedule sync error:", error);
      setSuccessMessage("Xatolik yuz berdi!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDepartmentSync = async () => {
    try {
      await syncDepartment();
    } catch (error) {
      console.error("Department sync error:", error);
    }
  };

  const handleEmployeeSync = async () => {
    try {
      await syncEmployee();
    } catch (error) {
      console.error("Employee sync error:", error);
    }
  };

  return (
    <div className="Index">
      <h2>Index</h2>

      {/* Success/Error message display */}
      {successMessage && (
        <div
          style={{
            padding: "10px",
            backgroundColor: successMessage.includes("Xatolik") ? "#f44336" : "#4CAF50",
            color: "white",
            marginBottom: "15px",
            borderRadius: "4px",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Schedule Sync Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "transparent",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Schedule Yangilash</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label htmlFor="educationYear" style={{ marginRight: "10px" }}>
            O'quv yili:
          </label>
          <input
            type="number"
            id="educationYear"
            value={educationYear}
            onChange={(e) => setEducationYear(e.target.value)}
            placeholder="Masalan: 2025"
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "150px",
            }}
          />
          <button
            onClick={handleScheduleSync}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Schedule yangilash
          </button>
        </div>
      </div>

      {/* Other Sync Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleDepartmentSync}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Department yangilash
        </button>

        <button
          onClick={handleEmployeeSync}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Employee yangilash
        </button>
      </div>
    </div>
  );
};

export default Index;