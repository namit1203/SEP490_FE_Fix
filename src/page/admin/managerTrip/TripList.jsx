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

const TripList = () => {
  const { Option } = Select;
  const [open, setOpen] = useState(false);
  const [openV2, setOpenV2] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [checkOtp, setCheckOtp] = useState(false);
  const [checkImport, setCheckImport] = useState(false);

  const [dataUser, setDataUser] = useState([]);
  const [dataVehicle, setDataVehicle] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const [form] = Form.useForm();
  const handelFetchData = async () => {
    const { data } = await axios.get("https://boring-wiles.202-92-7-204.plesk.page/api/Trip", {
      headers: {
        Authorization: "Bearer " + checkLoginToken(),
      },
    });
    setDataUser(data);
  };
  const handelFetchDataVehicle = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/listVehicle",
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    setDataVehicle(data);
  };
  useEffect(() => {
    handelFetchData();
    handelFetchDataVehicle();
  }, []);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setIdUser(null);
  };
  const showDrawerV2 = () => {
    setOpenV2(true);
  };
  const onCloseV2 = () => {
    setOpenV2(false);
    setIdUser(null);
  };

  const confirm = async (e) => {
    await axios.delete(
      "https://boring-wiles.202-92-7-204.plesk.page/api/Account/deleteAccount/" + e,
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    handelFetchData();
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const dataSource = dataUser.filter((data) => data.status == true);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "startTime",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "pointStart",
      dataIndex: "pointStart",
      key: "pointStart",
    },
    {
      title: "pointEnd",
      dataIndex: "pointEnd",
      key: "pointEnd",
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
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/tripId?TripId=" + idUser
        );
        const data = await response.json();
        setAccountData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, form, idUser]);
  console.log(accountData, "accountData");
  const handelExportExcel = async () => {
    try {
      const response = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Trip/export_Template",
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition
            .split("filename=")[1]
            .split(";")[0]
            .replace(/"/g, "")
        : "download.xlsx";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel file:", error);
    }
  };
  const [file, setFile] = useState(null);
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const onFinishV2 = async (values) => {
    console.log(values, "values.fileExcelTrip");
    const formData = new FormData();
    formData.append("fileExcelTrip", file);
    formData.append("typeOfTrip", values.typeOfTrip);
    alert(1);
    try {
      const response = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Trip/importTrip/" + values.typeOfTrip,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      message.success("Upload thành công!");
      console.log(response.data);
    } catch (error) {
      message.error("Có lỗi xảy ra khi upload!");
      console.error(error);
    }
  };
  return (
    <div>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/trip" }]} />
      <div className="flex justify-end">
        <Button
          htmlType=""
          onClick={() => {
            setCheckImport(true);
            showDrawerV2();
          }}
          className="bg-green-500 text-white font-medium"
        >
          Import data from excel
        </Button>
        <Button
          htmlType=""
          onClick={handelExportExcel}
          className="bg-green-500 text-white font-medium"
        >
          Export to excel
        </Button>
        <Button
          htmlType=""
          onClick={showDrawerV2}
          className="bg-green-500 text-white font-medium"
        >
          Thêm Mới
        </Button>
      </div>
      <Drawer
        title="Basic Drawer"
        onClose={onCloseV2}
        open={openV2}
        width={800}
      >
        {checkImport ? (
          <>
            <Form
              form={form}
              name="importExcel"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinishV2}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="fileExcelTrip"
                label="File Excel Trip"
                rules={[
                  { required: true, message: "Vui lòng chọn file Excel!" },
                ]}
              >
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={onFileChange}
                />
              </Form.Item>
              <Form.Item label="Loại chuyến đi" name="typeOfTrip">
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Upload
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
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
              name="category"
              label="Tên Phương tiện giao thông "
              rules={[{ required: true, message: "Danh mục  là bắt buộc" }]}
            >
              <Select placeholder="Danh mục" size="large">
                {dataVehicle?.map((category) => (
                  <Option value={category.id} key={category.id}>
                    <span className="text-sm capitalize">
                      {category.description}
                    </span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="ID" name="id">
              <Input disabled />
            </Form.Item>
          </Form>
        )}
      </Drawer>
      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
        {accountData?.map((dt) => {
          return (
            <div
              key={dt?.id}
              className="mb-4 p-4 border rounded-lg shadow-md bg-white"
            >
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Point Start Details
                </label>
                <input
                  value={dt.pointStartDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Point End Details
                </label>
                <input
                  value={dt.pointEndDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Time Start Details
                </label>
                <input
                  value={dt.timeStartDetils}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Time End Details
                </label>
                <input
                  value={dt.timeEndDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          );
        })}
      </Drawer>
      <div className="mt-5">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default TripList;
