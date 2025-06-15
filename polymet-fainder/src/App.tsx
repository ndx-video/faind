import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/polymet/layouts/main-layout";
import HomePage from "@/polymet/pages/home-page";

export default function FAInderPrototype() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p>Settings page is under construction.</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/help"
          element={
            <MainLayout>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Help</h1>
                <p>Help page is under construction.</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/terms"
          element={
            <MainLayout>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <p>Terms page is under construction.</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/privacy"
          element={
            <MainLayout>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <p>Privacy page is under construction.</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Contact Us</h1>
                <p>Contact page is under construction.</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="*"
          element={
            <MainLayout>
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4">
                  404 - Page Not Found
                </h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
