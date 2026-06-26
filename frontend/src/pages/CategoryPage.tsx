import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryTable } from "../components/CategoryTable";
import { createCategory, fetchCategories } from "../services/api";
import { Button, Modal } from "../vibes";

interface Category {
  id: number;
  name: string;
}

const pageStyle: CSSProperties = {
  padding: "48px 64px",
  minHeight: "100vh",
  background: COLORS.secondary.s01,
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "32px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "40px",
  fontWeight: 700,
  color: COLORS.secondary.s10,
};

const loadingStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "48px",
  fontSize: "18px",
  color: COLORS.secondary.s08,
};

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const fetchCategoriesData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const handleAddCategory = useCallback(
    async (name: string) => {
      try {
        await createCategory(name);
        closeModal();
        await fetchCategoriesData();
      } catch (error) {
        console.error("Error creating category:", error);
        throw error;
      }
    },
    [closeModal, fetchCategoriesData]
  );

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Categories</h1>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <div style={loadingStyle}>Loading...</div>
      ) : (
        <CategoryTable
          categories={categories}
          onCategoryUpdated={fetchCategoriesData}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Category">
        <CategoryForm onSubmit={handleAddCategory} onCancel={closeModal} />
      </Modal>
    </div>
  );
};

export default CategoryPage;
