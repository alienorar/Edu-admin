"use client";

import { useGetEmployeeList,} from "../hooks/queries";
import { useEffect, useMemo, useState } from "react";
import { Button, Switch, Table, Tag, type TablePaginationConfig, Select, Modal, Upload, message } from "antd";
import { SearchOutlined, UserOutlined, UploadOutlined, CameraOutlined, ReloadOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useConfigureFace, useUploadFile } from "../hooks/mutations";

interface Employee {
  employeeId: number;
  fullName: string;
  shortName: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  specialty: string | null;
  birthLocalDate: string;
  imageFull: string;
  createdAt: string;
  metaId: number;
  metaHemisId: number;
  decreeNumber: string;
  updatedAt: string;
  employeeIdNumber: string;
  contractNumber: string;
  contractDate: string;
  decreeDate: string;
  active: boolean;
  yearOfEnter: number;
  image: string;
  employmentForm: string | null;
  employeeStatus: string | null;
  employmentStaff: string | null;
  tutorGroups: string | null;
  academicDegree: string | null;
  department: string | null;
  staffPosition: string | null;
  academicRank: string | null;
  employeeType: string | null;
  gender: string | null;
  face: boolean | null;
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Record<string, string>;

const EmployeePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const size = Number(searchParams.get("size") ?? 10);
  const face = searchParams.get("face") === "true";
  const staffPosition = searchParams.get("staffPosition") ?? "";

  const { data: employeeList, isFetching, error } = useGetEmployeeList({
    page: page - 1,
    size,
    face: face || undefined,
    staffPosition: staffPosition || undefined,
  });

  const [tableData, setTableData] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Hook'larni chaqiramiz
  const uploadFileMutation = useUploadFile();
  const configureFaceMutation = useConfigureFace();

  useEffect(() => {
    if (employeeList?.data?.content) {
      setTableData(employeeList.data.content);
      setTotal(employeeList.data.paging?.totalItems ?? employeeList.data.content.length);
    }
    if (error) {
      console.error("API Error:", error);
    }
  }, [employeeList, error]);

