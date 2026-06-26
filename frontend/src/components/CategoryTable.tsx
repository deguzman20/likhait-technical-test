import React, { CSSProperties, useCallback, useMemo, useState } from "react";
import { COLORS } from "../constants/colors";
import { deleteCategory, updateCategory } from "../services/api";
import { Button, Modal, Pagination } from "../vibes";
import { CategoryForm } from "./CategoryForm";

interface Category {
  id: number;
  name: string;
}

interface CategoryTableProps {
  categories: Category[];
  onCategoryUpdated: () => void;
}

const ITEMS_PER_PAGE = 10;

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: COLORS.background.main,
  borderRadius: "0.5rem",
  overflow: "hidden",
  border: `1px solid ${COLORS.border}`,
};

const theadStyle: CSSProperties = {
  backgroundColor: COLORS.background.card,
};

const thStyle: CSSProperties = {
  padding: "0.75rem",
  textAlign: "left",
  fontWeight: 600,
  color: COLORS.text.primary,
  borderBottom: `2px solid ${COLORS.border}`,
};

const centeredThStyle: CSSProperties = {
  ...thStyle,
  textAlign: "center",
};

const tdStyle: CSSProperties = {
  padding: "0.75rem",
  borderBottom: `1px solid ${COLORS.border}`,
  color: COLORS.text.primary,
};

const actionTdStyle: CSSProperties = {
  ...tdStyle,
  textAlign: "center",
  justifyItems: "end",
};

const emptyStyle: CSSProperties = {
  padding: "2rem",
  textAlign: "center",
  color: COLORS.text.secondary,
};

const actionButtonsStyle: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
};

const deleteModalStyle: CSSProperties = {
  padding: "1rem 0",
};

const deleteActionsStyle: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "flex-end",
};

export function CategoryTable({
  categories,
  onCategoryUpdated,
}: CategoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { totalPages, currentCategories } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return {
      totalPages: Math.ceil(categories.length / ITEMS_PER_PAGE),
      currentCategories: categories.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      ),
    };
  }, [categories, currentPage]);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  }, []);

  const handleUpdate = useCallback(
    async (name: string) => {
      if (!editingCategory) {
        return;
      }

      try {
        await updateCategory(editingCategory.id, name);
        closeEditModal();
        onCategoryUpdated();
      } catch (error) {
        console.error("Failed to update category:", error);
        throw error;
      }
    },
    [editingCategory, closeEditModal, onCategoryUpdated]
  );

  const confirmDelete = useCallback(async () => {
    if (!deletingCategory) {
      return;
    }

    try {
      await deleteCategory(deletingCategory.id);
      closeDeleteModal();
      onCategoryUpdated();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  }, [deletingCategory, closeDeleteModal, onCategoryUpdated]);

  if (categories.length === 0) {
    return (
      <div style={tableStyle}>
        <div style={emptyStyle}>
          No categories found. Add your first category to get started!
        </div>
      </div>
    );
  }

  return (
    <>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={centeredThStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentCategories.map((category) => (
            <tr key={category.id}>
              <td style={tdStyle}>{category.name}</td>

              <td style={actionTdStyle}>
                <div style={actionButtonsStyle}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            initialName={editingCategory.name}
            onSubmit={handleUpdate}
            onCancel={closeEditModal}
            submitLabel="Update Category"
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Category"
      >
        <div style={deleteModalStyle}>
          <p style={{ marginBottom: "1.5rem", color: COLORS.text.primary }}>
            Are you sure you want to delete this category?
          </p>

          {deletingCategory && (
            <p style={{ marginBottom: "1.5rem", color: COLORS.text.secondary }}>
              <strong>{deletingCategory.name}</strong>
            </p>
          )}

          <div style={deleteActionsStyle}>
            <Button variant="secondary" onClick={closeDeleteModal}>
              Cancel
            </Button>

            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
