import {
  Breadcrumb,
  Button,
  Popconfirm,
  Table,
  Drawer,
  Form,
  Input,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../../utils";

const PromotionList = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [form] = Form.useForm();

  // Fetch promotion list
  const handelFetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDataUser(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  useEffect(() => {
    handelFetchData();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setIdUser(null);
    form.resetFields();
  };

  // Delete promotion
  const confirm = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5127/api/Promotion/deletePromotion/${id}`,
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      message.success("Promotion deleted successfully");
      handelFetchData();
    } catch (error) {
      message.error("Error deleting promotion");
      console.error("Error deleting promotion:", error);
    }
  };

  const cancel = () => {
    message.error("Action cancelled");
  };

  // Render promotion data
  const dataSource = dataUser;
  const columns = [
    {
      title: "Code",
      dataIndex: "codePromotion",
      key: "codePromotion",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => (
        <div>
          {startDate?.split("T")[0]} - {startDate?.split("T")[1]}
        </div>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Action",
      render: (record) => (
        <div className="space-x-5">
          <Popconfirm
            title="Delete the promotion"
            description="Are you sure to delete this promotion?"
            onConfirm={() => confirm(record.id)} // Ensure `id` is passed correctly
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-500 text-white font-semibold">
              Remove
            </Button>
          </Popconfirm>
  
          <Button
            onClick={() => {
              setIdUser(record.id); // Set the correct ID for fetching promotion details
              showDrawer();
            }}
            className="font-semibold"
          >
            Details
          </Button>
        </div>
      ),
    },
  ];
  

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Fetch promotion details for Drawer
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idUser) {
          const { data } = await axios.get(
            `http://103.245.237.93:8082/api/Promotion/getPromotionById/${idUser}`,
            {
              headers: {
                Authorization: "Bearer " + checkLoginToken(),
              },
            }
          );
          form.setFieldsValue({
            ...data,
            dob: data.dob ? dayjs(data.dob) : null,
            createdAt: data.createdAt ? dayjs(data.createdAt) : null,
            updateAt: data.updateAt ? dayjs(data.updateAt) : null,
          });
        }
      } catch (error) {
        console.error("Error fetching promotion details:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, idUser, form]);

  return (
    <div>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/Promotions" }]} />
      <Drawer title="Promotion Details" onClose={onClose} open={open}>
        <Form
          form={form}
          name="promotionDetails"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Code"
            name="codePromotion"
            rules={[
              { required: true, message: "Please input the promotion code!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[
              { required: true, message: "Please input the discount!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
              { required: true, message: "Please input the start date!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <div className="mt-5">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default PromotionList;
