"use client"

import { Modal, Form, Input, Button, Switch } from "antd"
import { useEffect } from "react"
import { EditOutlined } from "@ant-design/icons"
import { useUpdateProperty } from "../hooks/mutations"
import { Property } from "../service"

interface PropertyModalType {
  open: boolean
  handleClose?: () => void
  update?: Property | null
}

const PropertyModal = ({ open, handleClose, update }: PropertyModalType) => {
  const [form] = Form.useForm()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateProperty()

  useEffect(() => {
    if (update?.id) {
      form.setFieldsValue({
        key: update.key,
        value: update.value,
        active: update.active,
      })
    } else {
      form.resetFields()
    }
  }, [update, form])

  const onFinish = async (values: Partial<Property>) => {
    const payload: Pick<Property, "id" | "active" | "value"> = {
      id: update?.id as number, // Ensure id is included
      value: values.value as string,
      active: values.active as boolean,
    }

    updateMutate(payload, {
      onSuccess: () => {
        if (handleClose) {
          handleClose()
        }
        form.resetFields()
      },
    })
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={650}
      className="rounded-2xl overflow-hidden"
      styles={{
        content: {
          borderRadius: "16px",
          padding: "0",
          overflow: "hidden",
        },
      }}
      title={null}
    >
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <EditOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Property Update</h3>
            <p className="text-white/80">Update the property details</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-slate-300 to-slate-500">
        <Form form={form} name="property_form" layout="vertical" onFinish={onFinish} className="space-y-4">
          <Form.Item
            label={<span className="font-semibold text-gray-700">Key</span>}
            name="key"
          >
            <Input
              placeholder="Property key"
              className="h-12 rounded-xl border-gray-400"
              disabled // Read-only field
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Value</span>}
            name="value"
            rules={[{ required: true, message: "Please enter the value!" }]}
          >
            <Input
              prefix={<EditOutlined className="text-blue-500" />}
              placeholder="Enter property value"
              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Active</span>}
            name="active"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              className="bg-gray-300"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-8">
            <Button
              block
              htmlType="submit"
              loading={isUpdating}
              className="h-14 text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Update Property
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default PropertyModal