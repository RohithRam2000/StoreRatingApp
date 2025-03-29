const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
  
    const validateEmail = (email) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };
  
    const validatePassword = (password) => {
      return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);
    };
  
    const handleSignup = async (e) => {
      e.preventDefault();
  
      if (name.length < 20 || name.length > 60) {
        alert("Name must be between 20 and 60 characters.");
        return;
      }
      if (!validateEmail(email)) {
        alert("Invalid email format.");
        return;
      }
      if (!validatePassword(password)) {
        alert("Password must be 8-16 characters, include at least one uppercase letter and one special character.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (address.length > 400) {
        alert("Address cannot exceed 400 characters.");
        return;
      }
  
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, address }),
        });
        const data = await response.json();
        if (response.ok) {
          navigate("/login");
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (error) {
        console.error("Error signing up:", error);
        alert("An error occurred. Please try again.");
      }
    };
  
    return (
      <div>
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  };
  
  export default SignupPage;
  