"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  UploadCloud,
} from "lucide-react";
import { ApplicationDocument, DocumentStatus } from "@/types/checklist"; // Используйте типы из предыдущего ответа

interface DocumentItemProps {
  document: ApplicationDocument;
  onStatusChange: (id: string, status: DocumentStatus) => void;
}

const statusConfig = {
  TODO: {
    icon: Circle,
    color: "text-gray-400",
    border: "border-gray-200",
    bg: "bg-white",
    label: "К выполнению",
  },
  IN_PROGRESS: {
    icon: Clock,
    color: "text-amber-500",
    border: "border-amber-200",
    bg: "bg-amber-50/50",
    label: "В процессе",
  },
  DONE: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    border: "border-emerald-200",
    bg: "bg-emerald-50/50",
    label: "Готово",
  },
};

// Анимация для элемента списка
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  onStatusChange,
}) => {
  const currentStatus = statusConfig[document.status];
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      variants={itemVariants}
      layout // Автоматически анимирует изменение высоты/позиции
      className={`relative overflow-hidden p-5 mb-4 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${currentStatus.border} ${currentStatus.bg}`}
    >
      {/* Декоративная линия слева для "Готово" */}
      {document.status === "DONE" && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          className="absolute left-0 top-0 w-1.5 bg-emerald-500"
        />
      )}

      <div className="flex items-start gap-4 flex-1">
        <div
          className={`p-3 rounded-xl bg-white shadow-sm border ${currentStatus.border}`}
        >
          <StatusIcon className={`w-6 h-6 ${currentStatus.color}`} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg flex items-center gap-3">
            {document.title}
            {document.isRequired && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md text-rose-600 bg-rose-100">
                Обязательно
              </span>
            )}
          </h4>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-xl">
            {document.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <button className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <UploadCloud className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span>Файл</span>
        </button>

        <div className="relative">
          <select
            value={document.status}
            onChange={(e) =>
              onStatusChange(document.id, e.target.value as DocumentStatus)
            }
            className={`pl-4 pr-10 py-2.5 text-sm font-semibold rounded-xl border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm
              ${document.status === "DONE" ? "bg-emerald-500 text-white border-emerald-600" : "bg-white text-gray-700 border-gray-200"}
            `}
          >
            <option value="TODO">В планы</option>
            <option value="IN_PROGRESS">В процессе</option>
            <option value="DONE">Выполнено</option>
          </select>
          {/* Кастомная стрелочка для селекта */}
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${document.status === "DONE" ? "text-white" : "text-gray-400"}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
