"use client"

import  { useEffect, useState } from "react"
import { Button, Card, Space, Tooltip } from "antd"
import { EditOutlined,} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { GlobalTable } from "@components"
import { useGetProperty } from "../hooks/queries"
import PropertyModal from "./modal"
import { Property } from "../service"
// import type { Property, PropertyResponse } from "@types"

const Index = () => {
  const [tableData, setTableData] = useState<Property[]>([])
  const [total, setTotal] = useState<number>(0)
  const [params, setParams] = useState({
    size: 10,
    page: 1,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [update, setUpdate] = useState<Property | null>(null)
  const navigate = useNavigate()

  const { data: property, isFetching: isGettingProperties } = useGetProperty({
    size: params.size,
    page: params.page - 1,
  })

  useEffect(() => {
    if (property?.content) {
      setTableData(property.content)
      setTotal(property.paging.totalItems || 0)
    }
  }, [property])

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    setParams({ size: pageSize, page: current })
    navigate(`?page=${current}&size=${pageSize}`)
  }

  const editData = (item: Property) => {
    setUpdate(item)
    setIsModalOpen(true)
  }

  // const deleteData = (id: number) => {
  //   // Placeholder for delete functionality
  //   console.log("Delete item with id:", id)
  // }

  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(null)
  }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      render: (text: number) => (
        <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">#{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Value</span>,
      dataIndex: "value",
      render: (text: string) => <span className="text-gray-800 font-medium">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Active</span>,
      dataIndex: "active",
      render: (active: boolean) => (
        <span
          className={`font-medium px-3 py-1 rounded-lg ${
            active ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Actions</span>,
      key: "action",
      render: (record: Property) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              onClick={() => editData(record)}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-lg"
              size="small"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          {/* <Tooltip title="Delete">
            <Button
              onClick={() => deleteData(record.id)}
              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 rounded-lg"
              size="small"
            >
              <DeleteOutlined />
            </Button>
          </Tooltip> */}
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Modal */}
      <PropertyModal open={isModalOpen} handleClose={handleClose} update={update} />

      {/* Header Card */}
      <Card
        className="bg-gradient-to-r from-slate-300 to-slate-500 rounded-2xl shadow-lg border-0 overflow-hidden"
        bodyStyle={{ padding: "32px" }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <EditOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Properties Management</h1>
            <p className="text-gray-600">Manage system properties and their values</p>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden" bodyStyle={{ padding: "0" }}>
        <GlobalTable
          loading={isGettingProperties}
          data={tableData}
          columns={columns}
          handleChange={handleTableChange}
          pagination={{
            current: params.page,
            pageSize: params.size,
            total: total || 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600 font-medium">
                {range[0]}-{range[1]} of {total} items
              </span>
            ),
          }}
          className="rounded-2xl"
        />
      </Card>
    </div>
  )
}

export default Index