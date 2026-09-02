  import React, { useEffect, useState } from "react";
  import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
  import { Link } from "react-router-dom";
  import { toast } from "react-toastify";
  import Swal from "sweetalert2";

  import Sidebar from "../../common/Sidebar";
  import Loader from "../../common/Loader";
  import Nostate from "../../common/Nostate";
  import { admintoken, apiurl } from "../../common/Http";

  const Show = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiurl}products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${admintoken()}`,
          },
        });

        const result = await res.json();

        if (result.status === true) {
          setProducts(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    const filteredProducts = products.filter(
      (item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(search.toLowerCase()),
    );

    const activeProducts = products.filter((item) => item.status == 1).length;

    const inactiveProducts = products.filter((item) => item.status != 1).length;

    const handleDelete = async (id, title) => {
      const confirm = await Swal.fire({
        title: "Delete Product?",
        html: `Are you sure you want to delete <b>${title}</b>?<br/>This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#6c757d",
      });

      if (!confirm.isConfirmed) return;

      try {
        const res = await fetch(`${apiurl}products/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${admintoken()}`,
          },
        });

        const result = await res.json();

        if (result.status === true) {
          const newProducts = products.filter((item) => item.id !== id);

          setProducts(newProducts);

          toast.success(result.message);
        } else {
          toast.error(result.message || "Unable to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Unable to delete product");
      }
    };

    return (
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <Sidebar />

          <div className="col-md-9">
            <div className="page-header">
              <div>
                <h1>Products</h1>
                <p>Manage and organize your products.</p>
              </div>

              <Link to="/admin/products/create" className="btn btn-primary">
                <Plus size={18} />
                Add Product
              </Link>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="mini-stat-card tint-blue">
                  <div className="icon-chip">
                    <Package size={22} />
                  </div>

                  <div>
                    <span className="stat-label">Total Products</span>
                    <span className="stat-value">{products.length}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mini-stat-card tint-green">
                  <div className="icon-chip">
                    <Package size={22} />
                  </div>

                  <div>
                    <span className="stat-label">Active Products</span>
                    <span className="stat-value">{activeProducts}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mini-stat-card tint-rose">
                  <div className="icon-chip">
                    <Package size={22} />
                  </div>

                  <div>
                    <span className="stat-label">Inactive Products</span>
                    <span className="stat-value">{inactiveProducts}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <div className="data-card-header">
                <div>
                  <h3>All Products</h3>

                  <span className="count">
                    {filteredProducts.length} products found
                  </span>
                </div>

                <div className="search-box">
                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Search product or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-5">
                  <Loader />
                </div>
              ) : filteredProducts.length === 0 ? (
                <Nostate
                  text={
                    search ? "No products match your search" : "No Products Found"
                  }
                />
              ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>SKU</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((item, index) => (
                        <tr key={item.id}>
                          <td className="row-index">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          <td>
    <div className="row-entity">
      <div className="product-image">
        {item.image ? (
          <img
            src={`${apiurl.replace("/api/", "/")}uploads/products/small/${item.image}`}
            alt={item.title}
          />
        ) : (
          <div className="product-image-placeholder">
            <Package size={18} />
          </div>
        )}
      </div>

      <span className="entity-name">{item.title}</span>
    </div>
  </td>

                        

                          <td>
                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </td>

                          <td>{item.qty ?? 0}</td>

                          <td>{item.sku || "-"}</td>

                          <td>
                            <span
                              className={`status-pill ${
                                item.status == 1 ? "active" : "inactive"
                              }`}
                            >
                              {item.status == 1 ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <div className="row-actions">
                              <Link
                                to={`/admin/products/edit/${item.id}`}
                                title="Edit"
                              >
                                <Edit size={15} />
                              </Link>

                              <button
                                type="button"
                                className="danger"
                                title="Delete"
                                onClick={() => handleDelete(item.id, item.title)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Show;
