import { message } from "antd";
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/app.context";
import Footer from "./Footer";
import Header from "./Header";
const Home = () => {
  const { setProfile } = useContext(AppContext);
  const [openLogin, setOpenLogin] = useState(false);
  const [checkTab, setChecktab] = useState("login");
  const [otp, setOtp] = useState(false);
  const [otpInput, setOtpInput] = useState(null);
  const [dataSearch, setDataSearch] = useState({
    startPoint: "",
    endPoint: "",
    time: "",
  });
  console.log(dataSearch, "dataSearchdataSearch");
  const navigate = useNavigate();
  const initValueLogin = {
    id: 0,
    username: "",
    email: "string",
    numberPhone: "string",
    password: "",
    roleName: "string",
  };
  const [dataLogin, setDataLogin] = useState(initValueLogin);
  const [dataSignup, setDataSignup] = useState({
    id: 0,
    username: "",
    email: "",
    numberPhone: "string",
    password: "",
    dob: "2024-11-02T13:03:21.606Z",
    status: true,
    activeCode: "string",
    updateAt: "2024-11-02T13:03:21.606Z",
    createdAt: "2024-11-02T13:03:21.606Z",
  });
  const handelLogin = async () => {
    try {
        if (checkTab === "login") {
            // Handle Login
            const { data } = await axios.post(
                "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/login",
                dataLogin
            );

            // Ensure the token exists in the new response structure
            if (data && data.token) {
                // Notify success
                message.success("Login successful");

                // Save token and additional details to localStorage
                const token = data.token; // Extract token
                localStorage.setItem("token", token);
                localStorage.setItem("role", data.role || ""); // Save role (if provided)
                localStorage.setItem("userName", data.userName || ""); // Save username (if provided)

                // Fetch user profile
                const responseCheckLogin = await axios.get(
                    "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/userProfile",
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );

                if (responseCheckLogin && responseCheckLogin.data) {
                    // Save user profile to state and localStorage
                    setProfile(responseCheckLogin.data);
                    localStorage.setItem(
                        "profile",
                        JSON.stringify(responseCheckLogin.data)
                    );
                }

                // Close login modal
                setOpenLogin(false);
            } else {
                // Notify failure if token is not received
                message.error("Login failed: Token not received");
            }
        } else {
            // Handle Signup
            const { data } = await axios.post(
                "https://boring-wiles.202-92-7-204.plesk.page//api/Auth/register",
                dataSignup
            );

            if (data) {
                // Notify success
                message.success("Registration successful");

                // Update UI state
                setChecktab("login");
                setOtp(true);
            } else {
                // Notify failure
                message.error("Registration failed");
            }
        }
    } catch (error) {
        // Log and notify errors
        console.error("Error during login/register process:", error);
        message.error("An error occurred during the process");
    }
};
  const handelCheckOtp = async () => {
    try {
      //
      const dataPayload = {
        email: dataSignup.email,
        code: otpInput,
      };
      const { data } = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/confirm",
        dataPayload
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative">
      {openLogin && (
        <div className="absolute ">
          <div className="bg-black bg-opacity-50">
            <div
              tabIndex={-1}
              className="ant-modal-wrap bg-black bg-opacity-50"
              role="dialog"
            >
              <div
                role="document"
                className="ant-modal"
                style={{ width: 520, transformOrigin: "819px -218px" }}
              >
                <div
                  tabIndex={0}
                  aria-hidden="true"
                  style={{ width: 0, height: 0, overflow: "hidden" }}
                />
                <div className="ant-modal-content">
                  <button
                    onClick={() => setOpenLogin(false)}
                    aria-label="Close"
                    className="ant-modal-close"
                  >
                    <span className="ant-modal-close-x">
                      <i
                        aria-label="icon: close"
                        className="anticon anticon-close ant-modal-close-icon"
                      >
                        <svg
                          viewBox="64 64 896 896"
                          className
                          data-icon="close"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                        </svg>
                      </i>
                    </span>
                  </button>
                  <div className="ant-modal-body" style={{ padding: 20 }}>
                    <div
                      fontSize={16}
                      fontWeight="bold"
                      className="core__Box-sc-1c81tsc-0 iOPbCn text-center font-bold text-black"
                    >
                      {checkTab == "login" ? "Đăng nhập" : "Đăng ký"}
                    </div>
                    <div className="core__Box-sc-1c81tsc-0 egrBeo">
                      <div className="core__Box-sc-1c81tsc-0 bbPuqJ">
                        <div>
                          {checkTab != "login" && (
                            <>
                              <span className="core__Text-sc-1c81tsc-1 hDnryH mt-2">
                                Email
                              </span>
                              <div className="base__HStack-sc-1tvbuqk-47 QePTd ">
                                <input
                                  onChange={(e) => {
                                    checkTab != "login" &&
                                      setDataSignup({
                                        ...dataSignup,
                                        email: e.target.value,
                                      });
                                  }}
                                  className="ant-input ant-input-lg PhoneInput__StyledInput-sc-1oxca4h-1 kDZNIW"
                                  type="text"
                                />
                              </div>
                            </>
                          )}
                          {otp && (
                            <>
                              <span className="core__Text-sc-1c81tsc-1 hDnryH">
                                {otp ? "Nhập mã OTP" : "Tên đăng nhập"}
                              </span>
                              <div className="base__HStack-sc-1tvbuqk-47 QePTd ">
                                <input
                                  onChange={(e) => {
                                    setOtpInput(e.target.value);
                                  }}
                                  value={otpInput}
                                  className="ant-input ant-input-lg PhoneInput__StyledInput-sc-1oxca4h-1 kDZNIW"
                                  type="text"
                                />
                              </div>
                            </>
                          )}
                          {!otp && (
                            <>
                              <span className="core__Text-sc-1c81tsc-1 hDnryH">
                                {otp ? "Nhập mã OTP" : "Tên đăng nhập"}
                              </span>

                              <div className="base__HStack-sc-1tvbuqk-47 QePTd ">
                                <input
                                  onChange={(e) => {
                                    checkTab == "login"
                                      ? setDataLogin({
                                          ...dataLogin,
                                          username: e.target.value,
                                        })
                                      : setDataSignup({
                                          ...dataSignup,
                                          username: e.target.value,
                                        });
                                  }}
                                  value={
                                    checkTab == "login"
                                      ? dataLogin.username
                                      : dataSignup.username
                                  }
                                  className="ant-input ant-input-lg PhoneInput__StyledInput-sc-1oxca4h-1 kDZNIW"
                                  type="text"
                                />
                              </div>
                              <span className="core__Text-sc-1c81tsc-1 hDnryH mt-2">
                                Mật khẩu
                              </span>
                              <div className="base__HStack-sc-1tvbuqk-47 QePTd ">
                                <input
                                  onChange={(e) => {
                                    checkTab == "login"
                                      ? setDataLogin({
                                          ...dataLogin,
                                          password: e.target.value,
                                        })
                                      : setDataSignup({
                                          ...dataSignup,
                                          password: e.target.value,
                                        });
                                  }}
                                  value={
                                    checkTab == "login"
                                      ? dataLogin.password
                                      : dataSignup.password
                                  }
                                  className="ant-input ant-input-lg PhoneInput__StyledInput-sc-1oxca4h-1 kDZNIW"
                                  type="password"
                                />
                              </div>
                            </>
                          )}

                          <button
                            onClick={() => {
                              otp ? handelCheckOtp() : handelLogin();
                            }}
                            id="btn-phone-auth"
                            className="ant-btn ant-btn-lg ant-btn-block"
                            style={{ marginTop: 10 }}
                          >
                            <span>Tiếp tục</span>
                          </button>
                        </div>
                        <div
                          className="AuthMethodSelect__StyledDivider-sc-1dumdyw-0 eRWLoS ant-divider ant-divider-horizontal ant-divider-with-text-center"
                          role="separator"
                        >
                          <span className="ant-divider-inner-text"></span>
                        </div>

                      </div>
                      <div className="core__Box-sc-1c81tsc-0 bbPuqJ">
                        Bạn {checkTab == "login" ? "chưa" : "Đã"} có tài khoản?
                        <button
                          onClick={() => {
                            checkTab == "login"
                              ? setChecktab("signup")
                              : setChecktab("login");
                          }}
                          className="ant-btn ant-btn-link ant-btn-sm"
                        >
                          <span>
                            {" "}
                            {checkTab == "login" ? "Đăng ký" : "Đăng nhập"}
                          </span>
                        </button>
                      </div>
                      <div className="core__Box-sc-1c81tsc-0 bbPuqJ">
                        Bạn Quên mật khẩu?
                        <button
                          onClick={() => {
                            window.location.href = "/forgot-password"; 
                          }}
                          className="ant-btn ant-btn-link ant-btn-sm"
                        >
                        Lấy lại mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  tabIndex={0}
                  aria-hidden="true"
                  style={{ width: 0, height: 0, overflow: "hidden" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="__next">
        <div
          id="wheelLoadingContainer"
          className="loading__LoadingContainer-sc-1dclnqz-0 dKZTJA"
        >
          <div
            id="wheelLoadingWrapper"
            className="loading__WheelLoadingWrapper-sc-1dclnqz-3 jJFyMk"
          >
            <div className="wheelLoading__WheelLoadingModal-sc-1q0mou7-0 bCqWOL">
              <div className="lf-player-container">
                <div
                  id="lottie"
                  style={{
                    background: "transparent",
                    margin: "0 auto",
                    outline: "none",
                    overflow: "hidden",
                    height: 240,
                    width: 240,
                    marginTop: "-40px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    width={512}
                    height={512}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: "translate3d(0px, 0px, 0px)",
                      contentVisibility: "visible",
                    }}
                  >
                    <defs>
                      <clipPath id="__lottie_element_2">
                        <rect width={512} height={512} x={0} y={0} />
                      </clipPath>
                      <clipPath id="__lottie_element_5">
                        <path d="M0,0 L1920,0 L1920,1080 L0,1080z" />
                      </clipPath>
                      <clipPath id="__lottie_element_6">
                        <path
                          fill="#ffffff"
                          clipRule="nonzero"
                          d=" M2442,-479.906005859375 C2442,-479.906005859375 -543.56201171875,-479.906005859375 -543.56201171875,-479.906005859375 C-543.56201171875,-479.906005859375 -553.8179931640625,764.1110229492188 -553.8179931640625,764.1110229492188 C-553.8179931640625,764.1110229492188 2431.7451171875,764.1110229492188 2431.7451171875,764.1110229492188 C2431.7451171875,764.1110229492188 2442,-479.906005859375 2442,-479.906005859375"
                          fillOpacity={1}
                        />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#__lottie_element_2)">
                      <g
                        clipPath="url(#__lottie_element_5)"
                        style={{ display: "block" }}
                        transform="matrix(0.2032800018787384,0,0,0.2032800018787384,8.654190063476562,204.85519409179688)"
                        opacity={1}
                      >
                        <g clipPath="url(#__lottie_element_6)">
                          <g
                            style={{ display: "block" }}
                            transform="matrix(0.9945374131202698,0,0,0.9945374131202698,1143.163818359375,541.2161254882812)"
                            opacity="0.9910991551299972"
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                          <g
                            style={{ display: "block" }}
                            transform="matrix(0.7380689978599548,0,0,0.7380689978599548,936.863525390625,598.3123779296875)"
                            opacity="0.7380689833988622"
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                          <g
                            style={{ display: "block" }}
                            transform="matrix(0.48808789253234863,0,0,0.48808789253234863,731.53076171875,653.9644165039062)"
                            opacity="0.48808789159886196"
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                          <g
                            style={{ display: "block" }}
                            transform="matrix(0.23809897899627686,0,0,0.23809897899627686,526.90771484375,709.6182250976562)"
                            opacity="0.23809898339886207"
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                          <g
                            style={{ display: "block" }}
                            transform="matrix(0.007213230710476637,0,0,0.007213230710476637,1574.253173828125,761.0191650390625)"
                            opacity={1}
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                          <g
                            style={{ display: "block" }}
                            transform="matrix(0.29941749572753906,0,0,0.29941749572753906,1459.28857421875,695.9671630859375)"
                            opacity={1}
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                          <g
                            transform="matrix(0.7278774976730347,0,0,0.7278774976730347,1271.3621826171875,600.581298828125)"
                            opacity={1}
                            style={{ display: "block" }}
                          >
                            <g
                              opacity={1}
                              transform="matrix(1,0,0,1,-149.375,222.625)"
                            >
                              <path
                                fill="rgb(255,175,31)"
                                fillOpacity={1}
                                d=" M0,-154.625 C85.33753967285156,-154.625 154.625,-85.33753967285156 154.625,0 C154.625,85.33753967285156 85.33753967285156,154.625 0,154.625 C-85.33753967285156,154.625 -154.625,85.33753967285156 -154.625,0 C-154.625,-85.33753967285156 -85.33753967285156,-154.625 0,-154.625z"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                      <g
                        transform="matrix(0.39092573523521423,0,0,0.39092573523521423,275.8289489746094,193.64854431152344)"
                        opacity={1}
                        style={{ display: "block" }}
                      >
                        <g
                          opacity={1}
                          transform="matrix(1.850000023841858,0,0,1.850000023841858,256.7577819824219,403.562255859375)"
                        >
                          <g
                            opacity={1}
                            transform="matrix(0.9982799887657166,0,0,0.9982799887657166,0,0)"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="miter"
                              fillOpacity={0}
                              strokeMiterlimit={4}
                              stroke="rgb(255,175,31)"
                              strokeOpacity={1}
                              strokeWidth={5}
                              d=" M-105.57661437988281,-192.491455078125 C-105.57661437988281,-192.491455078125 -166.46267700195312,-192 -166.46267700195312,-192"
                            ></path>
                          </g>
                          <g opacity={1} transform="matrix(1,0,0,1,-196,91)">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="miter"
                              fillOpacity={0}
                              strokeMiterlimit={4}
                              stroke="rgb(255,175,31)"
                              strokeOpacity={1}
                              strokeWidth={5}
                              d=" M17.609140396118164,-222.0284423828125 C17.609140396118164,-222.0284423828125 -69.01575469970703,-222 -69.01575469970703,-222"
                            ></path>
                          </g>
                        </g>
                        <g
                          opacity={1}
                          transform="matrix(1,0,0,1,255.9600067138672,255.97900390625)"
                        >
                          <path
                            fill="rgb(121,121,121)"
                            fillOpacity={1}
                            d=" M-122.42900085449219,-122.42900085449219 C-54.8129997253418,-190.0449981689453 54.8129997253418,-190.0449981689453 122.42900085449219,-122.42900085449219 C190.0449981689453,-54.8129997253418 190.0449981689453,54.8129997253418 122.42900085449219,122.42900085449219 C54.8129997253418,190.0449981689453 -54.8129997253418,190.0449981689453 -122.42900085449219,122.42900085449219 C-190.0449981689453,54.8129997253418 -190.0449981689453,-54.8129997253418 -122.42900085449219,-122.42900085449219z"
                          ></path>
                        </g>
                        <g
                          opacity={1}
                          transform="matrix(1,0,0,1,256.01300048828125,255.99400329589844)"
                        >
                          <path
                            fill="rgb(241,241,241)"
                            fillOpacity={1}
                            d=" M0,-108.01799774169922 C59.65599822998047,-108.01799774169922 108.01799774169922,-59.65700149536133 108.01799774169922,0 C108.01799774169922,59.65599822998047 59.65599822998047,108.01799774169922 0,108.01799774169922 C-59.65700149536133,108.01799774169922 -108.01799774169922,59.65599822998047 -108.01799774169922,0 C-108.01799774169922,-59.65700149536133 -59.65700149536133,-108.01799774169922 0,-108.01799774169922z"
                          ></path>
                        </g>
                        <g
                          opacity={1}
                          transform="matrix(1,0,0,1,256.01300048828125,255.99400329589844)"
                        >
                          <path
                            fill="rgb(36,115,228)"
                            fillOpacity={1}
                            d=" M0,-13.414999961853027 C7.4079999923706055,-13.414999961853027 13.414999961853027,-7.408999919891357 13.414999961853027,0 C13.414999961853027,7.408999919891357 7.4079999923706055,13.414999961853027 0,13.414999961853027 C-7.408999919891357,13.414999961853027 -13.414999961853027,7.408999919891357 -13.414999961853027,0 C-13.414999961853027,-7.408999919891357 -7.408999919891357,-13.414999961853027 0,-13.414999961853027z"
                          ></path>
                        </g>
                        <g
                          opacity={1}
                          transform="matrix(1,0,0,1,276.46099853515625,257.718994140625)"
                        >
                          <path
                            fill="rgb(241,241,241)"
                            fillOpacity={1}
                            d=" M6.673999786376953,-106.29299926757812 C31.573999404907227,-86.48799896240234 47.56999969482422,-55.939998626708984 47.56999969482422,-21.724000930786133 C47.56999969482422,37.83700180053711 -0.8880000114440918,86.29299926757812 -60.44900131225586,86.29299926757812 C-69.81199645996094,86.29299926757812 -78.9000015258789,85.09500122070312 -87.56999969482422,82.84400177001953 C-69.1240005493164,97.51499938964844 -45.792999267578125,106.29299926757812 -20.447999954223633,106.29299926757812 C39.112998962402344,106.29299926757812 87.56999969482422,57.83599853515625 87.56999969482422,-1.7239999771118164 C87.56999969482422,-51.92300033569336 53.1510009765625,-94.23100280761719 6.673999786376953,-106.29299926757812z"
                          ></path>
                        </g>
                        <g
                          opacity={1}
                          transform="matrix(-0.4773519039154053,0.8787122368812561,-0.8787122368812561,-0.4773519039154053,603.1633911132812,153.23324584960938)"
                        >
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,217.2779998779297,199.51100158691406)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M25.729000091552734,12.772000312805176 C25.729000091552734,12.772000312805176 25.729000091552734,-25.507999420166016 25.729000091552734,-25.507999420166016 C5.059999942779541,-22.242000579833984 -13.08899974822998,-11.321999549865723 -25.729999542236328,4.249000072479248 C-25.729999542236328,4.249000072479248 7.381999969482422,23.367000579833984 7.381999969482422,23.367000579833984 C11.071000099182129,25.496999740600586 15.626999855041504,25.507999420166016 19.298999786376953,23.347999572753906 C19.46500015258789,23.250999450683594 19.631000518798828,23.15399932861328 19.79800033569336,23.05900001525879 C23.486000061035156,20.96299934387207 25.729000091552734,17.013999938964844 25.729000091552734,12.772000312805176z"
                            ></path>
                          </g>
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,294.7460021972656,199.50999450683594)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M-7.381999969482422,23.365999221801758 C-7.381999969482422,23.365999221801758 25.729999542236328,4.25 25.729999542236328,4.25 C13.08899974822998,-11.321000099182129 -5.059999942779541,-22.243000030517578 -25.729000091552734,-25.509000778198242 C-25.729000091552734,-25.509000778198242 -25.729000091552734,12.772000312805176 -25.729000091552734,12.772000312805176 C-25.729000091552734,17.013999938964844 -23.486000061035156,20.964000701904297 -19.79800033569336,23.059999465942383 C-19.631000518798828,23.155000686645508 -19.464000701904297,23.250999450683594 -19.298999786376953,23.349000930786133 C-15.626999855041504,25.509000778198242 -11.069999694824219,25.496000289916992 -7.381999969482422,23.365999221801758z"
                            ></path>
                          </g>
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,195.3000030517578,255.9929962158203)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M22.29800033569336,0.0010000000474974513 C22.29800033569336,0.0010000000474974513 22.29800033569336,-0.0689999982714653 22.29800033569336,-0.0689999982714653 C22.305999755859375,-4.39900016784668 20.101999282836914,-8.430000305175781 16.351999282836914,-10.595000267028809 C16.351999282836914,-10.595000267028809 -16.781999588012695,-29.725000381469727 -16.781999588012695,-29.725000381469727 C-20.336999893188477,-20.48900032043457 -22.305999755859375,-10.472999572753906 -22.305999755859375,0 C-22.305999755859375,10.472999572753906 -20.336999893188477,20.48900032043457 -16.781999588012695,29.725000381469727 C-16.781999588012695,29.725000381469727 16.35099983215332,10.595000267028809 16.35099983215332,10.595000267028809 C20.10099983215332,8.430000305175781 22.30500030517578,4.3979997634887695 22.297000885009766,0.0689999982714653 C22.29800033569336,0.04800000041723251 22.29800033569336,0.023000000044703484 22.29800033569336,0.0010000000474974513z"
                            ></path>
                          </g>
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,316.7229919433594,255.9949951171875)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M16.784000396728516,-29.72599983215332 C16.784000396728516,-29.72599983215332 -16.35099983215332,-10.595999717712402 -16.35099983215332,-10.595999717712402 C-20.10099983215332,-8.430999755859375 -22.30500030517578,-4.400000095367432 -22.29599952697754,-0.07000000029802322 C-22.29599952697754,-0.07000000029802322 -22.29599952697754,0 -22.29599952697754,0 C-22.29599952697754,0 -22.29599952697754,0.07000000029802322 -22.29599952697754,0.07000000029802322 C-22.30500030517578,4.400000095367432 -20.10099983215332,8.430999755859375 -16.35099983215332,10.595999717712402 C-16.35099983215332,10.595999717712402 16.783000946044922,29.72599983215332 16.783000946044922,29.72599983215332 C20.33799934387207,20.489999771118164 22.305999755859375,10.473999977111816 22.305999755859375,0.0010000000474974513 C22.305999755859375,-10.472000122070312 20.339000701904297,-20.489999771118164 16.784000396728516,-29.72599983215332z"
                            ></path>
                          </g>
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,217.2779998779297,312.47698974609375)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M7.381999969482422,-23.365999221801758 C7.381999969482422,-23.365999221801758 -25.729999542236328,-4.249000072479248 -25.729999542236328,-4.249000072479248 C-13.08899974822998,11.321999549865723 5.060999870300293,22.242000579833984 25.729000091552734,25.509000778198242 C25.729000091552734,25.509000778198242 25.729000091552734,-12.772000312805176 25.729000091552734,-12.772000312805176 C25.729000091552734,-17.013999938964844 23.486000061035156,-20.964000701904297 19.79800033569336,-23.05900001525879 C19.631000518798828,-23.15399932861328 19.464000701904297,-23.250999450683594 19.298999786376953,-23.347999572753906 C15.626999855041504,-25.509000778198242 11.071000099182129,-25.496000289916992 7.381999969482422,-23.365999221801758z"
                            ></path>
                          </g>
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,294.7460021972656,312.4779968261719)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M-25.729000091552734,-12.77299976348877 C-25.729000091552734,-12.77299976348877 -25.729000091552734,25.507999420166016 -25.729000091552734,25.507999420166016 C-5.059999942779541,22.242000579833984 13.086999893188477,11.321000099182129 25.729000091552734,-4.249000072479248 C25.729000091552734,-4.249000072479248 -7.382999897003174,-23.365999221801758 -7.382999897003174,-23.365999221801758 C-11.071999549865723,-25.496000289916992 -15.626999855041504,-25.507999420166016 -19.29800033569336,-23.347999572753906 C-19.464000701904297,-23.25200080871582 -19.631000518798828,-23.15399932861328 -19.79800033569336,-23.05900001525879 C-23.48699951171875,-20.964000701904297 -25.729000091552734,-17.014999389648438 -25.729000091552734,-12.77299976348877z"
                            ></path>
                          </g>
                        </g>
                        <g
                          opacity={1}
                          transform="matrix(-0.4773519039154053,0.8787122368812561,-0.8787122368812561,-0.4773519039154053,603.165771484375,153.23382568359375)"
                        >
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,323.2550048828125,275.32501220703125)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M-67.24199676513672,122.65699768066406 C-71.38400268554688,122.65699768066406 -74.74199676513672,119.29900360107422 -74.74199676513672,115.15699768066406 C-74.74199676513672,111.01399993896484 -71.38400268554688,107.65699768066406 -67.24199676513672,107.65699768066406 C-33.323001861572266,107.65699768066406 -1.4329999685287476,94.447998046875 22.551000595092773,70.46399688720703 C46.53499984741211,46.47800064086914 59.742000579833984,14.59000015258789 59.742000579833984,-19.32900047302246 C59.742000579833984,-53.24800109863281 46.53499984741211,-85.13800048828125 22.551000595092773,-109.12200164794922 C19.621999740600586,-112.0510025024414 19.621999740600586,-116.8010025024414 22.551000595092773,-119.72799682617188 C25.479999542236328,-122.65699768066406 30.22800064086914,-122.65699768066406 33.154998779296875,-119.72799682617188 C59.9739990234375,-92.91100311279297 74.74199676513672,-57.255001068115234 74.74199676513672,-19.32900047302246 C74.74199676513672,18.59600067138672 59.9739990234375,54.25299835205078 33.154998779296875,81.07099914550781 C6.339000225067139,107.88700103759766 -29.31599998474121,122.65699768066406 -67.24199676513672,122.65699768066406z"
                            ></path>
                          </g>
                          <g
                            opacity={1}
                            transform="matrix(1,0,0,1,188.76800537109375,236.2989959716797)"
                          >
                            <path
                              fill="rgb(121,121,121)"
                              fillOpacity={1}
                              d=" M-27.85300064086914,122.29100036621094 C-29.77199935913086,122.29100036621094 -31.691999435424805,121.55999755859375 -33.15599822998047,120.09500122070312 C-59.9739990234375,93.2760009765625 -74.74299621582031,57.62099838256836 -74.74299621582031,19.69499969482422 C-74.74299621582031,-18.231000900268555 -59.9739990234375,-53.88800048828125 -33.15599822998047,-80.70500183105469 C-6.339000225067139,-107.52300262451172 29.316999435424805,-122.29100036621094 67.24299621582031,-122.29100036621094 C71.38500213623047,-122.29100036621094 74.74299621582031,-118.93299865722656 74.74299621582031,-114.79100036621094 C74.74299621582031,-110.64900207519531 71.38500213623047,-107.29100036621094 67.24299621582031,-107.29100036621094 C33.32400131225586,-107.29100036621094 1.434000015258789,-94.08300018310547 -22.549999237060547,-70.0979995727539 C-46.53499984741211,-46.11399841308594 -59.74300003051758,-14.222999572753906 -59.74300003051758,19.695999145507812 C-59.74300003051758,53.6150016784668 -46.53499984741211,85.50399780273438 -22.549999237060547,109.48799896240234 C-19.621000289916992,112.41699981689453 -19.621000289916992,117.16600036621094 -22.549999237060547,120.09500122070312 C-24.013999938964844,121.55899810791016 -25.933000564575195,122.29100036621094 -27.85300064086914,122.29100036621094z"
                            ></path>
                          </g>
                        </g>
                        <g
                          opacity="0.5"
                          transform="matrix(-0.5877852439880371,0.80901700258255,-0.80901700258255,-0.5877852439880371,228.24468994140625,284.114990234375)"
                        >
                          <path
                            fill="rgb(121,121,121)"
                            fillOpacity={1}
                            d=" M18.249000549316406,-168.42599487304688 C64.42900085449219,-137.29200744628906 94.86100006103516,-84.50299835205078 94.86100006103516,-24.740999221801758 C94.86100006103516,70.74299621582031 17.17799949645996,148.42599487304688 -78.30599975585938,148.42599487304688 C-98.10099792480469,148.42599487304688 -117.12999725341797,145.08599853515625 -134.86099243164062,138.9429931640625 C-107.25800323486328,157.552001953125 -74.02799987792969,168.42599487304688 -38.305999755859375,168.42599487304688 C57.178001403808594,168.42599487304688 134.86099243164062,90.74299621582031 134.86099243164062,-4.741000175476074 C134.86000061035156,-80.43099975585938 86.0479965209961,-144.93499755859375 18.249000549316406,-168.42599487304688z"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="loading-content">
                <div
                  id="wheelLoadingTitle"
                  className="base__Headline01-sc-1tvbuqk-44 kxACTE"
                >
                  Đang chuyển đến trang thanh toán
                </div>
                <p
                  id="wheelLoadingBody"
                  className="base__Body02-sc-1tvbuqk-23 gymsWw"
                >
                  Việc này không quá 15 giây, bạn đợi chút nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="loadingContainer"
          className="loading__LoadingContainer-sc-1dclnqz-0 dKZTJA"
        >
          <div
            id="loadingWrapper"
            className="loading__LoadingWrapper-sc-1dclnqz-2 ljuRu"
            style={{ visibility: "hidden" }}
          >
            <div className="loading__LoadingStyled-sc-1dclnqz-1 hbnDkB" />
            <div className="loading__LoadingBody-sc-1dclnqz-4 iHapwn">
              <img
                className="imageLoading__Image-sc-19e44f6-0 fiBJvr image-loading"
                src="https://229a2c9fe669f7b.cmccloud.com.vn/icon_horizontal.svg"
                alt="loading"
                width={30}
                height={30}
              />
            </div>
          </div>
          {/* header */}
          <Header setOpenLogin={setOpenLogin} />
          <div className="homepage__BannerWrapper-bs2n93-0 jwkRox">
            <img
              className="homepage__Banner-bs2n93-1 joyfbP banner-img-pc"
              src="https://i.imgur.com/LVM6HVU.png"
              alt="Đặt vé xe limousine của 1000+ hãng xe VIP đi toàn quốc"
            />
            <div className="homepage__BodyBanner-bs2n93-2 eXlcQb">
              <div className="homepage__ContentWrapper-bs2n93-3 dAuOqb">
                <a rel="noreferrer" className="title-container">
                
         
                </a>
                <div className="TransportationWidgetTab__SearchBase-sc-1a4o00m-0 bftUFJ">
                  <div className="TransportationWidgetTab__SearchWrapper-sc-1a4o00m-1 iMFHbv">
                    <div className="ant-tabs ant-tabs-top TransportationWidgetTab__StyledTabs-sc-1a4o00m-2 efZcOi ant-tabs-card ant-tabs-no-animation">
                      <div
                        role="tablist"
                        className="ant-tabs-bar ant-tabs-top-bar ant-tabs-card-bar"
                        tabIndex={0}
                      >
                        <div className="ant-tabs-nav-container">
                          <span className="ant-tabs-tab-prev ant-tabs-tab-btn-disabled">
                            <span className="ant-tabs-tab-prev-icon">
                              <i
                                aria-label="icon: left"
                                className="anticon anticon-left ant-tabs-tab-prev-icon-target"
                              >
                                <svg
                                  viewBox="64 64 896 896"
                                  focusable="false"
                                  className
                                  data-icon="left"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                                </svg>
                              </i>
                            </span>
                          </span>
                          <span className="ant-tabs-tab-next ant-tabs-tab-btn-disabled">
                            <span className="ant-tabs-tab-next-icon">
                              <i
                                aria-label="icon: right"
                                className="anticon anticon-right ant-tabs-tab-next-icon-target"
                              >
                                <svg
                                  viewBox="64 64 896 896"
                                  focusable="false"
                                  className
                                  data-icon="right"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                                </svg>
                              </i>
                            </span>
                          </span>
                          <div className="ant-tabs-nav-wrap">
                            <div className="ant-tabs-nav-scroll">
                              <div className="ant-tabs-nav ant-tabs-nav-animated">
                                <div>
                                  <div
                                    role="tab"
                                    aria-disabled="false"
                                    aria-selected="true"
                                    className="ant-tabs-tab-active ant-tabs-tab"
                                  >
                                    <span className="TransportationWidgetTab__TabLabelContainer-sc-1a4o00m-6 dhuMWw">
                                      <div
                                        style={{
                                          background: "none",
                                          marginLeft: 0,
                                        }}
                                        className="TransportationWidgetTab__IconWrapper-sc-1a4o00m-4 cnqXqt"
                                      >
                                        <svg viewBox="0 0 24 24">
                                          <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"></path>
                                        </svg>
                                      </div>
                                      <Link
                                        to="/bookingCar"
                                        className="TransportationWidgetTab__LabelWrapper-sc-1a4o00m-5 gPyyp"
                                      >
                                        Xe khách
                                      </Link>
                                    </span>
                                  </div>
                          
                                  <div
                                    role="tab"
                                    aria-disabled="false"
                                    aria-selected="false"
                                    className=" ant-tabs-tab"
                                  >
                                    <span className="TransportationWidgetTab__TabLabelContainer-sc-1a4o00m-6 dhuMWw">
                                      <div
                                        style={{
                                          background: "none",
                                          marginLeft: 0,
                                        }}
                                        className="TransportationWidgetTab__IconWrapper-sc-1a4o00m-4 cnqXqt"
                                      >
                                        <svg
                                          width={25}
                                          height={24}
                                          viewBox="0 0 25 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.5 2a4 4 0 0 0-4 4v11a1 1 0 0 0 1 1h1l-2 4h2l.6-1.2h10.8l.6 1.2h2l-2-4h1a1 1 0 0 0 1-1V6a4 4 0 0 0-4-4h-8zm8 16h-8L8 19h9l-.5-1zm-8-14a2 2 0 0 0-2 2v5h5V4h-3zm10 7h-5V4h3a2 2 0 0 1 2 2v5zm-9 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM17 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                                          ></path>
                                        </svg>
                                      </div>
                                      <Link
                                        to="/Convenient"
                                        className="TransportationWidgetTab__LabelWrapper-sc-1a4o00m-5 gPyyp"
                                      >
                                        Xe Tiện Chuyến
                                      </Link>
                                      <span className="TransportationWidgetTab__NewLabel-sc-1a4o00m-11 duhJHP">
                                        Vé Tết
                                      </span>
                                    </span>
                                  </div>
                                  <div
                                    role="tab"
                                    aria-disabled="false"
                                    aria-selected="false"
                                    className=" ant-tabs-tab"
                                  >
                                    <span className="TransportationWidgetTab__TabLabelContainer-sc-1a4o00m-6 dhuMWw">
                                      <div
                                        style={{
                                          background: "none",
                                          marginLeft: 0,
                                        }}
                                        className="TransportationWidgetTab__IconWrapper-sc-1a4o00m-4 cnqXqt"
                                      >
                                        <svg
                                          width={20}
                                          height={20}
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g
                                            clipPath="url(#clip0_30084_225879)"
                                            fill="#474747"
                                          >
                                            <path d="M.51 4.637L4.68.497C5 .18 5.44 0 5.9 0h11.374C18.223 0 19 .763 19 1.714v6c0 .943-.777 1.715-1.727 1.715A2.578 2.578 0 0 1 14.682 12a2.578 2.578 0 0 1-2.591-2.571H6.909A2.578 2.578 0 0 1 4.32 12a2.578 2.578 0 0 1-2.592-2.571C.777 9.429 0 8.657 0 7.714v-1.86c0-.454.181-.891.51-1.217zm16.763-.351V2.57a.863.863 0 0 0-.864-.857h-2.59v3.429h2.59a.863.863 0 0 0 .864-.857zM14.682 10.5c.596 0 1.08-.48 1.08-1.071 0-.592-.484-1.072-1.08-1.072-.596 0-1.08.48-1.08 1.072 0 .591.484 1.071 1.08 1.071zM8.636 5.143h3.455V1.714H8.636v3.429zM4.318 10.5c.596 0 1.08-.48 1.08-1.071 0-.592-.484-1.072-1.08-1.072-.596 0-1.08.48-1.08 1.072 0 .591.484 1.071 1.08 1.071zM6.91 5.143V1.714h-.864L2.591 5.143h4.318zM21.167 18.284c-.128 0-.255.022-.376.036l-1.459-1.464h1.126c.39 0 .709-.321.709-.714v-.271a.707.707 0 0 0-1.027-.636l-1.615.814-1.82-1.835a.689.689 0 0 0-.497-.214h-2.125a.713.713 0 0 0 0 1.428h1.537c.192 0 .369.079.503.207l1.212 1.221h-2.373a.702.702 0 0 0-.32.079l-2.223 1.12a.697.697 0 0 1-.815-.135l-.85-.857a.742.742 0 0 0-.503-.207H7.708a.713.713 0 0 0 0 1.428h2.125c-1.785 0-3.18 1.657-2.755 3.528a2.816 2.816 0 0 0 2.09 2.106 2.839 2.839 0 0 0 3.499-2.778l.998 1.007c.27.272.63.421 1.006.421h.716c.51 0 .977-.27 1.232-.72l2.061-3.635.716.721a2.85 2.85 0 0 0-.978 2.892c.241 1.028 1.07 1.863 2.09 2.1 1.849.42 3.492-.993 3.492-2.786 0-1.578-1.268-2.856-2.833-2.856zM9.833 22.568c-.779 0-1.416-.642-1.416-1.428 0-.785.637-1.428 1.416-1.428.78 0 1.417.643 1.417 1.428 0 .786-.637 1.428-1.417 1.428zm11.334 0c-.78 0-1.417-.642-1.417-1.428 0-.785.637-1.428 1.417-1.428.779 0 1.416.643 1.416 1.428 0 .786-.637 1.428-1.416 1.428z"></path>
                                          </g>
                                        </svg>
                                      </div>
                                      <Link
                                        to="/renter"
                                        className="TransportationWidgetTab__LabelWrapper-sc-1a4o00m-5 gPyyp"
                                      >
                                        Thuê xe du lịch
                                      </Link>
                                      <span className="TransportationWidgetTab__NewLabel-sc-1a4o00m-11 dugVQY">
                                        Mới
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="ant-tabs-ink-bar ant-tabs-ink-bar-animated"
                                  style={{
                                    display: "block",
                                    transform: "translate3d(0px, 0px, 0px)",
                                    width: 148,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        tabIndex={0}
                        style={{
                          width: 0,
                          height: 0,
                          overflow: "hidden",
                          position: "absolute",
                        }}
                        role="presentation"
                      />
                      <div className="ant-tabs-content ant-tabs-content-no-animated ant-tabs-top-content ant-tabs-card-content">
                        <div
                          role="tabpanel"
                          aria-hidden="false"
                          className="ant-tabs-tabpane ant-tabs-tabpane-active TransportationWidgetTab__StyledTabPane-sc-1a4o00m-3 bPgAwO"
                        >
                          <div
                            tabIndex={0}
                            style={{
                              width: 0,
                              height: 0,
                              overflow: "hidden",
                              position: "absolute",
                            }}
                            role="presentation"
                          />
                          <div
                            tabIndex={0}
                            style={{
                              width: 0,
                              height: 0,
                              overflow: "hidden",
                              position: "absolute",
                            }}
                            role="presentation"
                          />
                        </div>
                        <div
                          role="tabpanel"
                          aria-hidden="true"
                          className="ant-tabs-tabpane ant-tabs-tabpane-inactive TransportationWidgetTab__StyledTabPane-sc-1a4o00m-3 bPgAwO"
                        ></div>
                        <div
                          role="tabpanel"
                          aria-hidden="true"
                          className="ant-tabs-tabpane ant-tabs-tabpane-inactive TransportationWidgetTab__StyledTabPane-sc-1a4o00m-3 bPgAwO"
                        ></div>
                        <div
                          role="tabpanel"
                          aria-hidden="true"
                          className="ant-tabs-tabpane ant-tabs-tabpane-inactive TransportationWidgetTab__StyledTabPane-sc-1a4o00m-3 bPgAwO"
                        ></div>
                      </div>
                      <div
                        tabIndex={0}
                        style={{
                          width: 0,
                          height: 0,
                          overflow: "hidden",
                          position: "absolute",
                        }}
                        role="presentation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="homepage__BodyWrapper-bs2n93-4 dIMjCF"></div>
          <Footer />
        </div>
      </div>
      <div>
        <div className="ant-modal-root">
          <div className="ant-modal-mask ant-modal-mask-hidden" />
          <div
            tabIndex={-1}
            className="ant-modal-wrap "
            role="dialog"
            style={{ display: "none" }}
          >
            <div
              role="document"
              className="ant-modal"
              style={{ width: 520, transformOrigin: "821px -213px" }}
            >
              <div
                tabIndex={0}
                aria-hidden="true"
                style={{ width: 0, height: 0, overflow: "hidden" }}
              />
              <div className="ant-modal-content">
                <button aria-label="Close" className="ant-modal-close">
                  <span className="ant-modal-close-x">
                    <i
                      aria-label="icon: close"
                      className="anticon anticon-close ant-modal-close-icon"
                    >
                      <svg
                        viewBox="64 64 896 896"
                        className
                        data-icon="close"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                      </svg>
                    </i>
                  </span>
                </button>
                <div className="ant-modal-body" style={{ padding: 20 }} />
              </div>
              <div
                tabIndex={0}
                aria-hidden="true"
                style={{ width: 0, height: 0, overflow: "hidden" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
