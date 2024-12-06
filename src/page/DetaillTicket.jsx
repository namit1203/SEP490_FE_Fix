import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { checkLoginToken } from "../utils";
import Header from "./Header"; // Import the Header component

const DetaillTicket = () => {
  const { id } = useParams(); // Get the ticket ID from the route
  const [ticket, setTicket] = useState(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [Description, setDescription] = useState("");

  // Fetch ticket details
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/ticketById/${id}`,
          {
            headers: {
              Authorization: "Bearer " + checkLoginToken(),
            },
          }
        );
        setTicket(data);

        if (data.vehicleId) {
          // Fetch vehicle details
          const vehicleResponse = await axios.get(
            `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/getInforVehicle/${data.vehicleId}`,
            {
              headers: {
                Authorization: "Bearer " + checkLoginToken(),
              },
            }
          );
          setLicensePlate(vehicleResponse.data.licensePlate);
          setDescription(vehicleResponse.data.description)
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        
      }
    };

    fetchTicketDetails();
  }, [id]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  const paymentStatus = ticket.status;

  return (
    <>
      <Header /> {/* Render the Header */}
      <div style={{  padding: "15px 5px 15px" }}>
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ backgroundColor: "#fff" }}>
            <div
              style={{
                padding: "10px 25px",
                fontFamily: "Arial, sans-serif",
                fontSize: 14,
                lineHeight: 24,
              }}
            >
              <div
                style={{
                  border: "1px solid #fd8017",
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: "#fd8017",
                    width: "100%",
                  }}
                >
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "100%" }}>
                          <div style={{ float: "left", padding: 5 }}>
                            <img
                              src="https://i.imgur.com/uoIrR3w.png"
                              style={{ width: "10%" }}
                              alt="Logo"
                            />
                          </div>
                          <div
                            style={{
                              float: "right",
                              width: 240,
                              color: "#ffffff",
                              fontSize: "1.2em",
                              fontWeight: "bold",
                              textAlign: "right",
                              padding: "10px 5px",
                            }}
                          >
                            <span>MÃ VÉ:</span>{" "}
                            <span style={{ color: "#fdb813" }}>{id}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style={{ backgroundColor: "#fff", paddingBottom: 15 }}>
                  <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <h3
                      style={{
                        fontSize: "1.7em",
                        color: "#fd8017",
                        textAlign: "center",
                        margin: "10px 0",
                      }}
                    >
                      Thông tin vé xe
                    </h3>
                    <table
                      style={{
                        width: "100%",
                        verticalAlign: "text-top",
                        fontSize: 13,
                        color: "#000",
                        lineHeight: 20,
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>Hãng xe:</td>
                          <td style={{ width: "65%", padding: 5 }}>
                          {Description || "Đang tải..."}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>Điểm đón:</td>
                          <td style={{ width: "65%", padding: 5 }}>
                            <b>{ticket.pointStart}</b>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>
                            Giờ đón (dự kiến):
                          </td>
                          <td style={{ width: "65%", padding: 5 }}>
                            <b>{new Date(ticket.timeFrom).toLocaleString()}</b>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>Điểm trả:</td>
                          <td style={{ width: "65%", padding: 5 }}>
                            <b>{ticket.pointEnd}</b>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>Tuyến:</td>
                          <td style={{ width: "65%", padding: 5 }}>
                            <b>{ticket.description}</b>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>Ghi chú:</td>
                          <td style={{ width: "65%", padding: 5 }}>
                            {ticket.note}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>
                            Biển số xe:
                          </td>
                          <td style={{ width: "65%", padding: 5 }}>
                            {licensePlate || "Đang tải..."}
                          </td>
                        </tr>
                        <tr style={{ fontSize: 16, fontWeight: "bold" }}>
                          <td
                            style={{
                              width: "35%",
                              padding: "10px 5px",
                              color: "#fd8017",
                            }}
                          >
                            Tổng tiền:
                          </td>
                          <td
                            style={{
                              width: "65%",
                              padding: "10px 5px",
                              color: "#fd8017",
                            }}
                          >
                            {ticket.pricePromotion.toLocaleString()} VND
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "35%", padding: 5 }}>
                            Trạng thái thanh toán:
                          </td>
                          <td style={{ width: "65%", padding: 5 }}>
                            {paymentStatus}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#fd8017",
                    color: "#ffffff",
                    lineHeight: 24,
                    padding: "5px 15px",
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    fontSize: 12,
                  }}
                >
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "100%", color: "#fff" }}>
                          <div style={{ float: "left" }}>
                            <span>Hotline: </span>
                          </div>
                          <div style={{ float: "right" }}>
                            <span>
                              E-Ticket  (
                              {new Date().toLocaleString()} )
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetaillTicket;
