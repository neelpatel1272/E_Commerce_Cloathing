import React, { useEffect, useState } from "react";
import { Edit, Truck, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import { admintoken, apiurl } from "../../common/Http";

const Show = () => {
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShipping = async () => {
    try {
      const res = await fetch(`${apiurl}get-shipping`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${admintoken()}`,
        },
      });

      const result = await res.json();

      if (result.status === true) {
        setShipping(result.data);
      } else {
        toast.error(result.message || "Unable to load shipping details");
      }
    } catch (error) {
      console.error("Error fetching shipping:", error);
      toast.error("Unable to reach the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

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

            <Link
              to="/admin/shippings/create"
              className="btn btn-primary"
            >
              <Edit size={18} />
              {shipping ? "Update Shipping" : "Add Shipping"}
            </Link>
          </div>

          {loading ? (
            <div className="data-card py-5">
              <Loader />
            </div>
          ) : (
            <>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="mini-stat-card tint-blue">
                    <div className="icon-chip">
                      <Truck size={22} />
                    </div>

                    <div>
                      <span className="stat-label">
                        Shipping Charge
                      </span>

                 <span className="stat-value">
                        ₹
                        {Number(
                          shipping?.shipping_charge || 0,
                        ).toLocaleString("en-IN")}
                      </span> 
                    </div>
                  </div>
                </div>
              </div>

              <div className="data-card">
                <div className="data-card-header">
                  <div>
                    <h3>Shipping Details</h3>

                    <span className="count">
                      {shipping
                        ? "Shipping charge configured"
                        : "No shipping charge configured"}
                    </span>
                  </div>

                  {shipping && (
                    <Link
                      to="/admin/shippings/create"
                      className="btn btn-primary"
                    >
                      <Edit size={16} />
                      Edit Shipping
                    </Link>
                  )}
                </div>

                {shipping ? (
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>Shipping Charge</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="row-index">01</td>

                          <td>
                            <div className="row-entity">


                              <span className="entity-name">
                                ₹
                                {Number(
                                  shipping.shipping_charge || 0,
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </td>

                          <td>
                            <span className="status-pill active">
                              Active
                            </span>
                          </td>

                          <td>
                            <div className="row-actions">
                              <Link
                                to="/admin/shippings/create"
                                title="Edit"
                              >
                                <Edit size={15} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="product-image-placeholder mx-auto mb-3">
                      <Truck size={24} />
                    </div>

                    <h5>No Shipping Details Found</h5>

                    <p className="text-muted mb-3">
                      You have not configured a shipping charge yet.
                    </p>

                    <Link
                      to="/admin/shippings/create"
                      className="btn btn-primary"
                    >
                      <Edit size={16} />
                      Add Shipping
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Show;
