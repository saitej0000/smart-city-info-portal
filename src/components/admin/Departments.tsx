import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function Departments() {
  const { token } = useAuthStore();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepartments = () => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(setDepartments);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.description) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDept)
      });

      if (res.ok) {
        setNewDept({ name: '', description: '' });
        setIsAddModalOpen(false);
        fetchDepartments();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to add department');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500">Manage city departments and services.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#3182CE] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{dept.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{dept.description}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Department</h2>

            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g., Water Works"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                  placeholder="Brief description of responsibilities..."
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newDept.name || !newDept.description}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-[#3182CE] hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
