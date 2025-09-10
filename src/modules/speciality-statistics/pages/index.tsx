
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Statistic, Row, Col, Progress, Empty, Button, Input, DatePicker, Table } from "antd";
import { BookOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, PercentageOutlined, CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { useSearchParams, } from "react-router-dom";
// import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { RangePickerProps } from "antd/es/date-picker";

// Hypothetical hook for fetching lesson statistics
import { useGetLessonStatistics } from "../hooks/queries";

const { RangePicker } = DatePicker;

interface MonthlyLate {
  month: string;
  monthName: string;
  lateCount: number;
  lateInSeconds: number;
  averageLateTime: number;
}

interface LessonStatisticsData {
  timestamp: number;
  success: boolean;
  errorMessage: string;
  data: {
    lessonCountForCurrentYear: number;
    lessonCountForInterval: number;
    finishedLessonCount: number;
    canceledLessonCount: number;
    monthlyLateList: MonthlyLate[];
    finishedLessonLoadPercentageForInterval: number;
    finishedLessonLoadPercentageForCurrentYear: number;
  };
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Record<string, string>;

const LessonStatistics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();

  // Extract query parameters
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const teacherId = searchParams.get("teacherId") ?? "";
  const departmentId = searchParams.get("departmentId") ?? "";

  // Fetch data with filters
  const { data: statisticsData, isFetching } = useGetLessonStatistics({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    teacherId: teacherId ? Number(teacherId) : undefined,
    departmentId: departmentId ? Number(departmentId) : undefined,
  });

  // State for data
  const [stats, setStats] = useState<LessonStatisticsData["data"]>({
    lessonCountForCurrentYear: 0,
    lessonCountForInterval: 0,
    finishedLessonCount: 0,
    canceledLessonCount: 0,
    monthlyLateList: [],
    finishedLessonLoadPercentageForInterval: 0,
    finishedLessonLoadPercentageForCurrentYear: 0,
  });

  useEffect(() => {
    if (statisticsData?.data) {
      setStats(statisticsData.data);
    }
  }, [statisticsData]);

  // Update query parameters
  const updateParams = (changed: Record<string, string | undefined>): void => {
    const merged = {
      ...Object.fromEntries(searchParams.entries()),
      ...changed,
    } as Record<string, string | undefined>;
    setSearchParams(filterEmpty(merged));
  };

  // Handle date range change with correct type
  const handleDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates && dateStrings[0] && dateStrings[1]) {
      updateParams({
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    } else {
      updateParams({ startDate: undefined, endDate: undefined });
    }
  };

  // Check if there is any data to display
  const hasData =
    stats.lessonCountForCurrentYear > 0 ||
    stats.lessonCountForInterval > 0 ||
    stats.finishedLessonCount > 0 ||
    stats.canceledLessonCount > 0 ||
    stats.monthlyLateList.length > 0;

  // Table columns for monthlyLateList
  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">Oy</span>,
        dataIndex: "monthName",
        key: "monthName",
        render: (text: string) => <span className="text-gray-800 font-medium">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Kechikishlar Soni</span>,
        dataIndex: "lateCount",
        key: "lateCount",
        render: (count: number) => <span className="text-blue-600 font-medium">{count}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Jami Kechikish (soniya)</span>,
        dataIndex: "lateInSeconds",
        key: "lateInSeconds",
        render: (seconds: number) => <span className="text-orange-600 font-medium">{seconds.toLocaleString()}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">O'rtacha Kechikish (soniya)</span>,
        dataIndex: "averageLateTime",
        key: "averageLateTime",
        render: (time: number) => <span className="text-green-600 font-medium">{time.toFixed(2)}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dars Statistikasi</h1>
            <p className="text-gray-600 mt-1">Darslar bo'yicha batafsil statistik ma'lumotlar</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <RangePicker
            className="h-11 rounded-xl border-gray-200 focus:border-blue-400 transition-all duration-200"
            format="YYYY-MM-DD"
            value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : undefined}
            onChange={handleDateChange}
            allowClear
            suffixIcon={<CalendarOutlined className="text-blue-500" />}
            placeholder={["Boshlanish sanasi", "Tugash sanasi"]}
          />
          <Input
            placeholder="O'qituvchi ID"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={teacherId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ teacherId: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-blue-400 transition-all duration-200"
          />
          <Input
            placeholder="Bo'lim ID"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={departmentId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ departmentId: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-blue-400 transition-all duration-200"
          />
          <Button
            type="primary"
            loading={isFetching}
            onClick={() => updateParams({ startDate: undefined, endDate: undefined, teacherId: undefined, departmentId: undefined })}
            className="h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<SearchOutlined />}
          >
            Tozalash
          </Button>
        </div>
      </div>

      {/* No Data State */}
      {!hasData && !isFetching && (
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <Empty
            description={
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Hozircha statistik ma'lumotlar mavjud emas</h3>
                <p className="text-gray-500">Darslar boshlanganidan keyin bu yerda statistikalar ko'rsatiladi</p>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}

      {/* Main Statistics Cards */}
      {hasData && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Joriy Yil Darslari</span>}
                  value={stats.lessonCountForCurrentYear}
                  prefix={<CalendarOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Davr Darslari</span>}
                  value={stats.lessonCountForInterval}
                  prefix={<ClockCircleOutlined className="text-orange-500" />}
                  valueStyle={{ color: '#fa8c16', fontSize: '2rem', fontWeight: 'bold' }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Tugallangan Darslar</span>}
                  value={stats.finishedLessonCount}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                  valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Bekor Qilingan Darslar</span>}
                  value={stats.canceledLessonCount}
                  prefix={<CloseCircleOutlined className="text-red-500" />}
                  valueStyle={{ color: '#ff4d4f', fontSize: '2rem', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Progress Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <PercentageOutlined className="text-blue-500" />
                    <span className="font-semibold text-gray-800">Davr Uchun Bajarilish Foizi</span>
                  </div>
                }
                className="bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="space-y-4">
                  <Progress
                    percent={stats.finishedLessonLoadPercentageForInterval}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    trailColor="#f5f5f5"
                    strokeWidth={12}
                    showInfo={true}
                    format={(percent) => `${percent}%`}
                  />
                  <div className="text-center">
                    <span className="text-gray-600">Davr bo'yicha dars bajarilish ko'rsatkichi</span>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-green-500" />
                    <span className="font-semibold text-gray-800">Joriy Yil Bajarilish Foizi</span>
                  </div>
                }
                className="bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="space-y-4">
                  <Progress
                    percent={stats.finishedLessonLoadPercentageForCurrentYear}
                    strokeColor={{
                      '0%': '#52c41a',
                      '100%': '#73d13d',
                    }}
                    trailColor="#f5f5f5"
                    strokeWidth={12}
                    showInfo={true}
                    format={(percent) => `${percent}%`}
                  />
                  <div className="text-center">
                    <span className="text-gray-600">Joriy yil bo'yicha dars bajarilish ko'rsatkichi</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Monthly Late List */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-red-500" />
                <span className="font-semibold text-gray-800">Oylik Kechikish Statistikasi</span>
              </div>
            }
            className="bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            {stats.monthlyLateList.length > 0 ? (
              <Table
                dataSource={stats.monthlyLateList}
                columns={columns}
                pagination={false}
                rowKey="month"
                className="rounded-lg"
                rowClassName="hover:bg-gray-50"
              />
            ) : (
              <Empty
                description={
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Kechikish ma'lumotlari mavjud emas</h3>
                    <p className="text-gray-500">Hozircha kechikish statistikasi topilmadi</p>
                  </div>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

          {/* Summary Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <BookOutlined className="text-purple-500" />
                <span className="font-semibold text-gray-800">Umumiy Xulosalar</span>
              </div>
            }
            className="bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Jami darslar (joriy yil):</span>
                  <span className="font-bold text-blue-600">{stats.lessonCountForCurrentYear}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Tugallangan darslar:</span>
                  <span className="font-bold text-green-600">{stats.finishedLessonCount}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Davr darslari:</span>
                  <span className="font-bold text-orange-600">{stats.lessonCountForInterval}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Bekor qilingan:</span>
                  <span className="font-bold text-red-600">{stats.canceledLessonCount}</span>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default LessonStatistics;
