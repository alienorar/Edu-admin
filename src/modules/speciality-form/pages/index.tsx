// import React from 'react';
import { Card, Statistic, Row, Col, Progress, Empty } from 'antd';
import { BookOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, PercentageOutlined, CalendarOutlined } from '@ant-design/icons';

// Sizning response data'ngiz
const statisticsData = {
  timestamp: 1757475173238,
  success: true,
  errorMessage: "",
  data: {
    lessonCountForCurrentYear: 0,
    lessonCountForInterval: 0,
    finishedLessonCount: 0,
    canceledLessonCount: 0,
    monthlyLateList: [],
    finishedLessonLoadPercentageForInterval: 0,
    finishedLessonLoadPercentageForCurrentYear: 0
  }
};

const LessonStatistics = () => {
  const { data } = statisticsData;

  // Ma'lumotlar mavjud emasligini tekshirish
  const hasData = data.lessonCountForCurrentYear > 0 || 
                  data.lessonCountForInterval > 0 || 
                  data.finishedLessonCount > 0 || 
                  data.canceledLessonCount > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
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
        </div>

        {/* Empty State */}
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      </div>

      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Joriy Yil Darslari</span>}
              value={data.lessonCountForCurrentYear}
              prefix={<CalendarOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Davr Darslari</span>}
              value={data.lessonCountForInterval}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Tugallangan Darslar</span>}
              value={data.finishedLessonCount}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Bekor Qilingan Darslar</span>}
              value={data.canceledLessonCount}
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
                percent={data.finishedLessonLoadPercentageForInterval}
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
                percent={data.finishedLessonLoadPercentageForCurrentYear}
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
              <span className="font-bold text-blue-600">{data.lessonCountForCurrentYear}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Tugallangan darslar:</span>
              <span className="font-bold text-green-600">{data.finishedLessonCount}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700 font-medium">Davr darslari:</span>
              <span className="font-bold text-orange-600">{data.lessonCountForInterval}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700 font-medium">Bekor qilingan:</span>
              <span className="font-bold text-red-600">{data.canceledLessonCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LessonStatistics;