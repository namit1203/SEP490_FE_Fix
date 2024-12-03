import { Breadcrumb, Button, message, Spin, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkLoginToken } from "../../../utils";

const ListRequest = () => {
  const navigate = useNavigate();
  const [dataRequest, setDataRequest] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const handleRequestDetails = (id) => {
    navigate(`/dashboard/request/${id}`);
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Request/acceptCancleTicket/${id}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );

      if (response && response.status === 200) {
        message.success("Xác nhận thành công");
      }
    } catch (error) {
      message.error("Xác nhận không thành công");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Type ID",
      dataIndex: "typeId",
      key: "typeId",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Action",
      render: (record) => {
        if (record.typeId === 3) {
          return (
            <Button
              onClick={() => handleApprove(record.id)}
              htmlType=""
              className="bg-blue-500 text-white font-semibold"
            >
              Xác nhận
            </Button>
          );
        }
        return (
          <Button
            htmlType=""
            onClick={() => handleRequestDetails(record.id)}
            className="font-semibold"
          >
            Chi tiết
          </Button>
        );
      },
    },
  ];

  const fetchingDataRequest = async () => {
    try {
      setIsPending(true);
      const response = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Request",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );

      if (response.status === 200) {
        setDataRequest(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchingDataRequest();
  }, []);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/Trip" }]} />
      <div className="mt-5">
        <Table
          dataSource={dataRequest}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  );
};

export default ListRequest;
