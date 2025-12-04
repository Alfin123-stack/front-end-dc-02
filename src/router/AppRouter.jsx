import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import StartPage from "../pages/StartPage";
import QuizPage from "../pages/QuizPage";
import CompletionPage from "../pages/CompletionPage";
import ReviewPage from "../pages/ReviewPage";
import SettingsPage from "../pages/SettingsPage";
import Layout from "../components/Layout";

import HistoryScreen from "../components/screens/HistoryScreen";
import HistoryDetailScreen from "../components/screens/HistoryDetailScreen";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}>
        {/* WRAP ALL ROUTES WITH LAYOUT */}
        <Layout>
          <Routes location={location}>
            <Route path="/" element={<StartPage />} />
            <Route path="/quiz/:level" element={<QuizPage />} />
            <Route path="/completion/:level" element={<CompletionPage />} />
            <Route path="/review/:level" element={<ReviewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
<<<<<<< HEAD
=======
            {/* History List */}
            <Route path="/history" element={<HistoryScreen />} />

            {/* History Detail */}
            <Route path="/history/:id" element={<HistoryDetailScreen />} />
>>>>>>> 66c974b (adding history screen)
            <Route path="*" element={<StartPage />} />
          </Routes>
        </Layout>
      </motion.div>
    </AnimatePresence>
  );
}
