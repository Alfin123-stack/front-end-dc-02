import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import HistoryHeader from "./history/HistoryHeader";
import HistoryItemCard from "./history/HistoryItemCard";
import HistoryDeleteModal from "./history/HistoryDeleteModal";
import HistoryPagination from "./history/HistoryPagination";

import EmptyState from "../ui/EmptyState";
import useHistoryScreen from "../../hooks/useHistoryScreen";
import HistoryLoading from "./history/HistoryLoading";

export default function HistoryScreen() {
  const navigate = useNavigate();
  const location = useLocation();

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
  } = useHistoryScreen(tutorialId, userId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d111a] px-4 py-6 sm:py-10 text-gray-900 dark:text-gray-200">
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <HistoryHeader
          navigate={navigate}
          filteredLength={filteredHistory.length}
          setShowConfirm={setShowConfirm}
        />

        {/* Loading */}
        {loading && (
          <div className="mt-6">
            <HistoryLoading message="Memuat riwayat kuis..." />
          </div>
        )}

        {/* Empty */}
        {!loading && filteredHistory.length === 0 && (
          <div className="mt-8">
            <EmptyState message="Belum ada riwayat untuk tutorial ini." />
          </div>
        )}

        {/* List */}
        {!loading && filteredHistory.length > 0 && (
          <>
            <div className="mt-6 space-y-4 sm:space-y-5">
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

      {/* Modal */}
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