  const updateParams = (changed: Record<string, string | undefined>) => {
    const merged = {
      ...Object.fromEntries(searchParams.entries()),
      ...changed,
    } as Record<string, string | undefined>;
    if (!("page" in changed)) merged.page = "1";
    if (!("size" in merged)) merged.size = size.toString();
    setSearchParams(filterEmpty(merged));
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 10 } = pagination;
    updateParams({
      page: current.toString(),
      size: pageSize.toString(),
    });
  };

  // Face configure modalini ochish
  const handleFaceConfigure = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
    setUploadedFile(null);
  };

  // Fayl yuklash handler
  const handleFileUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Faqat rasm fayllarini yuklash mumkin!');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Rasm hajmi 5MB dan kichik boʻlishi kerak!');
      return false;
    }

    setUploadedFile(file);
    return false;
  };

  // Upload props
  const uploadProps = {
    beforeUpload: (file: File) => {
      handleFileUpload(file);
      return false;
    },
    accept: 'image/*',
    listType: 'picture' as const,
    maxCount: 1,
    fileList: uploadedFile ? [
      {
        uid: '-1',
        name: uploadedFile.name,
        status: 'done' as const,
        url: URL.createObjectURL(uploadedFile),
      }
    ] : [],
    onRemove: () => setUploadedFile(null),
  };

  // Face configure ni amalga oshirish - TO'G'RILANGAN VERSIYA
  const handleConfigureFace = async () => {
    if (!selectedEmployee || !uploadedFile) {
      message.error('Iltimos, rasmni yuklang!');
      return;
    }

    try {
      console.log("Rasm yuklash boshlandi...");
      console.log("Uploaded file:", uploadedFile);
      console.log("File type:", uploadedFile.type);
      console.log("File size:", uploadedFile.size);
      console.log("File name:", uploadedFile.name);
      
      // 1. Rasmni serverga yuklash - TO'G'RIDAN-TO'G'RI FILE YUBORISH
      // useUploadFile hook'i FormData emas, balki to'g'ridan-to'g'ri File yoki Blob qabul qiladi
      const uploadResult = await uploadFileMutation.mutateAsync(uploadedFile);
      console.log("uploadResult:", uploadResult);

      // Upload qilingan rasmning ID sini olamiz
      // Turli response formatlarini qo'llab-quvvatlash
      const documentId = uploadResult?.id || 
                        uploadResult?.data?.id || 
                        uploadResult?.data?.documentId ||
                        uploadResult?.documentId;
      
      if (!documentId) {
        console.error("Document ID topilmadi. Upload result:", uploadResult);
        message.error('Rasm yuklash muvaffaqiyatsiz: Document ID topilmadi.');
        return;
      }
      console.log("Olingan documentId:", documentId);

      // 2. Face configure ni chaqiramiz
      const configurePayload = {
        employeeId: selectedEmployee.employeeId,
        documentId: String(documentId)
      };

      console.log("configureFace payload:", configurePayload);

      // useConfigureFace hook'ini chaqiramiz
      await configureFaceMutation.mutateAsync(configurePayload);

      // Modalni yopish va holatlarni tozalash
      setModalVisible(false);
      setUploadedFile(null);
      setSelectedEmployee(null);

    } catch (error: any) {
      console.error('Face configure error:', error);
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         "Noma'lum xato";
      
      console.error("Xatolik tafsilotlari:", errorMessage);
      message.error(`Face configure da xatolik: ${errorMessage}`);
    }
  };

  // Yuklash holatini kuzatish
  const isLoading = uploadFileMutation.isPending || configureFaceMutation.isPending;

  // Modalni yopish handler
  const onCloseHandler = () => {
    uploadFileMutation.reset();
    configureFaceMutation.reset();
    setUploadedFile(null);
    setSelectedEmployee(null);
    setModalVisible(false);
  };

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">ID</span>,
        dataIndex: "employeeId",
        key: "employeeId",
        width: 80,
        render: (text: number) => <span className="font-medium text-gray-600">#{text}</span>,
        sorter: (a: Employee, b: Employee) => a.employeeId - b.employeeId,
      },
      {
        title: <span className="font-semibold text-gray-700">To'liq ism</span>,
        dataIndex: "fullName",
        key: "fullName",
        render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Qisqa ism</span>,
        dataIndex: "shortName",
        key: "shortName",
        render: (text: string) => <span className="text-gray-700">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Xodim</span>,
        key: "employee",
        render: (record: Employee) => (
          <div className="space-y-1">
            <div className="font-medium text-gray-800">{`${record.firstName} ${record.secondName} ${record.thirdName}`}</div>
            <div className="text-xs text-gray-500 font-mono">{record.employeeIdNumber}</div>
          </div>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Rasm</span>,
        dataIndex: "image",
        key: "image",
        render: (text: string) => (
          <img 
            src={text} 
            alt="employee" 
            className="w-12 h-12 object-cover rounded border border-gray-200" 
          />
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Face Configure</span>,
        key: "faceConfigure",
        width: 150,
        fixed: 'right' as const,
        render: (record: Employee) => (
          <Button
            type="primary"
            size="small"
            onClick={() => handleFaceConfigure(record)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <CameraOutlined className="mr-1" />
            Face Configure
          </Button>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Lavozim</span>,
        dataIndex: "staffPosition",
        key: "staffPosition",
        render: (text: string | null) => (
          <Tag color="blue" className="rounded-lg">
            {text || "-"}
          </Tag>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Face</span>,
        dataIndex: "face",
        key: "face",
        render: (face: boolean | null) => (
          <Tag color={face ? "green" : "red"} className="rounded-lg font-medium px-3 py-1">
            {face !== null ? (face ? "Ha" : "Yo'q") : "-"}
          </Tag>
        ),
      },
    ],
    [],
  );

  const staffPositionOptions = [
    { value: "", label: "Barchasi" },
    { value: "INTERN_TEACHER", label: "Intern o'qituvchi" },
    { value: "ASSISTANT", label: "Assistent" },
    { value: "SENIOR_TEACHER", label: "Katta o'qituvchi" },
    { value: "DOCENT", label: "Dotsent" },
    { value: "PROFESSOR", label: "Professor" },
    { value: "DEPARTMENT_HEAD", label: "Bo'lim mudiri" },
    { value: "DIVISION_HEAD", label: "Bo'linma mudiri" },
    { value: "RECTOR", label: "Rektor" },
    { value: "ACCOUNTANT", label: "Buxgalter" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <UserOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Xodimlar Ro'yxati</h1>
            <p className="text-gray-600 mt-1">Xodimlar ma'lumotlarini filtrlang va ko'ring</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            allowClear
            placeholder="Lavozim tanlang"
            options={staffPositionOptions}
            value={staffPosition || undefined}
            onChange={(v) => updateParams({ staffPosition: v || undefined })}
            className="h-11"
          />
          <div className="flex items-center gap-2 h-11">
            <span className="text-gray-700 font-semibold">Face:</span>
            <Switch
              checked={face}
              onChange={(checked) => updateParams({ face: checked.toString() })}
              className="bg-gray-200"
            />
          </div>
          <Button
            type="primary"
            onClick={() => updateParams({ staffPosition: "", face: undefined })}
            className="h-11 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-lg transition-all duration-200"
            icon={<SearchOutlined />}
          >
            Filtrlarni tozalash
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <Table
          loading={isFetching}
          dataSource={tableData}
          columns={columns}
          rowKey="employeeId"
          onChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          scroll={{ x: 2000 }}
          className="rounded-2xl"
        />
      </div>

      {/* Face Configure Modal - Yaxshilangan Style */}
      <Modal
        title={
          <div className="flex items-center gap-4 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <CameraOutlined className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Face Configure</h3>
              <p className="text-sm text-gray-600 font-medium">{selectedEmployee?.fullName}</p>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={onCloseHandler}
        footer={[
          <Button 
            key="cancel" 
            onClick={onCloseHandler}
            disabled={isLoading}
            className="border-gray-300 hover:border-gray-400 rounded-lg px-6 py-2 font-medium transition-all duration-200"
          >
            Bekor qilish
          </Button>,
          uploadedFile && (
            <Button
              key="retake"
              onClick={() => setUploadedFile(null)}
              disabled={isLoading}
              icon={<ReloadOutlined />}
              className="border-gray-300 hover:border-gray-400 rounded-lg px-6 py-2 font-medium transition-all duration-200 flex items-center gap-2"
            >
              Qayta yuklash
            </Button>
          ),
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleConfigureFace}
            disabled={!uploadedFile || isLoading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-lg px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            icon={<UploadOutlined />}
          >
            {isLoading ? "Amalga oshirilmoqda..." : "Face Configure"}
          </Button>,
        ]}
        width={700}
        closable={!isLoading}
        maskClosable={!isLoading}
        destroyOnClose
        className="rounded-2xl"
        style={{ borderRadius: '16px' }}
      >
        <div className="space-y-6 py-6">
          {/* Xodim ma'lumotlari - Yaxshilangan */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-3">
              <UserOutlined className="text-indigo-600" />
              Xodim ma'lumotlari
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="text-gray-600 block">ID:</span>
                <span className="font-semibold text-gray-800">#{selectedEmployee?.employeeId}</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="text-gray-600 block">To'liq ism:</span>
                <span className="font-semibold text-gray-800">{selectedEmployee?.fullName}</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="text-gray-600 block">Lavozim:</span>
                <span className="font-semibold text-gray-800">{selectedEmployee?.staffPosition || "-"}</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="text-gray-600 block">Bo'lim:</span>
                <span className="font-semibold text-gray-800">{selectedEmployee?.department || "-"}</span>
              </div>
            </div>
          </div>

          {/* Rasm yuklash qismi - Yaxshilangan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
              <UploadOutlined className="text-blue-600" />
              Rasm yuklash
            </h4>
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                className="w-full h-24 border-2 border-dashed border-blue-300 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 rounded-2xl font-medium text-gray-700 shadow-inner hover:shadow-md"
                disabled={isLoading}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">📁</div>
                  <div className="font-medium">Rasmni yuklang yoki bu yerga tashlang</div>
                  <div className="text-xs text-gray-500">JPG, PNG (5MB gacha)</div>
                </div>
              </Button>
            </Upload>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-700 font-medium mb-2">Talablar:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2"><UploadOutlined className="text-xs text-blue-500" /> Qo'llab-quvvatlanadigan formatlar: JPG, PNG, JPEG</li>
                <li className="flex items-center gap-2"><UploadOutlined className="text-xs text-blue-500" /> Maksimal hajm: 5MB</li>
                <li className="flex items-center gap-2"><UploadOutlined className="text-xs text-blue-500" /> Yuz aniq ko'rinadigan rasm bo'lishi kerak</li>
              </ul>
            </div>
          </div>

          {/* Yuklangan fayl ko'rsatkich - Yaxshilangan */}
          {uploadedFile && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-bold text-lg">Rasm muvaffaqiyatli yuklandi!</p>
                  <p className="text-green-700 font-medium">{uploadedFile.name}</p>
                  <p className="text-green-600 text-sm mt-1">
                    Hajmi: <span className="font-mono">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </p>
                </div>
                <img 
                  src={URL.createObjectURL(uploadedFile)} 
                  alt="Uploaded" 
                  className="w-16 h-16 object-cover rounded-lg border-2 border-green-200 shadow-md"
                />
              </div>
            </div>
          )}

          {/* Yuklash holati - Yaxshilangan */}
          {isLoading && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <div>
                  <p className="text-blue-800 font-bold text-lg">Amalga oshirilmoqda...</p>
                  <p className="text-blue-700 text-sm font-medium mt-1">
                    {uploadFileMutation.isPending && "Rasm yuklanmoqda..."}
                    {configureFaceMutation.isPending && "Face konfiguratsiya qilinmoqda..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default EmployeePage;