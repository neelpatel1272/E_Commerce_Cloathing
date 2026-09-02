import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Truck } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../../common/Sidebar";
import { admintoken, apiurl } from "../../common/Http";
import { useNavigate } from "react-router-dom";

const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${admintoken()}`,
});

const Create = () => {
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      shipping_charge: "",
      status: "1",
    },
  });

  const statusValue = watch("status");

  useEffect(() => {
    const getShipping = async () => {
      try {
        const res = await fetch(`${apiurl}get-shipping`, {
          method: "GET",
          headers: authHeaders(),
        });

        const result = await res.json();

        if (result.status === true) {
          reset({
            shipping_charge: result.data?.shipping_charge ?? "",
            status: String(result.data?.status ?? "1"),
          });
        } else {
          toast.error(
            result.message || "Unable to load shipping details",
          );
        }
      } catch (error) {
        console.error("Error fetching shipping:", error);
        toast.error("Unable to reach the server.");
      } finally {
        setLoading(false);
      }
    };

    getShipping();
  }, [reset]);

  const saveShipping = async (data) => {
    try {
      const res = await fetch(`${apiurl}save-shipping`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipping_charge: data.shipping_charge,
          status: data.status,
        }),
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(
          result.message || "Shipping Saved Successfully",
        );
        navigate("/admin/shippings");
      } else if (result.errors) {
        Object.values(result.errors).forEach((error) => {
          toast.error(error[0]);
        });
      } else if (result.message) {
        if (typeof result.message === "object") {
          Object.values(result.message).forEach((error) => {
            toast.error(error[0]);
          });
        } else {
          toast.error(result.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error saving shipping:", error);
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
              <h1>Shipping Details</h1>
              <p>Manage the shipping charge for your store.</p>
            </div>
          </div>

          <div className="data-card">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading...
                  </span>
                </div>

                <p className="mt-3 mb-0">
                  Loading shipping details...
                </p>
              </div>
            ) : (
              <form
                className="admin-form"
                onSubmit={handleSubmit(saveShipping)}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="shipping_charge">
                    Shipping Charge
                    <span className="required">*</span>
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">₹</span>

                    <input
                      id="shipping_charge"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 100"
                      className={`form-control ${
                        errors.shipping_charge ? "has-error" : ""
                      }`}
                      {...register("shipping_charge", {
                        required: "Shipping charge is required",
                        min: {
                          value: 0,
                          message:
                            "Shipping charge cannot be negative",
                        },
                      })}
                    />
                  </div>

                  {errors.shipping_charge && (
                    <span className="form-error">
                      {errors.shipping_charge.message}
                    </span>
                  )}

                  <small className="text-muted d-block mt-2">
                    Enter the shipping amount that will be charged
                    to customers.
                  </small>
                </div>

                <div className="form-group mt-4">
                  <label>Status</label>

                  <div className="status-toggle-group">
                    <label
                      className={
                        statusValue === "1"
                          ? "checked-active"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        value="1"
                        {...register("status")}
                      />
                      Active
                    </label>

                    <label
                      className={
                        statusValue === "0"
                          ? "checked-inactive"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        value="0"
                        {...register("status")}
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                <div className="shipping-info mt-4 p-3 border rounded">
                  <div className="d-flex align-items-center gap-2">
                    <Truck size={20} />
                    <strong>Shipping Charge</strong>
                  </div>

                  <p className="mb-0 mt-2 text-muted">
                    This amount will be used as the standard shipping
                    charge for orders.
                  </p>
                </div>

                <div className="form-actions mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    <Save size={16} className="me-1" />

                    {isSubmitting
                      ? "Saving..."
                      : "Save Shipping"}
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

export default Create;
