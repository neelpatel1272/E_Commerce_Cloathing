import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
} from "lucide-react";

import Layout from "./common/Layout";
import { apiurl } from "./common/Http";

const Product = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);

      const res = await fetch(`${apiurl}get-product/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      console.log("PRODUCT API RESPONSE:", result);

      if (result?.status === true && result?.data) {
        const productData = result.data;

        setProduct(productData);
        setSelectedSize(null);
        setQuantity(1);

        if (productData.image_url) {
          setActiveImage(productData.image_url);
        } else if (
          Array.isArray(productData.images) &&
          productData.images.length > 0
        ) {
          setActiveImage(
            productData.images[0].image_url ||
              productData.images[0].url ||
              null,
          );
        } else {
          setActiveImage(null);
        }
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      setProduct(null);
    } finally {
      setLoadingProduct(false);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    try {
      setLoadingRelated(true);

      const params = new URLSearchParams();

      if (categoryId) {
        params.append("category", categoryId);
      }

      const res = await fetch(
        `${apiurl}get-products${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = await res.json();

      if (result?.status === true && Array.isArray(result.data)) {
        setRelatedProducts(
          result.data
            .filter((item) => String(item.id) !== String(id))
            .slice(0, 4),
        );
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error("Related products fetch error:", error);
      setRelatedProducts([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const categoryId = product?.category?.id || product?.category_id;

    if (categoryId) {
      fetchRelatedProducts(categoryId);
    }
  }, [product]);

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQty = () => {
    const stock = Number(product?.qty ?? product?.stock ?? 0);

    if (stock > 0) {
      setQuantity((prev) => Math.min(stock, prev + 1));
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  if (loadingProduct) {
    return (
      <Layout>
        <main className="pdp-page">
          <div className="container">
            <div className="pdp-layout">
              <div className="pdp-gallery">
                <div className="pdp-main-image pdp-skeleton" />

                <div className="pdp-thumbs">
                  {[1, 2, 3, 4].map((item) => (
                    <div className="pdp-thumb pdp-skeleton" key={item} />
                  ))}
                </div>
              </div>

              <div className="pdp-info">
                <div className="pdp-skeleton-line" />
                <div className="pdp-skeleton-line short" />
                <div className="pdp-skeleton-line price" />
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <main className="pdp-page">
          <div className="container">
            <div className="products-empty pdp-not-found">
              <h4>Product not found</h4>

              <p>
                The product you're looking for doesn't exist or was removed.
              </p>

              <Link to="/shop" className="btn btn-primary">
                Back to Shop
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  const galleryImages = Array.isArray(product.images)
    ? product.images
        .map((img) => ({
          id: img?.id,
          url: img?.image_url || img?.url || null,
        }))
        .filter((img) => img.url)
    : [];

  if (galleryImages.length === 0 && product.image_url) {
    galleryImages.push({
      id: "main",
      url: product.image_url,
    });
  }

  const categoryName =
    product?.category?.name || product?.category_name || "Product";

  const brandName = product?.brand?.name || product?.brand_name || "—";

  const availableQty = Number(product?.qty ?? product?.stock ?? 0);

  const inStock =
    product?.qty === undefined && product?.stock === undefined
      ? true
      : availableQty > 0;

  const productSizes = Array.isArray(product?.sizes) ? product.sizes : [];

  const price = Number(product?.price || 0);
  const comparePrice = Number(product?.compare_price || 0);

  const discount =
    comparePrice > price && price > 0
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  return (
    <Layout>
      <main className="pdp-page">
        <div className="container">
          <nav aria-label="breadcrumb" className="shop-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/shop">Shop</Link>
              </li>

              <li className="breadcrumb-item active" aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>

          <div className="pdp-layout">
            <div className="pdp-gallery">
              <div className="pdp-main-image">
                {product?.is_featured === "yes" && (
                  <span className="product-badge featured">Featured</span>
                )}

                {discount > 0 && (
                  <span
                    className="product-badge"
                    style={{
                      top: product?.is_featured === "yes" ? "45px" : "10px",
                    }}
                  >
                    {discount}% OFF
                  </span>
                )}

                {activeImage ? (
                  <img src={activeImage} alt={product.title} />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="pdp-thumbs">
                  {galleryImages.map((image, index) => (
                    <button
                      type="button"
                      key={image.id || index}
                      className={`pdp-thumb ${
                        activeImage === image.url ? "active" : ""
                      }`}
                      onClick={() => setActiveImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pdp-info">
              <span className="product-category">{categoryName}</span>

              <h1 className="pdp-title">{product.title}</h1>

              {product.sku && (
                <div className="pdp-sku">
                  SKU: <strong>{product.sku}</strong>
                </div>
              )}

              <div className="pdp-price-row">
                <span className="pdp-current-price">
                  ₹{price.toLocaleString("en-IN")}
                </span>

                {comparePrice > price && (
                  <span className="pdp-old-price">
                    ₹{comparePrice.toLocaleString("en-IN")}
                  </span>
                )}

                {discount > 0 && (
                  <span className="discount-text">{discount}% OFF</span>
                )}

                <span
                  className={`status-pill ${inStock ? "active" : "inactive"}`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {product.short_description && (
                <div
                  className="pdp-short-description"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}

              {productSizes.length > 0 && (
                <div className="pdp-size-section">
                  <div className="pdp-option-title">Select Size</div>

                  <div
                    className="pdp-size-options"
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {productSizes.map((size, index) => {
                      const sizeId = size?.id ?? size;

                      const sizeName = size?.name ?? size?.title ?? size;

                      const isSelected =
                        String(selectedSize) === String(sizeId);

                      return (
                        <button
                          type="button"
                          key={sizeId || index}
                          onClick={() => setSelectedSize(sizeId)}
                          style={{
                            padding: "8px 18px",
                            border: isSelected
                              ? "1px solid #0d6efd"
                              : "1px solid #dee2e6",
                            backgroundColor: isSelected ? "#e7f1ff" : "#fff",
                            color: isSelected ? "#0d6efd" : "#212529",
                            borderRadius: "6px",
                            fontWeight: isSelected ? "600" : "400",
                            cursor: "pointer",
                          }}
                        >
                          {sizeName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pdp-purchase-row">
                <div className="pdp-qty">
                  <button
                    type="button"
                    onClick={decreaseQty}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQty}
                    aria-label="Increase quantity"
                    disabled={
                      !inStock || (availableQty > 0 && quantity >= availableQty)
                    }
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary pdp-add-cart"
                  disabled={
                    !inStock || (productSizes.length > 0 && !selectedSize)
                  }
                >
                  <ShoppingCart size={17} />

                  {!inStock
                    ? "Out of Stock"
                    : productSizes.length > 0 && !selectedSize
                      ? "Select Size"
                      : "Add to Cart"}
                </button>

                <button
                  type="button"
                  className="pdp-wishlist-btn"
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} />
                </button>
              </div>

              {inStock && availableQty > 0 && (
                <div
                  className="pdp-stock-info"
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                  }}
                >
                  <Package size={15} />
                  <span>{availableQty} items available</span>
                </div>
              )}

              <ul className="pdp-assurance">
                <li>
                  <Truck size={16} />
                  Free delivery on orders above ₹999
                </li>

                <li>
                  <RotateCcw size={16} />7 day easy return policy
                </li>

                <li>
                  <ShieldCheck size={16} />
                  100% genuine products
                </li>
              </ul>
            </div>
          </div>

          <div className="pdp-tabs">
            <div className="pdp-tab-buttons">
              <button
                type="button"
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              <button
                type="button"
                className={activeTab === "specification" ? "active" : ""}
                onClick={() => setActiveTab("specification")}
              >
                Specification
              </button>
            </div>

            <div className="pdp-tab-content">
              {activeTab === "description" && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description ||
                      "<p>No description available for this product.</p>",
                  }}
                />
              )}

              {activeTab === "specification" && (
                <ul className="pdp-spec-list">
                  <li>
                    <span>Brand</span>
                    <span>{brandName}</span>
                  </li>

                  <li>
                    <span>Category</span>
                    <span>{categoryName}</span>
                  </li>

                  {product.sku && (
                    <li>
                      <span>SKU</span>
                      <span>{product.sku}</span>
                    </li>
                  )}

                  {product.barcode && (
                    <li>
                      <span>Barcode</span>
                      <span>{product.barcode}</span>
                    </li>
                  )}

                  <li>
                    <span>Availability</span>
                    <span>{inStock ? "In Stock" : "Out of Stock"}</span>
                  </li>

                  {availableQty > 0 && (
                    <li>
                      <span>Quantity Available</span>
                      <span>{availableQty}</span>
                    </li>
                  )}

                  {productSizes.length > 0 && (
                    <li>
                      <span>Available Sizes</span>

                      <span>
                        {productSizes
                          .map((size) => size?.name || size?.title || size)
                          .join(", ")}
                      </span>
                    </li>
                  )}

                  <li>
                    <span>Featured</span>
                    <span>{product.is_featured === "yes" ? "Yes" : "No"}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {(loadingRelated || relatedProducts.length > 0) && (
            <section className="pdp-related">
              <h2>Related Products</h2>

              <div className="row g-4">
                {loadingRelated
                  ? [1, 2, 3, 4].map((item) => (
                      <div className="col-6 col-md-3" key={item}>
                        <div className="product-card-skeleton">
                          <div className="product-skeleton-image" />
                          <div className="product-skeleton-line" />
                          <div className="product-skeleton-small" />
                        </div>
                      </div>
                    ))
                  : relatedProducts.map((item) => {
                      const relatedImage = item?.image_url || null;

                      return (
                        <div className="col-6 col-md-3" key={item.id}>
                          <article className="product-card">
                            <div className="product-card-image">
                              {relatedImage ? (
                                <img
                                  src={relatedImage}
                                  alt={item.title}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="product-image-placeholder">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div className="product-card-content">
                              <span className="product-category">
                                {item?.category?.name ||
                                  item?.category_name ||
                                  "Product"}
                              </span>

                              <h3>
                                <Link to={`/product/${item.id}`}>
                                  {item.title}
                                </Link>
                              </h3>

                              <div className="product-price">
                                <span className="product-current-price">
                                  ₹
                                  {Number(item?.price || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>

                                {item?.compare_price &&
                                  Number(item.compare_price) >
                                    Number(item.price) && (
                                    <span className="product-old-price">
                                      ₹
                                      {Number(
                                        item.compare_price,
                                      ).toLocaleString("en-IN")}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </article>
                        </div>
                      );
                    })}
              </div>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Product;
