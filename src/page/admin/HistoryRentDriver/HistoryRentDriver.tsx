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

const HistoryRentDriver = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [checkAdd, setCheckAdd] = useState(false);
  const [datalistVehicle, setDatalistVehicle] = useState([]);

  const [dataUser, setDataUser] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const [form] = Form.useForm();
  const handelFetchDatalistVehicle = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Request",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDatalistVehicle(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handelFetchData = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentDriver/ListDriverRent",
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
    handelFetchDatalistVehicle();
  }, []);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIdUser(null);
  };
  const confirm = async (e) => {
    await axios.delete("https://boring-wiles.202-92-7-204.plesk.page/api/Driver/" + e, {
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
      title: "Name Driver",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "numberPhone",
      dataIndex: "numberPhone",
      key: "numberPhone",
    },
    {
      title: "license",
      dataIndex: "license",
      key: "license",
    },

    {
      title: "Action",
      render: ({ id }) => {
        return (
          <div className="space-x-5">
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => confirm(id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                htmlType=""
                className="bg-red-500 text-white font-semibold"
              >
                Remove
              </Button>
            </Popconfirm>

            <Button
              htmlType=""
              onClick={() => {
                setIdUser(id);
                showDrawer();
              }}
              className="font-semibold"
            >
              chi tiết
            </Button>
          </div>
        );
      },
    },
  ];
  const onFinish = async (values) => {
    await axios.post(
      `https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentDriver/AddHistoryDriver?requestId=${values.requestId}&choose=${values.choose}`,
      null,
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    message.success("success");
    onClose();
    handelFetchData();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://boring-wiles.202-92-7-204.plesk.page/api/Driver/" + idUser
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
          <>
            <Form.Item
              label="choose"
              name="choose"
              rules={[{ required: true, message: "Please input " }]}
            >
              <Select placeholder="choose" size="large">
                <Select.Option value={"true"}>
                  <span className="text-sm capitalize">True</span>
                </Select.Option>
                <Select.Option value={"False"}>
                  <span className="text-sm capitalize">False</span>
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="requestId" label="Xe">
              <Select placeholder="Xe" size="large">
                {datalistVehicle?.map((category: any) => {
                  return (
                    <Select.Option
                      value={category?.typeId}
                      key={category?.typeId}
                    >
                      <span className="text-sm capitalize">
                        {category?.description}
                      </span>
                    </Select.Option>
                  );
                })}
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

export default HistoryRentDriver;
