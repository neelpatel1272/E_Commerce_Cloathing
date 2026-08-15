import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Heart, Eye, Search, SlidersHorizontal, X } from "lucide-react";

import Layout from "./common/Layout";
import { apiurl } from "./common/Http";
import Breadcrumb from "./common/Breadcrumb";

const Collection = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingSizes, setLoadingSizes] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${apiurl}get-brands`, {
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Brand Error:", error);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await fetch(`${apiurl}sizes`, {
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        setSizes(result.data);
      }
    } catch (error) {
      console.error("Size Error:", error);
    } finally {
      setLoadingSizes(false);
    }
  };

  const fetchCollection = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (selectedBrands.length > 0) {
        params.append("brand", selectedBrands.join(","));
      }

      if (selectedSizes.length > 0) {
        params.append("size", selectedSizes.join(","));
      }

      if (minPrice !== "") {
        params.append("min_price", minPrice);
      }

      if (maxPrice !== "") {
        params.append("max_price", maxPrice);
      }

      const url =
        `${apiurl}collections/${slug}` +
        (params.toString() ? `?${params.toString()}` : "");

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (result.status) {
        setCollection(result.collection);
        setProducts(Array.isArray(result.data) ? result.data : []);
      } else {
        setCollection(null);
        setProducts([]);
      }
    } catch (error) {
      console.error("Collection Error:", error);
      setCollection(null);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchSizes();
  }, []);

  useEffect(() => {
    setSelectedBrands(
      searchParams.get("brand") ? searchParams.get("brand").split(",") : [],
    );

    setSelectedSizes(
      searchParams.get("size") ? searchParams.get("size").split(",") : [],
    );

    setMinPrice(searchParams.get("min_price") || "");

    setMaxPrice(searchParams.get("max_price") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchCollection();
  }, [slug, selectedBrands, selectedSizes, minPrice, maxPrice]);

  const updateFilters = (brandsValue, sizesValue, minValue, maxValue) => {
    const params = {};

    if (brandsValue.length > 0) {
      params.brand = brandsValue.join(",");
    }

    if (sizesValue.length > 0) {
      params.size = sizesValue.join(",");
    }

    if (minValue !== "") {
      params.min_price = minValue;
    }

    if (maxValue !== "") {
      params.max_price = maxValue;
    }

    setSearchParams(params);
  };

  const handleBrandChange = (id) => {
    const value = String(id);

    const newBrands = selectedBrands.includes(value)
      ? selectedBrands.filter((item) => item !== value)
      : [...selectedBrands, value];

    updateFilters(newBrands, selectedSizes, minPrice, maxPrice);
  };

  const handleSizeChange = (id) => {
    const value = String(id);

    const newSizes = selectedSizes.includes(value)
      ? selectedSizes.filter((item) => item !== value)
      : [...selectedSizes, value];

    updateFilters(selectedBrands, newSizes, minPrice, maxPrice);
  };

  const applyPrice = () => {
    updateFilters(selectedBrands, selectedSizes, minPrice, maxPrice);
  };

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setSearchParams({});
  };

  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) => {
          const title = String(product?.title || "").toLowerCase();

          return title.includes(search.toLowerCase());
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

  const hasFilters =
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    search !== "" ||
    sort !== "";

  return (
    <Layout>
            <Breadcrumb
        title={collection?.name || slug}
        parent="Home"
        parentLink="/"
    />

      <main className="shop-page">
        <div className="container">
          <div className="shop-mobile-filter">
            <button
              type="button"
              className="shop-filter-toggle"
              data-bs-toggle="offcanvas"
              data-bs-target="#collectionFilter"
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
            <aside className="col-lg-3">
              <div
                className="shop-filter-sidebar offcanvas-lg offcanvas-start"
                tabIndex="-1"
                id="collectionFilter"
              >
                <div className="offcanvas-header shop-filter-mobile-header">
                  <h5>Filters</h5>

                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                  />
                </div>

                <div className="shop-filter-inner">
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

                  <div className="shop-filter-group">
                    <div className="shop-filter-title">
                      <h4>Price</h4>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                      </div>

                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-dark w-100"
                          onClick={applyPrice}
                        >
                          Apply Price
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="shop-filter-group">
                    <div className="shop-filter-title">
                      <h4>Size</h4>

                      <span>{sizes.length}</span>
                    </div>

                    {loadingSizes ? (
                      <div className="shop-filter-loading">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      <ul className="shop-filter-list">
                        {sizes.map((size) => (
                          <li key={size.id}>
                            <label className="shop-check">
                              <input
                                type="checkbox"
                                checked={selectedSizes.includes(
                                  String(size.id),
                                )}
                                onChange={() => handleSizeChange(size.id)}
                              />

                              <span className="shop-check-box" />

                              <span className="shop-check-name">
                                {size.name}
                              </span>
                            </label>
                          </li>
                        ))}
                      </ul>
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
                    ) : (
                      <ul className="shop-filter-list">
                        {brands.map((brand) => (
                          <li key={brand.id}>
                            <label className="shop-check">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(
                                  String(brand.id),
                                )}
                                onChange={() => handleBrandChange(brand.id)}
                              />

                              <span className="shop-check-box" />

                              <span className="shop-check-name">
                                {brand.name}
                              </span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <section className="col-lg-9">
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

                  {selectedSizes.map((id) => {
                    const size = sizes.find(
                      (item) => String(item.id) === String(id),
                    );

                    if (!size) return null;

                    return (
                      <button
                        key={`size-${id}`}
                        type="button"
                        onClick={() => handleSizeChange(id)}
                      >
                        {size.name}
                        <X size={13} />
                      </button>
                    );
                  })}

                  {minPrice && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice("");
                        updateFilters(
                          selectedBrands,
                          selectedSizes,
                          "",
                          maxPrice,
                        );
                      }}
                    >
                      Min ₹{minPrice}
                      <X size={13} />
                    </button>
                  )}

                  {maxPrice && (
                    <button
                      type="button"
                      onClick={() => {
                        setMaxPrice("");
                        updateFilters(
                          selectedBrands,
                          selectedSizes,
                          minPrice,
                          "",
                        );
                      }}
                    >
                      Max ₹{maxPrice}
                      <X size={13} />
                    </button>
                  )}

                  {search && (
                    <button type="button" onClick={() => setSearch("")}>
                      Search: {search}
                      <X size={13} />
                    </button>
                  )}

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

              {loading ? (
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
                <div className="row g-4">
                  {filteredProducts.map((product) => {
                    const productTitle = product?.title || "Product";

                    const categoryName =
                      product?.category?.name || collection?.name || "Product";

                    return (
                      <div className="col-6 col-md-4" key={product.id}>
                        <article className="product-card">
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
                            >
                              <Eye size={17} />
                            </Link>
                          </div>

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

export default Collection;
