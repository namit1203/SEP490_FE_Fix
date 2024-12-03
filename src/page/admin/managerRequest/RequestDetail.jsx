import { Button, DatePicker, Form, Input, Select, Spin, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkLoginToken } from "../../../utils";

const { Option } = Select;

const RequestDetail = () => {
  const { id } = useParams(); // Get ID from URL
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [typeId, setTypeId] = useState(null); // Save typeId to determine the interface
  const [drivers, setDrivers] = useState([]); // Drivers list (type 4)
  const [vehicles, setVehicles] = useState([]); // Vehicles list (type 2, 5, 7)
  const [selectedDriver, setSelectedDriver] = useState(null); // Selected driver (type 4)
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Selected vehicle (type 2, 5, 7)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        // Fetch request list to determine typeId
        const requestListResponse = await axios.get(
          "https://boring-wiles.202-92-7-204.plesk.page/api/Request",
          {
            headers: {
              Authorization: "Bearer " + checkLoginToken(),
            },
          }
        );

        const request = requestListResponse.data.find(
          (req) => req.id.toString() === id
        );

        if (!request) {
          throw new Error("Request not found");
        }

        setTypeId(request.typeId); // Save typeId

        // Fetch request details from GetRequestDetailById API
        const requestDetailResponse = await axios.get(
          `https://boring-wiles.202-92-7-204.plesk.page/GetRequestDetailById/${id}`,
          {
            headers: {
              Authorization: "Bearer " + checkLoginToken(),
            },
          }
        );

        const data = requestDetailResponse.data;

        // Fetch vehicles if typeId is 2, 5, or 7
        if ([2, 5, 7].includes(request.typeId)) {
          const vehiclesResponse = await axios.get(
            "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentVehicle/ListVehicleRent",
            {
              headers: {
                Authorization: "Bearer " + checkLoginToken(),
              },
            }
          );
          setVehicles(vehiclesResponse.data || []);
        }

        // Fetch drivers if typeId is 4
        if (request.typeId === 4) {
          const driversResponse = await axios.get(
            "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentDriver/ListDriverRent",
            {
              headers: {
                Authorization: "Bearer " + checkLoginToken(),
              },
            }
          );
          setDrivers(driversResponse.data || []);
        }

        // Update form with data from the API
        form.setFieldsValue({
          driverId: data.driverId || "N/A",
          vehicleId: data.vehicleId || "N/A",
          startLocation: data.startLocation || "N/A",
          endLocation: data.endLocation || "N/A",
          startTime: data.startTime ? dayjs(data.startTime) : null,
          endTime: data.endTime ? dayjs(data.endTime) : null,
          seats: data.seats || "N/A",
          price: data.price || "",
        });
      } catch (error) {
        console.error("Error fetching request detail:", error);
        message.error("Failed to fetch request details.");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, form]);

  const handleActionType2 = async (choose) => {
    const price = form.getFieldValue("price"); // Get price from form

    if (!selectedVehicle) {
      message.error("Please select a vehicle.");
      return;
    }

    if (!price) {
      message.error("Please enter a price.");
      return;
    }

    try {
      const url = `https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/createTicketForRentCar?requestId=${id}&choose=${choose}&vehicleId=${selectedVehicle}&price=${price}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );

      message.success(
        choose
          ? "Vehicle request has been approved successfully."
          : "Vehicle request has been denied."
      );
    } catch (error) {
      console.error("Error submitting action:", error);
      message.error("Failed to process the action.");
    }
  };

  const handleActionType7 = async (choose) => {
    if (!selectedVehicle) {
      message.error("Please select a vehicle.");
      return;
    }

    try {
      await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentVehicle/AddHistoryVehicle",
        {
          requestId: id,
          choose,
          vehicleId: selectedVehicle,
        },
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );

      message.success(
        choose
          ? "Vehicle request has been approved successfully."
          : "Vehicle request has been denied."
      );
    } catch (error) {
      console.error("Error submitting action:", error);
      message.error("Failed to process the action.");
    }
  };

  const handleActionType4 = async (choose) => {
    if (!selectedDriver) {
      message.error("Please select a driver.");
      return;
    }

    try {
      await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentDriver/AddHistoryDriver",
        {
          requestId: id,
          choose,
          driverId: selectedDriver,
        },
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );

      message.success(
        choose
          ? "Driver request has been approved successfully."
          : "Driver request has been denied."
      );
    } catch (error) {
      console.error("Error submitting action:", error);
      message.error("Failed to process the action.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center font-bold text-red-600 text-xl">
        Failed to load request details. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Request Details</h2>
      <Form
        form={form}
        name="requestDetails"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item label="Driver ID" name="driverId">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Start Location" name="startLocation">
          <Input disabled />
        </Form.Item>
        <Form.Item label="End Location" name="endLocation">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Seats" name="seats">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Price" name="price">
          <Input />
        </Form.Item>
        <Form.Item label="Start Time" name="startTime">
          <DatePicker showTime disabled />
        </Form.Item>
        <Form.Item label="End Time" name="endTime">
          <DatePicker showTime disabled />
        </Form.Item>
        {[2, 7].includes(typeId) && (
          <Form.Item label="Vehicle">
            <Select
              onChange={(value) => setSelectedVehicle(value)}
              placeholder="Select a vehicle"
            >
              {vehicles.map((vehicle) => (
                <Option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {typeId === 4 && (
          <Form.Item label="Driver">
            <Select
              onChange={(value) => setSelectedDriver(value)}
              placeholder="Select a driver"
            >
              {drivers.map((driver) => (
                <Option key={driver.id} value={driver.id}>
                  {driver.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
      <div className="mt-5 flex space-x-4">
        {typeId === 2 && (
          <>
            <Button
              type="primary"
              onClick={() => handleActionType2(true)}
              disabled={!selectedVehicle}
            >
              Approve
            </Button>
            <Button danger onClick={() => handleActionType2(false)}>
              Deny
            </Button>
          </>
        )}
        {typeId === 7 && (
          <>
            <Button
              type="primary"
              onClick={() => handleActionType7(true)}
              disabled={!selectedVehicle}
            >
              Approve
            </Button>
            <Button danger onClick={() => handleActionType7(false)}>
              Deny
            </Button>
          </>
        )}
        {typeId === 4 && (
          <>
            <Button
              type="primary"
              onClick={() => handleActionType4(true)}
              disabled={!selectedDriver}
            >
              Approve
            </Button>
            <Button danger onClick={() => handleActionType4(false)}>
              Deny
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
