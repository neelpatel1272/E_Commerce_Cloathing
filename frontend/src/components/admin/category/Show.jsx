import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import Nostate from "../../common/Nostate";
import { admintoken, apiurl } from "../../common/Http";

const Show = () => {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const res = await fetch(`${apiurl}categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${admintoken()}`,
      },
    });

    const result = await res.json();

    if (result.status === true) {
      setCategory(result.data);
    } else {
      console.error(result.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = category.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCategories = category.filter((item) => item.status == 1).length;

  const inactiveCategories = category.filter(
    (item) => item.status != 1
  ).length;

const handleDelete = async (id, name) => {
  const confirm = await Swal.fire({
    title: "Delete Category?",
    html: `Are you sure you want to delete <b>${name}</b>?<br/>This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    cancelButtonColor: "#6c757d",
  });

  if (!confirm.isConfirmed) return;

    const res = await fetch(`${apiurl}categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${admintoken()}`,
      },
    });

    const result = await res.json();

    if (result.status === true) {
      const newCategory = category.filter((item) => item.id !== id);

      setCategory(newCategory);

      toast.success(result.message);
    } else {
      toast.error(result.message || "Unable to delete category");
    }
};

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <Sidebar />

        <div className="col-md-9">
          <div className="page-header">
            <div>
              <h1>Categories</h1>
              <p>Manage and organize your product categories.</p>
            </div>

            <Link to="/admin/categories/create" className="btn btn-primary">
              <Plus size={18} />
              Add Category
            </Link>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="mini-stat-card tint-blue">
                <div className="icon-chip">
                  <Folder size={22} />
                </div>

                <div>
                  <span className="stat-label">Total Categories</span>
                  <span className="stat-value">{category.length}</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="mini-stat-card tint-green">
                <div className="icon-chip">
                  <Folder size={22} />
                </div>

                <div>
                  <span className="stat-label">Active Categories</span>
                  <span className="stat-value">{activeCategories}</span>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="mini-stat-card tint-rose">
                <div className="icon-chip">
                  <Folder size={22} />
                </div>

                <div>
                  <span className="stat-label">Inactive Categories</span>
                  <span className="stat-value">{inactiveCategories}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="data-card">
            <div className="data-card-header">
              <div>
                <h3>All Categories</h3>
                <span className="count">
                  {filteredCategories.length} categories found
                </span>
              </div>

              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="py-5">
                <Loader />
              </div>
            ) : filteredCategories.length === 0 ? (
              <Nostate
                text={
                  search
                    ? "No categories match your search"
                    : "No Categories Found"
                }
              />
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCategories.map((item, index) => (
                      <tr key={item.id}>
                        <td className="row-index">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td>
                          <div className="row-entity">
                            <div className="entity-icon">
                              <Folder size={18} />
                            </div>

                            <div>
                              <span className="entity-name">{item.name}</span>
                            </div>
                          </div>
                        </td>

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
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>

                        <td>
                          <div className="row-actions">
                            <Link
                              to={`/admin/categories/show/${item.id}`}
                              title="View"
                            >
                              <Eye size={15} />
                            </Link>

                            <Link
                              to={`/admin/categories/edit/${item.id}`}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </Link>

                            <button
                              type="button"
                              className="danger"
                              title="Delete"
                              onClick={() => handleDelete(item.id, item.name)}
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