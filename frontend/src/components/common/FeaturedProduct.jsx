import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { apiurl } from "./Http";

const FeaturedProduct = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(`${apiurl}get-featured-products`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch featured products");
      }

      const result = await res.json();

      console.log("Featured Products:", result);

      setFeaturedProducts(result.data || []);
    } catch (error) {
      console.error("Featured products error:", error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="products-section py-5">
      <div className="container">

        {/* HEADER */}
        <div className="products-section-header">

          <div>
            <span className="products-section-label">
              OUR BEST PICKS
            </span>

            <h2>
              Featured <span>Products</span>
            </h2>

            <p>
              Explore our hand-picked products selected for
              quality, style and everyday use.
            </p>
          </div>

          <a
            href="/products"
            className="products-view-all"
          >
            View All Products
            <ArrowUpRight size={18} />
          </a>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="row g-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                className="col-lg-3 col-md-6 col-6"
                key={item}
              >
                <div className="product-card-skeleton">
                  <div className="product-skeleton-image"></div>
                  <div className="product-skeleton-line"></div>
                  <div className="product-skeleton-small"></div>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* EMPTY */}
        {!loading && featuredProducts.length === 0 && (
          <div className="products-empty">
            <h4>No featured products found</h4>

            <p>
              Featured products will appear here.
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && featuredProducts.length > 0 && (
          <div className="row g-4">

            {featuredProducts.map((product) => {

              const image = product.image_url;

              return (
                <div
                  className="col-lg-3 col-md-6 col-6"
                  key={product.id}
                >

                  <div className="product-card">

                    {/* IMAGE */}
                    <div className="product-card-image">

                      {image ? (
                        <img
                          src={image}
                          alt={product.title || "Product"}
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <img
                          src="/images/placeholder.jpg"
                          alt="Product"
                        />
                      )}

                      <span className="product-badge featured">
                        FEATURED
                      </span>

                      <a
                        href={`/product/${product.id}`}
                        className="product-view-button"
                      >
                        <ArrowUpRight size={19} />
                      </a>

                    </div>

                    {/* CONTENT */}
                    <div className="product-card-content">

                      <span className="product-category">
                        {product.category?.name || "Product"}
                      </span>

                      <h3>
                        <a
                          href={`/product/${product.id}`}
                        >
                          {product.title || product.name}
                        </a>
                      </h3>

                      <div className="product-price">

                        <span className="product-current-price">
                          ₹{product.price}
                        </span>

                        {product.compare_price &&
                          Number(product.compare_price) >
                            Number(product.price) && (
                            <span className="product-old-price">
                              ₹{product.compare_price}
                            </span>
                          )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProduct;