import React, { useContext, useEffect, useState } from "react";
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
  ArrowUpRight,
} from "lucide-react";

import Layout from "../common/Layout";
import { apiurl } from "../common/Http";
import { CartContext } from "../context/Cart";

const Product = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const { cartData, addTocart } = useContext(CartContext);

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

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiurl}get-categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Category Error:", error);
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

    const handleAddToCart = () => {
      if (!inStock) {
        return;
      }

      if (productSizes.length > 0) {
        if (!selectedSize) {
          return;
        }

        if (remainingSizeStock <= 0) {
          return;
        }

        if (quantity > remainingSizeStock) {
          return;
        }
      }

      addTocart(
        product,
        selectedSize,
        quantity
      );
    };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const categoryId = product?.category?.id || product?.category_id;

    if (categoryId) {
      fetchCategories();
      fetchRelatedProducts(categoryId);
    }
  }, [product]);

  useEffect(() => {
  if (!selectedSize) return;

  const sizeId = getSizeId(selectedSize);
  const sizeStock = getSizeStock(selectedSize);

  const sizeCartItem = cartData?.find(
    (item) =>
      String(item.product_id) === String(product?.id) &&
      String(item.size_id ?? "") === String(sizeId ?? ""),
  );

  const remaining = sizeStock - Number(sizeCartItem?.qty || 0);

  if (remaining <= 0) {
    setSelectedSize(null);
    setQuantity(1);
  }
}, [cartData, selectedSize, product]);
  
const decreaseQty = () => {
  setQuantity((prev) =>
    Math.max(1, prev - 1)
  );
};

const increaseQty = () => {
  if (productSizes.length > 0) {
    if (
      remainingSizeStock > 0 &&
      quantity < remainingSizeStock
    ) {
      setQuantity((prev) => prev + 1);
    }

    return;
  }

  const stock = Number(
    product?.qty ??
      product?.stock ??
      product?.quantity ??
      0
  );

  if (stock > 0) {
    setQuantity((prev) =>
      Math.min(stock, prev + 1)
    );
  } else {
    setQuantity((prev) => prev + 1);
  }
};

