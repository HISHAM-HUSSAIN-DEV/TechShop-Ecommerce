import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import AdminForm from "./components/AdminForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Toast from "../../components/Toast.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const ProductsManagement = () => {
  const { token } = useAuth();

  const formRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] =
    useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productToDelete, setProductToDelete] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/products"
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);

        showToast(
          data.message ||
            "Failed to load products",
          "error"
        );

        return;
      }

      setProducts(data);
    } catch (error) {
      console.error(
        "FETCH PRODUCTS ERROR:",
        error
      );

      showToast(
        "Failed to load products",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setShowForm(true);
    scrollToForm();
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
    scrollToForm();
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (productData) => {
    try {
      setLoading(true);

      const isEditing = !!selectedProduct;

      const url = isEditing
        ? `http://localhost:5000/products/${selectedProduct._id}`
        : "http://localhost:5000/products";

      const method = isEditing
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message ||
            "Failed to save product",
          "error"
        );

        return;
      }

      if (isEditing) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id ===
            data.product._id
              ? data.product
              : product
          )
        );

        showToast(
          "Product updated successfully",
          "success"
        );
      } else {
        setProducts((prev) => [
          ...prev,
          data.product,
        ]);

        showToast(
          "Product added successfully",
          "success"
        );
      }

      setShowForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      showToast(
        "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `http://localhost:5000/products/${productToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message ||
            "Failed to delete product",
          "error"
        );

        return;
      }

      setProducts((prev) =>
        prev.filter(
          (product) =>
            product._id !==
            productToDelete._id
        )
      );

      showToast(
        "Product deleted successfully",
        "success"
      );

      setProductToDelete(null);
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      showToast(
        "Failed to delete product",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <ConfirmModal
        isOpen={!!productToDelete}
        title="Delete Product"
        message={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() =>
          setProductToDelete(null)
        }
        loading={deleting}
      />

      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Products Management
            </h1>

            <p className="mt-1 text-gray-500">
              Add, edit and delete products.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>

        {showForm && (
          <div
            ref={formRef}
            className="mb-6 scroll-mt-6"
          >
            <AdminForm
              initialData={selectedProduct}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4">
                    ID
                  </th>

                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Price
                  </th>

                  <th className="px-6 py-4">
                    Stock
                  </th>

                  <th className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-gray-200"
                  >
                    <td className="px-6 py-4">
                      {product._id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 object-contain"
                        />

                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {product.category}
                    </td>

                    <td className="px-6 py-4">
                      {product.price} SAR
                    </td>

                    <td className="px-6 py-4">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditClick(
                              product
                            )
                          }
                          className="cursor-pointer rounded-lg bg-yellow-100 px-3 py-2 text-yellow-700 hover:bg-yellow-200"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setProductToDelete(
                              product
                            )
                          }
                          className="cursor-pointer rounded-lg bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsManagement;