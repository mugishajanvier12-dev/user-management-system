import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash } from "lucide-react";
import SidebarForm from './sidebarForm';
import axios from "axios";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  useEffect(() => {
    axios.get('http://localhost:5000/getUser')
      .then(res => {
        setStaff(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/removeUser/${id}`)
      .then(res => {
        setStaff(staff.filter(s => s.staffID !== id));
      })
      .catch(err => console.log(err));
  };

  // Open Modal and Set Selected Staff Data
  const openModal = (staff) => {
    setSelectedStaff(staff);
    setModalOpen(true);
  };

  // Handle Form Submission for Update
  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/updateUser/${selectedStaff.staffID}`, selectedStaff)
      .then(res => {
        setStaff(staff.map(s => s.staffID === selectedStaff.staffID ? selectedStaff : s));
        setModalOpen(false);
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Staff Management</h1>

      {/* Add Staff Button */}
      <button onClick={() => setSidebarOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mb-4">
        <PlusCircle className="mr-2" />
        Add Staff
      </button>
      <SidebarForm isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Staff List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((r) => (
                <tr key={r.staffID} className="border-b hover:bg-gray-50 text-gray-600">
                  <td className="px-4 py-2">{r.Name}</td>
                  <td className="px-4 py-2">{r.Role}</td>
                  <td className="px-4 py-2">{r.Departement}</td>
                  <td className="px-4 py-2">{r.Email}</td>
                  <td className="px-4 py-2">{r.Phone}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => openModal(r)}>
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(r.staffID)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Staff</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={selectedStaff.Name}
                onChange={(e) => setSelectedStaff({ ...selectedStaff, Name: e.target.value })}
                placeholder="Name"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                value={selectedStaff.Role}
                onChange={(e) => setSelectedStaff({ ...selectedStaff, Role: e.target.value })}
                placeholder="Role"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                value={selectedStaff.Departement}
                onChange={(e) => setSelectedStaff({ ...selectedStaff, Departement: e.target.value })}
                placeholder="Department"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="email"
                value={selectedStaff.Email}
                onChange={(e) => setSelectedStaff({ ...selectedStaff, Email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                value={selectedStaff.Phone}
                onChange={(e) => setSelectedStaff({ ...selectedStaff, Phone: e.target.value })}
                placeholder="Phone"
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
