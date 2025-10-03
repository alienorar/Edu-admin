import { useEffect, useState } from "react";
import { useGetTutorStatistics } from "../hooks/queries";

const Index = () => {
    const [_tableData, setTableData] = useState([]);
  const [params, _setParams] = useState({});
  const { data: tutorStatistics } = useGetTutorStatistics(params);

  useEffect(() => {
    if (tutorStatistics.data) {
      console.log("Tutor Statistics:", tutorStatistics);
        setTableData(tutorStatistics.data || []);
    }
  }, [tutorStatistics]);        

  return (
    <div>
      <h2>Index</h2>
    </div>
  );
};

export default Index;