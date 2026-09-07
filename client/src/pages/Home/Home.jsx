import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "../../components/Card/Card.jsx";
import Sort from "../../components/Sort/Sort.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState("");

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();

        if (category) {
          params.set("category", category);
        }

        if (sort) {
          params.set("sort", sort);
        }

        if (search) {
          params.set("search", search);
        }

        const res = await fetch(
          `${API_URL}/products?${params.toString()}`
        );

        const data = await res.json();

        if (!res.ok) {
          setProducts([]);
          return;
        }

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH PRODUCTS ERROR:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [category, search, sort]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full max-w-700 px-4 sm:px-6 lg:px-8">
        {/* Products Toolbar */}
        <div className="flex items-center justify-end py-5">
          <Sort
            sortValue={sort}
            onSortChange={setSort}
          />
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {products.map((product) => (
              <Card
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-80 items-center justify-center pb-16">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or category.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;