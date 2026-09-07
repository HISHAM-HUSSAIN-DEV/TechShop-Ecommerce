import React, { useEffect, useState } from "react";

const AdminForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    stock: "",
    category: "",
  });

  // إذا ضغطنا Edit، نحط بيانات المنتج داخل الفورم
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        image: initialData.image || "",
        price: initialData.price || "",
        stock: initialData.stock || "",
        category: initialData.category || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        price: "",
        stock: "",
        category: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    onSubmit(productData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Product Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Phones">Phones</option>
            <option value="Laptops">Laptops</option>
            <option value="Tablets">Tablets</option>
            <option value="Smart Watches">Smart Watches</option>
            <option value="Headphones">Headphones</option>
            <option value="Gaming">Gaming</option>
            <option value="VR">VR</option>
            <option value="Cameras">Cameras</option>
            <option value="Accessories">Accessories</option>
            <option value="Networking">Networking</option>
            <option value="Speakers">Speakers</option>
            <option value="Monitors">Monitors</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Product price"
            min="0"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Product stock"
            min="0"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Image */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Image Path
          </label>

          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="/ProductImages/product.png"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description..."
            rows="4"
            required
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;