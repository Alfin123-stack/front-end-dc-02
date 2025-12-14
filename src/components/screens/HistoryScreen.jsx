import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import HistoryHeader from "./history/HistoryHeader";
import HistoryItemCard from "./history/HistoryItemCard";
import HistoryDeleteModal from "./history/HistoryDeleteModal";
import HistoryPagination from "./history/HistoryPagination";

import EmptyState from "../ui/EmptyState";
import useHistoryScreen from "../../hooks/useHistoryScreen";
import LoadingState from "../ui/LoadingState";

export default function HistoryScreen() {
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const tutorialId = Number(query.get("tutorial") || 1);
  const userId = Number(query.get("user") || 1);

  const {
    loading,
    showConfirm,
    setShowConfirm,
    filteredHistory,
    paginatedHistory,
    totalPages,
    page,
    nextPage,
    prevPage,
    handleDeleteAll,
  } = useHistoryScreen(tutorialId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d111a] py-10 px-4 text-gray-900 dark:text-gray-200">
      <div className="max-w-xl mx-auto">
        <HistoryHeader
          navigate={navigate}
          filteredLength={filteredHistory.length}
          setShowConfirm={setShowConfirm}
        />

        {/* ===============================
            LOADING STATE
        =============================== */}
        {loading && (
          <div className="mt-6">
            <LoadingState message="Memuat riwayat quiz..." />
          </div>
        )}

        {/* ===============================
            EMPTY STATE
        =============================== */}
        {!loading && filteredHistory.length === 0 && (
          <EmptyState message="Belum ada riwayat untuk tutorial ini." />
        )}

        {/* ===============================
            HISTORY LIST
        =============================== */}
        {!loading && filteredHistory.length > 0 && (
          <>
            <div className="space-y-5 mt-6">
              {paginatedHistory.map((item, i) => (
                <HistoryItemCard
                  key={item.id}
                  item={item}
                  index={i}
                  tutorialId={tutorialId}
                  userId={userId}
                  navigate={navigate}
                />
              ))}
            </div>

            {filteredHistory.length > 3 && (
              <HistoryPagination
                page={page}
                totalPages={totalPages}
                prevPage={prevPage}
                nextPage={nextPage}
              />
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <HistoryDeleteModal
            handleDeleteAll={handleDeleteAll}
            setShowConfirm={setShowConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
