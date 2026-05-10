import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/Home";
import { UploadPage } from "@/pages/Upload";
import { CheckPage } from "@/pages/Check";
import { ReportPage } from "@/pages/Report";
import { TemplatesPage } from "@/pages/Templates";
import { ProfilePage } from "@/pages/Profile";
import { HelpPage } from "@/pages/Help";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </Router>
  );
}
