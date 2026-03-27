import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUser } from "../../Services/LoginService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const onChangeHandler = (event) => {
    setFlag(true);
    const { name, value } = event.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    if (!loginData.username.trim()) tempErrors.username = "Required";
    if (!loginData.password.trim()) tempErrors.password = "Required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await validateUser(loginData.username, loginData.password);
      const role = String(response.data);
      const routes = { "Admin": "/admin-menu", "Manager": "/manager-menu", "Vendor": "/vendor-menu" };
      if (routes[role]) navigate(routes[role]);
      else setFlag(false);
    } catch (error) {
      setFlag(false);
    } finally {
      setLoading(false);
    }
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

      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-md bg-base-100/30 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-sm opacity-70 mt-2">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                  value={loginData.username}
                  onChange={onChangeHandler}
                />
                {errors.username && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.username}</p>}
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
                  placeholder="Access Key"
                  className={`input input-lg h-14 pl-12 bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 placeholder:text-base-content/30 ${errors.password ? "border-error ring-2 ring-error/20" : ""}`}
                  value={loginData.password}
                  onChange={onChangeHandler}
                />
                {errors.password && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.password}</p>}
              </div>

              {!flag && (
                <div className="flex items-center justify-center gap-2 text-error text-xs font-medium bg-error/10 py-2 px-4 rounded-full animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Invalid Access Credentials
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 border-none gap-2 ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {!loading && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
                {loading ? "Authenticating..." : "Initialize Session"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs opacity-60">
                New Operator?
                <span
                  onClick={() => navigate('/register')}
                  className="text-primary font-semibold cursor-pointer hover:underline ml-2 transition-all duration-200 inline-flex items-center gap-1"
                >
                  Request ID
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </p>
            </div>
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

export default LoginPage;