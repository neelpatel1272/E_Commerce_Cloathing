import React, { useContext, useState } from "react";
import Layout from "../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiurl } from "../common/Http";
import { toast } from "react-toastify";
import { AdminAuthContext } from "../context/AdminAuth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AdminAuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiurl}admin/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status == true) {
        const adminInfo = {
          id: result.id,
          token: result.token,
          username: result.name,
        };

        localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
        login(adminInfo);
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
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

                  <h2>Welcome Back</h2>
                  <p>Login to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>

                    <input
                      {...register("email", {
                        required: "This Field is Required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid Email Address",
                        },
                      })}
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${errors.email && "is-invalid"}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="invalid-feedback">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>

                      <a href="#" className="forgot-password">
                        Forgot Password?
                      </a>
                    </div>

                    <input
                      {...register("password", {
                        required: "This Field is Required",
                      })}
                      type="password"
                      id="password"
                      name="password"
                      className={`form-control ${errors.password && "is-invalid"}`}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="invalid-feedback">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  <div className="form-check mb-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />

                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
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
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="login-footer">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/register">Create an account</Link>
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

export default Login;
