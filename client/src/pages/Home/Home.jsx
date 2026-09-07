import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "../../components/Card/Card.jsx";
import Sort from "../../components/Sort/Sort.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState("");

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

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

        if (!res.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data = await res.json();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );

        setProducts([]);
        setError(
          "We couldn't load the products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    category,
    search,
    sort,
    retryCount,
  ]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

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

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-80 items-center justify-center pb-16">
            <LoadingSpinner text="Loading products..." />
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex min-h-80 items-center justify-center pb-16">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Something went wrong
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : products.length > 0 ? (
          /* Products */
          <div className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {products.map((product) => (
              <Card
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
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