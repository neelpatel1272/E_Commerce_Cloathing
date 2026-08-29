import React, { useState } from "react";
import Layout from "../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl } from "../common/Http";
import { toast } from "react-toastify";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await fetch(`${apiurl}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (result.status === true || result.status === "true") {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        if (result.error) {
          if (result.error.email) {
            toast.error(result.error.email[0]);
          } else if (result.error.name) {
            toast.error(result.error.name[0]);
          } else if (result.error.password) {
            toast.error(result.error.password[0]);
          } else {
            toast.error("Registration failed.");
          }
        } else {
          toast.error(result.message || "Registration failed.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="login-page">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-5 col-md-7 col-sm-10">
              <div className="login-card">
                <div className="login-header">
                  <div className="login-icon">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M3.5 21C4.5 16.8 7.3 14.5 12 14.5C16.7 14.5 19.5 16.8 20.5 21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <h2>Create Account</h2>
                  <p>Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>

                    <input
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      id="name"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your full name"
                    />

                    {errors.name && (
                      <p className="invalid-feedback">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>

                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      id="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                    />

                    {errors.email && (
                      <p className="invalid-feedback">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>

                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters",
                        },
                      })}
                      type="password"
                      id="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Create a password"
                    />

                    {errors.password && (
                      <p className="invalid-feedback">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>

                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      type="password"
                      id="confirmPassword"
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Confirm your password"
                    />

                    {errors.confirmPassword && (
                      <p className="invalid-feedback">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn login-btn w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="login-footer">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;