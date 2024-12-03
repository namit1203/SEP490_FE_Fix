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
  Table,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../../utils";

const RoleList = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);

  const [dataUser, setDataUser] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const [form] = Form.useForm();

  const handelFetchData = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/Account/listRole",
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
  };

  const confirm = async (e) => {
    await axios.delete(
      "http://103.245.237.93:8082/api/Role/deleteRole/" + e
    );
    handelFetchData();
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const dataSource = dataUser
  const columns = [
    {
      title: "Name",
      dataIndex: "roleName",
      key: "roleName",
    },

    {
      title: "Action",
      render: ({ id }) => {
        return (
          <>
            <div className="space-x-5">
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={() => confirm(id)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="" className="bg-red-500 text-white font-semibold">
                  Remove
                </Button>
              </Popconfirm>
              
          </div> 
          </>
        );
      },
    },
  ];
  const onFinish = async(values) => {
    const dataPayload = {
      roleName: values?.roleName,
      status: true,
      createdAt: "2024-11-11T01:40:24.629Z",
      createdBy: 0,
      updateAt: "2024-11-11T01:40:24.629Z",
      updateBy: 0,
    };
    try {
      const res = await axios.post('https://boring-wiles.202-92-7-204.plesk.page:8082/api/Role/addRole', dataPayload, {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      })
      console.log(res);
      handelFetchData()
      onClose()
    } catch (error) {
      // 
    }
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://boring-wiles.202-92-7-204.plesk.page/api/Account/detailsAccount/" + idUser
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

    if (open) {
      fetchData();
    }
  }, [open, form, idUser]);
  return (
    <div>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/User" }]} />
      <div className="flex justify-end">
        <Button
          htmlType=""
          onClick={showDrawer}
          className="bg-green-500 text-white font-medium"
        >
          Thêm Mới
        </Button>
      </div>
      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
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
          <Form.Item
            label="role name"
            name="roleName"
            rules={[{ required: true, message: "Please input your roleName!" }]}
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

export default RoleList;
