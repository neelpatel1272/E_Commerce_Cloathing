import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Search, SlidersHorizontal, X } from "lucide-react";

import Layout from "./common/Layout";
import { apiurl } from "./common/Http";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await fetch(`${apiurl}get-categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      console.log("Categories:", result);

      if (result.status && Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Category fetch error:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // =========================================================
  // FETCH BRANDS
  // =========================================================
  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);

      const res = await fetch(`${apiurl}get-brands`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      console.log("Brands:", result);

      if (result.status && Array.isArray(result.data)) {
        setBrands(result.data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Brand fetch error:", error);
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const params = new URLSearchParams();

      // Multiple Categories
      if (selectedCategories.length > 0) {
        params.append("category", selectedCategories.join(","));
      }

      // Multiple Brands
      if (selectedBrands.length > 0) {
        params.append("brand", selectedBrands.join(","));
      }

      const url = `${apiurl}get-products${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      console.log("=================================");
      console.log("PRODUCT API URL:", url);
      console.log("SELECTED CATEGORIES:", selectedCategories);
      console.log("SELECTED BRANDS:", selectedBrands);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("PRODUCT STATUS:", res.status);

      const result = await res.json();

      console.log("PRODUCT API RESPONSE:", result);

      /*
       * VERY IMPORTANT
       *
       * Make sure result.data is actually an array.
       * Otherwise [...products] can crash React.
       */
      if (result && result.status === true && Array.isArray(result.data)) {
        setProducts(result.data);
      } else {
        console.warn("Product data is not an array:", result.data);

        setProducts([]);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // =========================================================
  // FETCH PRODUCTS WHEN CATEGORY / BRAND CHANGES
  // =========================================================
  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedBrands]);

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================
  const handleCategoryChange = (categoryId) => {
    const id = String(categoryId);

    setSelectedCategories((prev) => {
      const exists = prev.some((item) => String(item) === id);

      if (exists) {
        return prev.filter((item) => String(item) !== id);
      }

      return [...prev, id];
    });
  };

  // =========================================================
  // BRAND CHANGE
  // =========================================================
  const handleBrandChange = (brandId) => {
    const id = String(brandId);

    setSelectedBrands((prev) => {
      const exists = prev.some((item) => String(item) === id);

      if (exists) {
        return prev.filter((item) => String(item) !== id);
      }

      return [...prev, id];
    });
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearch("");
    setSort("");
  };

  // =========================================================
  // SEARCH + SORT
  // =========================================================
  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) => {
          if (!product) return false;

          const productTitle = String(product.title || "");

          return productTitle.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => {
          if (sort === "price_low") {
            return Number(a?.price || 0) - Number(b?.price || 0);
          }

          if (sort === "price_high") {
            return Number(b?.price || 0) - Number(a?.price || 0);
          }

          if (sort === "oldest") {
            return (
              new Date(a?.created_at || 0).getTime() -
              new Date(b?.created_at || 0).getTime()
            );
          }

          return (
            new Date(b?.created_at || 0).getTime() -
            new Date(a?.created_at || 0).getTime()
          );
        })
    : [];

  // =========================================================
  // ACTIVE FILTERS
  // =========================================================
  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    search !== "" ||
    sort !== "";

  return (
    <Layout>
      <main className="shop-page">
        <div className="container">
          {/* =================================================
              BREADCRUMB
          ================================================= */}
          <nav aria-label="breadcrumb" className="shop-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item active" aria-current="page">
                Shop
              </li>
            </ol>
          </nav>

          {/* =================================================
              HEADER
          ================================================= */}
          <div className="shop-header">
            <div>
              <span className="shop-header-label">Our Collection</span>

              <h1>Shop Products</h1>

              <p>
                Discover our latest collection of quality products selected just
                for you.
              </p>
            </div>

            <div className="shop-result-count">
              <strong>{filteredProducts.length}</strong>

              <span>Products</span>
            </div>
          </div>

          {/* =================================================
              MOBILE FILTER
          ================================================= */}
          <div className="shop-mobile-filter">
            <button
              type="button"
              className="shop-filter-toggle"
              data-bs-toggle="offcanvas"
              data-bs-target="#shopFilter"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            {hasFilters && (
              <button
                type="button"
                className="shop-clear-mobile"
                onClick={clearFilters}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="row g-4">
            {/* =================================================
                SIDEBAR
            ================================================= */}
            <aside className="col-lg-3">
              <div
                className="shop-filter-sidebar offcanvas-lg offcanvas-start"
                tabIndex="-1"
                id="shopFilter"
              >
                <div className="offcanvas-header shop-filter-mobile-header">
                  <h5>Filters</h5>

                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#shopFilter"
                  />
                </div>

                <div className="shop-filter-inner">
                  {/* Filter Heading */}
                  <div className="shop-filter-heading">
                    <div>
                      <span>Refine</span>
                      <h3>Filters</h3>
                    </div>

                    {hasFilters && (
                      <button type="button" onClick={clearFilters}>
                        Clear
                      </button>
                    )}
                  </div>

                  {/* =================================================
                      CATEGORIES
                  ================================================= */}
                  <div className="shop-filter-group">
                    <div className="shop-filter-title">
                      <h4>Categories</h4>

                      <span>{categories.length}</span>
                    </div>

                    {loadingCategories ? (
                      <div className="shop-filter-loading">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : categories.length > 0 ? (
                      <ul className="shop-filter-list">
                        {categories.map((category) => {
                          const categoryId = String(category.id);

                          const checked = selectedCategories.some(
                            (id) => String(id) === categoryId,
                          );

                          return (
                            <li key={category.id}>
                              <label className="shop-check">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    handleCategoryChange(category.id)
                                  }
                                />

                                <span className="shop-check-box" />

                                <span className="shop-check-name">
                                  {category.name}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="shop-filter-empty">No categories found.</p>
                    )}
                  </div>

                  <div className="shop-filter-group">
                    <div className="shop-filter-title">
                      <h4>Brands</h4>

                      <span>{brands.length}</span>
                    </div>

                    {loadingBrands ? (
                      <div className="shop-filter-loading">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : brands.length > 0 ? (
                      <ul className="shop-filter-list">
                        {brands.map((brand) => {
                          const brandId = String(brand.id);

                          const checked = selectedBrands.some(
                            (id) => String(id) === brandId,
                          );

                          return (
                            <li key={brand.id}>
                              <label className="shop-check">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleBrandChange(brand.id)}
                                />

                                <span className="shop-check-box" />

                                <span className="shop-check-name">
                                  {brand.name}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="shop-filter-empty">No brands found.</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>

           
            <section className="col-lg-9">
              {/* Toolbar */}
              <div className="shop-toolbar">
                <div className="shop-search">
                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {search && (
                    <button type="button" onClick={() => setSearch("")}>
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="shop-sort">
                  <label htmlFor="sort">Sort by:</label>

                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">Newest</option>

                    <option value="price_low">Price: Low to High</option>

                    <option value="price_high">Price: High to Low</option>

                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>

              {hasFilters && (
                <div className="shop-active-filters">
                  <span className="shop-active-label">Active filters:</span>

                  {/* Categories */}
                  {selectedCategories.map((id) => {
                    const category = categories.find(
                      (item) => String(item.id) === String(id),
                    );

                    if (!category) return null;

                    return (
                      <button
                        key={`category-${id}`}
                        type="button"
                        onClick={() => handleCategoryChange(id)}
                      >
                        {category.name}
                        <X size={13} />
                      </button>
                    );
                  })}

                  {selectedBrands.map((id) => {
                    const brand = brands.find(
                      (item) => String(item.id) === String(id),
                    );

                    if (!brand) return null;

                    return (
                      <button
                        key={`brand-${id}`}
                        type="button"
                        onClick={() => handleBrandChange(id)}
                      >
                        {brand.name}
                        <X size={13} />
                      </button>
                    );
                  })}

                  {/* Search */}
                  {search && (
                    <button type="button" onClick={() => setSearch("")}>
                      Search: {search}
                      <X size={13} />
                    </button>
                  )}

                  {/* Sort */}
                  {sort && (
                    <button type="button" onClick={() => setSort("")}>
                      {sort === "price_low"
                        ? "Price: Low to High"
                        : sort === "price_high"
                          ? "Price: High to Low"
                          : "Oldest"}

                      <X size={13} />
                    </button>
                  )}
                </div>
              )}

              {/* =================================================
                  LOADING
              ================================================= */}
              {loadingProducts ? (
                <div className="row g-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div className="col-6 col-md-4" key={item}>
                      <div className="product-card-skeleton">
                        <div className="product-skeleton-image" />
                        <div className="product-skeleton-line" />
                        <div className="product-skeleton-small" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                /* =================================================
                   PRODUCT GRID
                ================================================= */
                <div className="row g-4">
                  {filteredProducts.map((product) => {
                    const productTitle = product?.title || "Product";

                    const categoryName =
                      product?.category?.name ||
                      product?.category_name ||
                      "Product";

                    return (
                      <div className="col-6 col-md-4" key={product.id}>
                        <article className="product-card">
                          {/* Image */}
                          <div className="product-card-image">
                            {product?.is_featured === "yes" && (
                              <span className="product-badge featured">
                                Featured
                              </span>
                            )}

                            <button
                              type="button"
                              className="product-wishlist"
                              aria-label="Add to wishlist"
                            >
                              <Heart size={17} />
                            </button>

                            {product?.image_url ? (
                              <img
                                src={product.image_url}
                                alt={productTitle}
                                loading="lazy"
                              />
                            ) : (
                              <div className="product-image-placeholder">
                                No Image
                              </div>
                            )}

                            <Link
                              to={`/product/${product.id}`}
                              className="product-view-button"
                              aria-label={`View ${productTitle}`}
                            >
                              <Eye size={17} />
                            </Link>
                          </div>

                          {/* Content */}
                          <div className="product-card-content">
                            <span className="product-category">
                              {categoryName}
                            </span>

                            <h3>
                              <Link to={`/product/${product.id}`}>
                                {productTitle}
                              </Link>
                            </h3>

                            <div className="product-price">
                              <span className="product-current-price">
                                ₹
                                {Number(product?.price || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </span>

                              {product?.compare_price && (
                                <span className="product-old-price">
                                  ₹
                                  {Number(product.compare_price).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* =================================================
                   EMPTY
                ================================================= */
                <div className="products-empty shop-empty">
                  <div className="shop-empty-icon">
                    <Search size={26} />
                  </div>

                  <h4>No products found</h4>

                  <p>
                    We couldn't find any products matching your selected
                    filters.
                  </p>

                  {hasFilters && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Shop;
