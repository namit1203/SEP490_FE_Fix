import { useState } from "react";
import LoginModal from "../components/auth/LoginModal";
import Banner from "../components/home/Banner";
import Features from "../components/home/Features";
import Footer from "./Footer";
import Header from "./Header";

const Home = () => {
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header setOpenLogin={setOpenLogin} />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Banner Section */}
          <Banner />

          {/* Features Section */}
          <Features />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;