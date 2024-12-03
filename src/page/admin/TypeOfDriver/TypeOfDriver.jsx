import {
  Breadcrumb,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../../utils";

const TypeOfDriver = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [checkAdd, setCheckAdd] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const [form] = Form.useForm();
  const handelFetchData = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/TypeOfDriver",
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    setDataUser(data);
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
    setCheckAdd(false);
  };

  const confirm = async (e) => {
    await axios.delete("https://boring-wiles.202-92-7-204.plesk.page/api/TypeOfDriver/" + e, {
      headers: {
        Authorization: "Bearer " + checkLoginToken(),
      },
    });
    handelFetchData();
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const dataSource = dataUser?.filter((data) => data.status == true);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      render: ({ id }) => {
        return (
          <div className="space-x-5">
            <Button
              htmlType=""
              onClick={() => confirm(id)}
              className="bg-red-500 text-white font-semibold"
            >
              Remove
            </Button>
            <Button
              htmlType=""
              onClick={() => {
                setIdUser(id);
                showDrawer();
                setCheckAdd(false);
              }}
              className="font-semibold"
            >
              Sửa
            </Button>
          </div>
        );
      },
    },
  ];
  const onFinish = async (values) => {
    if (checkAdd) {
      await axios.post("https://boring-wiles.202-92-7-204.plesk.page/api/TypeOfDriver/", {
        ...values,
      });
      message.success("success");
      onClose();
      handelFetchData();
    } else {
      await axios.put("https://boring-wiles.202-92-7-204.plesk.page/api/TypeOfDriver/" + idUser, {
        ...values,
      });
      message.success("success");
      onClose();
      handelFetchData();
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://boring-wiles.202-92-7-204.plesk.pageapi/TypeOfDriver/" + idUser
        );
        const data = await response.json();
        form.setFieldsValue({
          ...data,
          dob: data.dob ? dayjs(data.dob) : null,
          createdAt: data.createdAt ? dayjs(data.createdAt) : null,
          updateAt: data.updateAt ? dayjs(data.updateAt) : null,
        });
        setAccountData(data);
        form.setFieldsValue(data); // Đặt dữ liệu vào form
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open && idUser) {
      fetchData();
    }
  }, [open, form, idUser]);
  return (
    <div>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/User" }]} />
      <div className="flex justify-end">
        <Button
          htmlType=""
          onClick={() => {
            setCheckAdd(true);
            showDrawer();
          }}
          className="bg-green-500 text-white font-medium"
        >
          Thêm Mới
        </Button>
      </div>
      <Drawer
        title={checkAdd ? "Add new" : "Edit"}
        onClose={onClose}
        open={open}
      >
        <Form
          form={form}
          name="accountDetails"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <>
            <Form.Item
              label="name driver"
              name="description"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="status"
              name="status"
              rules={[{ required: true, message: "Please input your status!" }]}
            >
              <Select placeholder="Status" size="large">
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>
          </>

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

export default TypeOfDriver;