const handleSizeChange = (size) => {
  setSelectedSize(size);

  setQuantity(1);
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

              <Link to="/" className="btn btn-primary">
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

  const getSizeId = (size) => {
    if (size === null || size === undefined || size === "") {
      return null;
    }

    if (typeof size === "object") {
      return size?.id ?? null;
    }

    return size;
  };

  const getSizeName = (size) => {
    if (size === null || size === undefined || size === "") {
      return null;
    }

    if (typeof size === "object") {
      return size?.name ?? size?.title ?? null;
    }

    return size;
  };

  const getSizeStock = (size) => {
    if (size && typeof size === "object") {
      return Number(size.qty ?? size.stock ?? size.quantity ?? 0);
    }

    return Number(product?.qty ?? product?.stock ?? product?.quantity ?? 0);
  };

  const selectedSizeStock =
    productSizes.length > 0
      ? getSizeStock(selectedSize)
      : Number(product?.qty ?? product?.stock ?? product?.quantity ?? 0);

  const selectedSizeId = getSizeId(selectedSize);

  const selectedSizeCartItem = cartData?.find(
    (item) =>
      String(item.product_id) === String(product.id) &&
      String(item.size_id ?? "") === String(selectedSizeId ?? ""),
  );

  const alreadyInCartQty = Number(selectedSizeCartItem?.qty || 0);

  const remainingSizeStock =
    selectedSizeStock > 0
      ? Math.max(0, selectedSizeStock - alreadyInCartQty)
      : 0;

  const selectedSizeAvailable =
    productSizes.length > 0 ? remainingSizeStock > 0 : true;

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
              {product?.category && (
                <li className="breadcrumb-item">
                  <Link to={`/collections/${product.category.slug}`}>
                    {product.category.name}
                  </Link>
                </li>
              )}

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
                    className="product-badge discount"
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

              <div className="pdp-price-row">
                <span className="pdp-current-price">
                  ₹{price.toLocaleString("en-IN")}
                </span>

                {comparePrice > price && (
                  <span className="pdp-old-price">
                    ₹{comparePrice.toLocaleString("en-IN")}
                  </span>
                )}

                {/* {discount > 0 && (
                  <span className="discount-text">{discount}% OFF</span>
                )} */}

                <span
                  className={`status-pill ${inStock ? "active" : "inactive"}`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* {product.sku && (
                <div className="pdp-sku">
                  SKU: <span className="pdp-short-description">{product.sku}</span>
                </div>
              )} */}
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
              {productSizes
                .filter((size) => {
                  const sizeId = getSizeId(size);
                  const sizeStock = getSizeStock(size);

                  const sizeCartItem = cartData?.find(
                    (item) =>
                      String(item.product_id) === String(product.id) &&
                      String(item.size_id ?? "") === String(sizeId ?? "")
                  );

                  const sizeInCartQty = Number(sizeCartItem?.qty || 0);
                  const remainingStock = Math.max(0, sizeStock - sizeInCartQty);

                  return remainingStock > 0; // hide sizes with nothing left
                })
  .map((size, index) => {
    const sizeId = getSizeId(size);
    const sizeName = getSizeName(size);
    const isSelected =
      String(selectedSize?.id ?? selectedSize) === String(sizeId);

    return (
      <button
        type="button"
        key={sizeId || index}
        onClick={() => handleSizeChange(size)}
        style={{
          padding: "8px 18px",
          border: isSelected ? "1px solid #0d6efd" : "1px solid #dee2e6",
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

{productSizes.length > 0 &&
  productSizes.every((size) => {
    const sizeId = getSizeId(size);
    const sizeStock = getSizeStock(size);
    const sizeCartItem = cartData?.find(
      (item) =>
        String(item.product_id) === String(product.id) &&
        String(item.size_id ?? "") === String(sizeId ?? "")
    );
    const sizeInCartQty = Number(sizeCartItem?.qty || 0);
    return Math.max(0, sizeStock - sizeInCartQty) <= 0;
  }) && (
    <p style={{ color: "#999", marginTop: "8px" }}>
      All sizes are currently sold out.
    </p>
  )}
                  </div>
                </div>
              )}

            <div className="pdp-purchase-row">
              <div className="pdp-qty">
                <button
                  type="button"
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQty}
                  disabled={
                    !inStock ||
                    (productSizes.length > 0 &&
                      (remainingSizeStock <= 0 ||
                        quantity >=
                          remainingSizeStock)) ||
                    (productSizes.length === 0 &&
                      availableQty > 0 &&
                      quantity >= availableQty)
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary pdp-add-cart"
                disabled={
                  !inStock ||
                  (productSizes.length > 0 &&
                    (!selectedSize ||
                      remainingSizeStock <= 0 ||
                      quantity > remainingSizeStock))
                }
              >
                <ShoppingCart size={17} />

                {!inStock
                  ? "Out of Stock"
                  : productSizes.length > 0 &&
                      !selectedSize
                    ? "Select Size"
                    : productSizes.length > 0 &&
                        remainingSizeStock <= 0
                      ? "Size Sold Out"
                      : "Add to Cart"}
              </button>
            </div>


                {inStock &&
                  productSizes.length > 0 &&
                  selectedSize &&
                  remainingSizeStock > 0 && (
                    <div
                      className="pdp-stock-info"
                      style={{
                        marginTop: "12px",
                        fontSize: "14px",
                      }}
                    >
                      <Package size={15} />

                      <span>
                        {remainingSizeStock}{" "}
                        items available
                      </span>
                    </div>
                  )}

                {inStock &&
                  productSizes.length === 0 &&
                  availableQty > 0 && (
                    <div
                      className="pdp-stock-info"
                      style={{
                        marginTop: "12px",
                        fontSize: "14px",
                      }}
                    >
                      <Package size={15} />

                      <span>
                        {availableQty} items available
                      </span>
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
                  {/* {product.barcode && (
                    <li>
                      <span>Barcode</span>
                      <span>{product.barcode}</span>
                    </li>
                  )} */}

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

                  {/* <li>
                    <span>Featured</span>
                    <span>{product.is_featured === "yes" ? "Yes" : "No"}</span>
                  </li> */}
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
                          <Link
                            to={`/product/${item.id}`}
                            className="text-decoration-none text-dark"
                          >
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
                                <span className="product-view-button">
                                  <ArrowUpRight size={18} />
                                </span>
                              </div>

                              <div className="product-card-content">
                                <span className="product-category">
                                  {item?.category?.name ||
                                    item?.category_name ||
                                    "Product"}
                                </span>

                                <h3>{item.title}</h3>

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
                          </Link>
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
