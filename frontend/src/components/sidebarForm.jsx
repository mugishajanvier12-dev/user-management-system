import axios from "axios";
import { useState, useEffect } from "react";

const SidebarForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
  });
  const [users, setUsers] = useState([]); // Store users in local state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    fetchUsers(); // Load users when the component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/createUser", formData);
      setFormData({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
      });
      console.log("User created successfully", res.data);
      fetchUsers(); // Refresh the user list
      onClose(); // Close the sidebar after successful submission
    } catch (err) {
      console.error("Error creating user", err);
      setError("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Add Staff</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition duration-200"
          aria-label="Close Sidebar"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            placeholder="e.g., IT"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            placeholder="example@domain.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            placeholder="+1234567890"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SidebarForm;
