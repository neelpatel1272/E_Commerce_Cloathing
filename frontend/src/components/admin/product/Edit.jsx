import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, GripVertical } from "lucide-react";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import { admintoken, apiurl } from "../../common/Http";

const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${admintoken()}`,
});

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 250,
      placeholder: "Start typing...",
    }),
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      compare_price: "",
      description: "",
      short_description: "",
      category: "",
      brand: "",
      qty: "",
      sku: "",
      barcode: "",
      status: "1",
      is_featured: "no",
      sizes: [],
    },
  });

  const statusValue = watch("status");
  const featuredValue = watch("is_featured");
  const selectedSizes = watch("sizes") || [];

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiurl}categories`, {
        headers: authHeaders(),
      });

      const result = await res.json();

      if (result.status === true) {
        setCategories(
          Array.isArray(result.data) ? result.data : result.data?.data || [],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${apiurl}brands`, {
        headers: authHeaders(),
      });

      const result = await res.json();

      if (result.status === true) {
        setBrands(
          Array.isArray(result.data) ? result.data : result.data?.data || [],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await fetch(`${apiurl}sizes`, {
        headers: authHeaders(),
      });

      const result = await res.json();

      if (result.status === true) {
        setSizes(
          Array.isArray(result.data) ? result.data : result.data?.data || [],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${apiurl}products/${id}`, {
        method: "GET",
        headers: authHeaders(),
      });

      const result = await res.json();

      if (!result.status) {
        toast.error(result.message || "Product not found.");
        navigate("/admin/products");
        return;
      }

      const product = result.data;

      const productSizes = Array.isArray(product.sizes) ? product.sizes : [];

      const selectedSizeIds = productSizes.map((size) => String(size.id));

      reset({
        title: product.title || "",
        price: product.price ?? "",
        compare_price: product.compare_price ?? "",
        category: String(product.category_id || ""),
        brand: product.brand_id ? String(product.brand_id) : "",
        qty: product.qty ?? "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        short_description: product.short_description || "",
        description: product.description || "",
        status: String(product.status ?? "1"),
        is_featured:
          product.is_featured === "yes" ||
          product.is_featured === 1 ||
          product.is_featured === "1"
            ? "yes"
            : "no",
        sizes: selectedSizeIds,
      });

      const productImages = Array.isArray(product.images) ? product.images : [];

      const formattedImages = productImages.map((image) => ({
        id: image.id,
        name: image.image,
        url:
          image.url ||
          `${apiurl.replace(
            /\/api\/?$/,
            "",
          )}/uploads/products/large/${image.image}`,
        preview:
          image.url ||
          `${apiurl.replace(
            /\/api\/?$/,
            "",
          )}/uploads/products/large/${image.image}`,
        type: "existing",
      }));

      setGallery(formattedImages);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach the server.");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
    fetchProduct();
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setUploading(true);

    try {
      for (const file of files) {
        const previewUrl = URL.createObjectURL(file);

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`${apiurl}temp-images`, {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        });

        const result = await res.json();

        if (result.status === true) {
          const imageUrl =
            result.data.url ||
            `${apiurl.replace(
              /\/api\/?$/,
              "",
            )}/uploads/temp/${result.data.name}`;

          setGallery((prev) => [
            ...prev,
            {
              id: result.data.id,
              name: result.data.name,
              url: imageUrl,
              preview: previewUrl,
              type: "new",
            },
          ]);
        } else {
          URL.revokeObjectURL(previewUrl);
          toast.error(result.message || "Image upload failed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (image, index) => {
    if (image.type === "existing") {
      setDeleteImages((prev) => {
        if (prev.includes(image.id)) {
          return prev;
        }

        return [...prev, image.id];
      });
    }

    if (image.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));

    if (
      Number.isNaN(sourceIndex) ||
      sourceIndex === dropIndex ||
      sourceIndex < 0 ||
      sourceIndex >= gallery.length
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setGallery((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(sourceIndex, 1);

      updated.splice(dropIndex, 0, moved);

      return updated;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveImage = (fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= gallery.length ||
      toIndex >= gallery.length
    ) {
      return;
    }

    setGallery((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);

      updated.splice(toIndex, 0, moved);

      return updated;
    });
  };

  const setAsMainImage = (index) => {
    if (index === 0) return;

    moveImage(index, 0);

    toast.success("Main image changed");
  };

  const updateProduct = async (data) => {
    if (gallery.length === 0) {
      toast.error("Please keep at least one product image.");
      return;
    }

    const existingImages = gallery
      .filter((image) => image.type === "existing")
      .map((image) => image.id);

    const newImages = gallery
      .filter((image) => image.type === "new")
      .map((image) => image.id);

    const imageOrder = gallery
      .filter((image) => image.type === "existing")
      .map((image) => image.id);

    try {
      const res = await fetch(`${apiurl}products/${id}`, {
        method: "PUT",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
           sizes: Array.isArray(data.sizes)
    ? data.sizes.map((size) => Number(size))
    : [],
          existing_images: existingImages,
          delete_images: deleteImages,
          gallery: newImages,
          image_order: imageOrder,
        }),
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message || "Product updated successfully");

        navigate("/admin/products");
      } else if (result.errors) {
        Object.values(result.errors).forEach((error) => {
          toast.error(error[0]);
        });
      } else {
        toast.error(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach the server. Please try again.");
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <Sidebar />

        <div className="col-md-9">
          <div className="page-header">
            <div>
              <h1>Edit Product</h1>
              <p>Update product information, images and inventory details.</p>
            </div>

            <Link to="/admin/products" className="btn btn-size">
              <ArrowLeft size={16} className="me-1" />
              Back to Products
            </Link>
          </div>

          <div className="data-card">
            {loading ? (
              <div className="py-5">
                <Loader />
              </div>
            ) : (
              <form
                className="admin-form"
                onSubmit={handleSubmit(updateProduct)}
                noValidate
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">
                      Product Title
                      <span className="required">*</span>
                    </label>

                    <input
                      id="title"
                      type="text"
                      placeholder="e.g. Men's T-Shirt"
                      className={errors.title ? "has-error" : ""}
                      {...register("title", {
                        required: "Product title is required",
                        maxLength: {
                          value: 255,
                          message: "Title must be under 255 characters",
                        },
                      })}
                    />

                    {errors.title && (
                      <span className="form-error">{errors.title.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="sku">
                      SKU
                      <span className="required">*</span>
                    </label>

                    <input
                      id="sku"
                      type="text"
                      placeholder="e.g. TSHIRT-001"
                      className={errors.sku ? "has-error" : ""}
                      {...register("sku", {
                        required: "SKU is required",
                      })}
                    />

                    {errors.sku && (
                      <span className="form-error">{errors.sku.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="price">
                      Price
                      <span className="required">*</span>
                    </label>

                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 999"
                      className={errors.price ? "has-error" : ""}
                      {...register("price", {
                        required: "Price is required",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Price cannot be negative",
                        },
                      })}
                    />

                    {errors.price && (
                      <span className="form-error">{errors.price.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="compare_price">Compare Price</label>

                    <input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 1299"
                      {...register("compare_price")}
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="category">
                      Category
                      <span className="required">*</span>
                    </label>

                    <select
                      id="category"
                      className={errors.category ? "has-error" : ""}
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      <option value="">Select Category</option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {errors.category && (
                      <span className="form-error">
                        {errors.category.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>

                    <select id="brand" {...register("brand")}>
                      <option value="">Select Brand</option>

                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qty">Quantity</label>

                    <input
                      id="qty"
                      type="number"
                      min="0"
                      placeholder="e.g. 50"
                      {...register("qty")}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="barcode">Barcode</label>

                    <input
                      id="barcode"
                      type="text"
                      placeholder="e.g. 890123456789"
                      {...register("barcode")}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Available Sizes</label>

                  <div
                    className="status-toggle-group"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {sizes.length === 0 ? (
                      <span>No sizes available.</span>
                    ) : (
                      sizes.map((size) => {
                        const isSelected = selectedSizes.includes(
                          String(size.id),
                        );

                        return (
                          <label
                            key={size.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              cursor: "pointer",
                              padding: "8px 14px",
                              border: isSelected
                                ? "1px solid #0d6efd"
                                : "1px solid #dee2e6",
                              borderRadius: "6px",
                              backgroundColor: isSelected ? "#e7f1ff" : "#fff",
                              color: isSelected ? "#0d6efd" : "#212529",
                              fontWeight: isSelected ? "600" : "400",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <input
                              type="checkbox"
                              value={String(size.id)}
                              {...register("sizes")}
                            />

                            <span>{size.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Short Description</label>

                  <Controller
                    name="short_description"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor
                        value={field.value}
                        config={editorConfig}
                        onBlur={(content) => field.onChange(content)}
                      />
                    )}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor
                        value={field.value}
                        config={editorConfig}
                        onBlur={(content) => field.onChange(content)}
                      />
                    )}
                  />
                </div>

                <div className="form-group product-gallery-field">
                  <div className="gallery-heading">
                    <div>
                      <label className="mb-1">
                        Product Images
                        <span className="required">*</span>
                      </label>

                      <p>
                        Drag images to reorder them. The first image is the main
                        product image.
                      </p>
                    </div>

                    {gallery.length > 0 && (
                      <span className="image-count">
                        {gallery.length}{" "}
                        {gallery.length === 1 ? "Image" : "Images"}
                      </span>
                    )}
                  </div>

                  <div className="product-upload-area">
                    <input
                      id="gallery"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                      multiple
                      onChange={handleImageUpload}
                    />

                    <label htmlFor="gallery" className="product-upload-label">
                      <span className="upload-icon">
                        <Upload size={22} />
                      </span>

                      <span className="upload-content">
                        <strong>
                          {uploading
                            ? "Uploading images..."
                            : "Choose Product Images"}
                        </strong>

                        <small>
                          JPG, PNG, GIF or WEBP · You can select multiple images
                        </small>
                      </span>

                      <span className="upload-button">Browse</span>
                    </label>
                  </div>

                  {gallery.length > 0 && (
                    <div className="product-gallery">
                      {gallery.map((image, index) => (
                        <div
                          className={`product-gallery-item ${
                            index === 0 ? "main-image" : ""
                          } ${dragOverIndex === index ? "drag-over" : ""} ${
                            draggedIndex === index ? "dragging" : ""
                          }`}
                          key={`${image.type}-${image.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="product-preview">
                            {index === 0 && (
                              <span className="main-image-badge">
                                Main Image
                              </span>
                            )}

                            <button
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(image, index)}
                              aria-label="Remove image"
                            >
                              <X size={16} />
                            </button>

                            <div className="drag-handle">
                              <GripVertical size={18} />
                            </div>

                            <img
                              src={image.preview || image.url}
                              alt={image.name}
                              onError={(e) => {
                                if (
                                  image.preview &&
                                  image.preview !== image.url
                                ) {
                                  e.currentTarget.src = image.url;
                                }
                              }}
                            />
                          </div>

                          <div className="product-image-footer">
                            <span className="image-number">{index + 1}</span>

                            <span className="image-name" title={image.name}>
                              {image.name}
                            </span>

                            {index !== 0 && (
                              <button
                                type="button"
                                className="make-main-btn"
                                onClick={() => setAsMainImage(index)}
                              >
                                Make Main
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {gallery.length === 0 && !uploading && (
                    <div className="gallery-empty-state">
                      <Upload size={24} />
                      <span>No product images uploaded yet</span>
                      <small>Upload at least one clear product image</small>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>

                    <div className="status-toggle-group">
                      <label
                        className={statusValue === "1" ? "checked-active" : ""}
                      >
                        <input type="radio" value="1" {...register("status")} />
                        Active
                      </label>

                      <label
                        className={
                          statusValue === "0" ? "checked-inactive" : ""
                        }
                      >
                        <input type="radio" value="0" {...register("status")} />
                        Inactive
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Featured Product</label>

                    <div className="status-toggle-group">
                      <label
                        className={
                          featuredValue === "yes" ? "checked-active" : ""
                        }
                      >
                        <input
                          type="radio"
                          value="yes"
                          {...register("is_featured")}
                        />
                        Yes
                      </label>

                      <label
                        className={
                          featuredValue === "no" ? "checked-inactive" : ""
                        }
                      >
                        <input
                          type="radio"
                          value="no"
                          {...register("is_featured")}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <Link to="/admin/products" className="btn btn-size">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || uploading}
                  >
                    <Save size={16} />

                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
