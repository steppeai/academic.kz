import { useState, useMemo, useCallback } from "react";
import { ApplicationDocument, DocumentStatus } from "@/types/checklist";

export const useDocumentChecklist = (
  initialDocuments: ApplicationDocument[],
) => {
  const [documents, setDocuments] =
    useState<ApplicationDocument[]>(initialDocuments);

  // Мемоизируем расчет прогресса для оптимизации рендеринга
  const progress = useMemo(() => {
    const requiredDocs = documents.filter((doc) => doc.isRequired);
    if (requiredDocs.length === 0) return 100;

    const completedDocs = requiredDocs.filter((doc) => doc.status === "DONE");
    return Math.round((completedDocs.length / requiredDocs.length) * 100);
  }, [documents]);

  // Функция обновления статуса (в будущем здесь будет API вызов)
  const updateDocumentStatus = useCallback(
    (id: string, newStatus: DocumentStatus) => {
      // В реальном проекте здесь будет try/catch с вызовом API
      // await api.updateDocumentStatus(id, newStatus);

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === id
            ? { ...doc, status: newStatus, updatedAt: new Date().toISOString() }
            : doc,
        ),
      );
    },
    [],
  );

  return {
    documents,
    progress,
    updateDocumentStatus,
  };
};
