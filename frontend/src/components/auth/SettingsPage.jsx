const SettingsPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();
  
    const validatePassword = (password) => {
      return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);
    };
  
    const handleChangePassword = async (e) => {
      e.preventDefault();
  
      if (!validatePassword(newPassword)) {
        alert("Password must be 8-16 characters, include at least one uppercase letter and one special character.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match.");
        return;
      }
  
      try {
        const response = await fetch("/api/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Password changed successfully");
          navigate("/user");
        } else {
          alert(data.message || "Password change failed");
        }
      } catch (error) {
        console.error("Error changing password:", error);
        alert("An error occurred. Please try again.");
      }
    };
  
    return (
      <div>
        <h2>Settings</h2>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    );
  };
  
  export default SettingsPage;