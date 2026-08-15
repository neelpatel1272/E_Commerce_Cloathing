import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, GripVertical } from "lucide-react";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

import Sidebar from "../../common/Sidebar";
import { admintoken, apiurl } from "../../common/Http";

const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${admintoken()}`,
});

const Create = () => {
  const navigate = useNavigate();

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 250,
      placeholder: "Start typing...",
    }),
    [],
  );

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
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

  useEffect(() => {
    const loadOptions = async (endpoint, setter, label) => {
      try {
        const res = await fetch(`${apiurl}${endpoint}`, {
          headers: authHeaders(),
        });

        const result = await res.json();

        if (result.status === true) {
          setter(result.data);
        } else {
          console.error(`Unable to load ${label}`);
        }
      } catch (error) {
        console.error(`Error fetching ${label}:`, error);
      }
    };

    loadOptions("categories", setCategories, "categories");
    loadOptions("brands", setBrands, "brands");
    loadOptions("sizes", setSizes, "sizes");
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) {
      return;
    }

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
            },
          ]);
        } else {
          URL.revokeObjectURL(previewUrl);
          toast.error(result.message || "Image upload failed");
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Unable to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (id) => {
    setGallery((prev) => {
      const image = prev.find((item) => item.id === id);

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return prev.filter((item) => item.id !== id);
    });
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
      const updatedGallery = [...prev];
      const [movedImage] = updatedGallery.splice(sourceIndex, 1);
      updatedGallery.splice(dropIndex, 0, movedImage);
      return updatedGallery;
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
      const updatedGallery = [...prev];
      const [movedImage] = updatedGallery.splice(fromIndex, 1);
      updatedGallery.splice(toIndex, 0, movedImage);
      return updatedGallery;
    });
  };

  const setAsMainImage = (index) => {
    if (index === 0) {
      return;
    }

    moveImage(index, 0);
    toast.success("Main image changed");
  };

  const saveProduct = async (data) => {
    if (gallery.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      const res = await fetch(`${apiurl}products`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          sizes: Array.isArray(data.sizes)
            ? data.sizes.map((id) => Number(id))
            : [],
          gallery: gallery.map((image) => image.id),
        }),
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message);
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
      console.error("Error creating product:", error);
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
              <h1>Add Product</h1>
              <p>Create a new product for your catalog.</p>
            </div>

            <Link to="/admin/products" className="btn btn-size">
              <ArrowLeft size={16} className="me-1" />
              Back to Products
            </Link>
          </div>

          <div className="data-card">
            <form
              className="admin-form"
              onSubmit={handleSubmit(saveProduct)}
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
                            value={size.id}
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
                        key={image.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="product-preview">
                          {index === 0 && (
                            <span className="main-image-badge">Main Image</span>
                          )}

                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => removeImage(image.id)}
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
                                e.currentTarget.src !== image.url
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
                      className={statusValue === "0" ? "checked-inactive" : ""}
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
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
