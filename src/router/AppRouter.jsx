import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import StartPage from "../pages/StartPage";
import QuizPage from "../pages/QuizPage";
import CompletionPage from "../pages/CompletionPage";
import ReviewPage from "../pages/ReviewPage";

import Layout from "../components/Layout";

import HistoryPage from "../pages/HistoryPage";
import HistoryDetailPage from "../pages/HistoryDetailPage";

import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";

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
        <Layout>
          <Routes location={location}>
            {/* Normal Pages */}
            <Route
              path="/"
              element={<StartPage />}
              errorElement={<ErrorPage />}
            />

            <Route
              path="/quiz/:level"
              element={<QuizPage />}
              errorElement={<ErrorPage />}
            />

            <Route
              path="/completion/:level"
              element={<CompletionPage />}
              errorElement={<ErrorPage />}
            />

            <Route
              path="/review/:level"
              element={<ReviewPage />}
              errorElement={<ErrorPage />}
            />

            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<HistoryDetailPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </motion.div>
    </AnimatePresence>
  );
}
