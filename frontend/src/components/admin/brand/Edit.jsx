import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";

import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import { admintoken, apiurl } from "../../common/Http";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      status: "1",
    },
  });

  const statusValue = watch("status");

  // Fetch the Brand and pre-fill the form
  const fetchBrand = async () => {
    try {
      const res = await fetch(`${apiurl}brands/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${admintoken()}`,
        },
      });

      const result = await res.json();

      if (result.status === true) {
        reset({
          name: result.data.name,
          status: String(result.data.status),
        });
      } else {
        toast.error(result.message || "Brand not found.");
        navigate("/admin/brands");
      }
    } catch (error) {
      console.error("Error fetching Brand:", error);
      toast.error("Unable to reach the server. Please try again.");
      navigate("/admin/brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update the Brand
  const updatecatagory = async (data) => {
    try {
      const res = await fetch(`${apiurl}brands/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${admintoken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message || "Brand updated successfully");
        navigate("/admin/brands");
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating Brand:", error);
      toast.error("Unable to reach the server. Please try again.");
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        {/* ================= SIDEBAR ================= */}
        <Sidebar />

        {/* ================= MAIN CONTENT ================= */}
        <div className="col-md-9">
          {/* ================= PAGE HEADER ================= */}
          <div className="page-header">
            <div>
              <h1>Edit Brand</h1>
              <p>Update the details of this product Brand.</p>
            </div>

            <Link to="/admin/brands" className="btn btn-size">
              <ArrowLeft size={16} className="me-1" />
              Back to brands
            </Link>
          </div>

          {/* ================= FORM CARD ================= */}
          <div className="data-card">
            {loading ? (
              <div className="py-5">
                <Loader />
              </div>
            ) : (
              <form
                className="admin-form"
                onSubmit={handleSubmit(updatecatagory)}
                noValidate
              >
                <div className="form-row">
                  {/* Brand Name */}
                  <div className="form-group">
                    <label htmlFor="name">
                      Brand Name<span className="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Womens"
                      className={errors.name ? "has-error" : ""}
                      {...register("name", {
                        required: "Brand name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Name must be under 100 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <span className="form-error">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Status */}
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
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="form-actions">
                  <Link to="/admin/brands" className="btn btn-size">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
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