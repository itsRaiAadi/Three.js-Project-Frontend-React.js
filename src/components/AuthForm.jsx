function AuthForm({ type, form, error, loading, onChange, onSubmit }) {
  const isRegister = type === "register";

  return (
    <section className="auth-card">
      <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
      <p className="muted">
        {isRegister
          ? "Register to upload and manage 3D models."
          : "Login to continue to your 3D dashboard."}
      </p>

      <form onSubmit={onSubmit} className="form">
        {isRegister && (
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Enter email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Enter password"
            minLength="6"
            required
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
