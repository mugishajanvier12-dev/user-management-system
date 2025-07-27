import { useState, useEffect } from "react";
import { Search, Filter, Trash, Edit, PlusCircle } from "lucide-react";
import SidebarStockForm from './SidebarStockForm';
import axios from "axios";

const StockManagement = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch stock items on component mount
  useEffect(() => {
    fetchStockItems();
  }, []);

  const fetchStockItems = () => {
    axios.get("http://localhost:5000/stock")
      .then(response => setStockItems(response.data))
      .catch(error => console.error("Error fetching stock:", error));
  };

  const handleFormSubmit = (data) => {
    if (selectedItem) {
      // Update stock item
      axios.put(`http://localhost:5000/stock/${selectedItem.id}`, data)
        .then(() => {
          fetchStockItems();
          setSidebarOpen(false);
          setSelectedItem(null);
        })
        .catch(error => console.error("Error updating stock item:", error));
    } else {
      // Add new stock item
      axios.post("http://localhost:5000/stock", data)
        .then(() => {
          fetchStockItems();
          setSidebarOpen(false);
        })
        .catch(error => console.error("Error adding stock item:", error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://localhost:5000/stock/${id}`)
        .then(() => fetchStockItems())
        .catch(error => console.error("Error deleting stock item:", error));
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setSidebarOpen(true);
  };

  // Filter stock items based on search and filters
  const filteredStock = stockItems.filter((item) => {
    return (
      (categoryFilter === "All" || item.category === categoryFilter) &&
      (departmentFilter === "All" || item.department === departmentFilter) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Stock Management</h1>

      {/* Filters and Search */}
      <div className="flex flex-wrap justify-between mb-6 space-x-6">
        <div className="bg-white shadow-lg rounded-lg p-4 w-full md:w-72">
          <label className="text-gray-700 font-semibold">Category</label>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-500" />
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {["All", "Electronics", "Furniture", "Stationery"].map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 w-full md:w-72">
          <label className="text-gray-700 font-semibold">Department</label>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-500" />
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {["All", "IT", "HR", "Admin", "Operations"].map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 w-full md:w-80 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search stock items..."
            className="p-2 w-full border rounded-lg focus:ring-2 focus:outline-none border-gray-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSidebarOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <PlusCircle className="mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Sidebar Form */}
      <SidebarStockForm
        isOpen={isSidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
      />

      {/* Stock Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="table-auto w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item) => (
              <tr key={item.id} className="text-gray-600 hover:bg-gray-50 cursor-pointer">
                <td className="border px-6 py-4">{item.name}</td>
                <td className="border px-6 py-4">{item.category}</td>
                <td className="border px-6 py-4">{item.department}</td>
                <td className="border px-6 py-4">{item.quantity}</td>
                <td className="border px-6 py-4 flex space-x-3">
                  <Edit className="text-blue-600 cursor-pointer" onClick={() => handleEdit(item)} />
                  <Trash className="text-red-600 cursor-pointer" onClick={() => handleDelete(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
