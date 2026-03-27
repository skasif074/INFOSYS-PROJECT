import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerNewUser } from "../../Services/LoginService";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inventoryUser, setInventoryUser] = useState({
    username: "",
    password: "",
    personalName: "",
    email: "",
    role: "",
  });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    setFlag(false);
  }, []);

  const createNewUser = (event) => {
    event.preventDefault();
    registerNewUser(inventoryUser).then(() => {
      setFlag(true);
    });
  };

  const onChangeHandler = (event) => {
    setFlag(false);
    const { name, value } = event.target;
    setInventoryUser((values) => ({ ...values, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!inventoryUser.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }
    if (!inventoryUser.personalName.trim()) {
      tempErrors.personalName = "Full Name is required";
      isValid = false;
    }
    if (!inventoryUser.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(inventoryUser.email)) {
      tempErrors.email = "Invalid Email Format";
      isValid = false;
    }
    if (!inventoryUser.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (inventoryUser.password.length < 5) {
      tempErrors.password = "Minimum 5 characters";
      isValid = false;
    }
    if (inventoryUser.password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    if (!inventoryUser.role.trim()) {
      tempErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (isValid) createNewUser(event);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden font-sans select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 relative z-10">
        <div className="max-w-md space-y-6 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 shadow-lg mx-auto md:mx-0">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7L12 12L20 7M4 7L12 2L20 7M4 7V17L12 22L20 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 9.5L16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 9.5L8 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              SMART<span className="text-primary">SHELF</span>X
            </h1>
            <p className="text-sm opacity-70 mt-2">Intelligent Inventory Management</p>
          </div>
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Real-time stock tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>AI-powered demand forecasting</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Multi-role access control</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 relative z-10 pr-16 md:pr-32">
        <div className="w-full max-w-2xl bg-base-100/30 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-sm opacity-70 mt-2">Join SmartShelfX Inventory System</p>
            </div>

            {flag ? (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-success text-sm font-medium bg-success/10 py-3 px-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  User Created Successfully!
                </div>
                <button onClick={() => navigate('/')} className="btn btn-primary w-full">
                  Go To Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleValidation} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-control relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className={`input input-lg h-14 pl-12 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 placeholder:text-base-content/30 ${errors.username ? "border-error ring-2 ring-error/20" : ""}`}
                      value={inventoryUser.username}
                      onChange={onChangeHandler}
                    />
                    {errors.username && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.username}</p>}
                  </div>

                  <div className="form-control relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="personalName"
                      placeholder="Full Name"
                      className={`input input-lg h-14 pl-12 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 placeholder:text-base-content/30 ${errors.personalName ? "border-error ring-2 ring-error/20" : ""}`}
                      value={inventoryUser.personalName}
                      onChange={onChangeHandler}
                    />
                    {errors.personalName && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.personalName}</p>}
                  </div>

                  <div className="form-control relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={`input input-lg h-14 pl-12 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 placeholder:text-base-content/30 ${errors.email ? "border-error ring-2 ring-error/20" : ""}`}
                      value={inventoryUser.email}
                      onChange={onChangeHandler}
                    />
                    {errors.email && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.email}</p>}
                  </div>

                  <div className="form-control relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className={`input input-lg h-14 pl-12 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 placeholder:text-base-content/30 ${errors.password ? "border-error ring-2 ring-error/20" : ""}`}
                      value={inventoryUser.password}
                      onChange={onChangeHandler}
                    />
                    {errors.password && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.password}</p>}
                  </div>

                  <div className="form-control relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className={`input input-lg h-14 pl-12 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 placeholder:text-base-content/30 ${errors.confirmPassword ? "border-error ring-2 ring-error/20" : ""}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.confirmPassword}</p>}
                  </div>

                  <div className="form-control md:col-span-2">
                    <select
                      name="role"
                      className={`select select-lg h-14 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 ${errors.role ? "border-error ring-2 ring-error/20" : ""}`}
                      value={inventoryUser.role}
                      onChange={onChangeHandler}
                    >
                      <option value="" disabled>Select a Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Vendor">Vendor</option>
                    </select>
                    {errors.role && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.role}</p>}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    Register Now
                  </button>
                  <button type="button" className="btn btn-outline flex-1" onClick={() => navigate('/')}>
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 16s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterUser;