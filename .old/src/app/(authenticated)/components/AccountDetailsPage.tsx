import React, { useState, useEffect } from 'react';

export default function AccountDetails() {
  const [editing, setEditing] = useState(false);
  const [account, setAccount] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
  });
  const [formData, setFormData] = useState(account);

  useEffect(() => {
    // Fetch current customer data when the component mounts
    const fetchCustomerData = async () => {
      try {
        const response = await fetch('/api/students/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccount(data);
          setFormData(data);
        } else {
          console.error('Failed to fetch customer data');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/students/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAccount(updatedData);
        setEditing(false);
      } else {
        console.error('Failed to update customer data');
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">
              Name:
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1">
              Email:
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1">
              Current Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1">
              New Password:
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="border p-1 ml-2"
              />
            </label>
          </div>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {account.name}
          </p>
          <p>
            <strong>Email:</strong> {account.email}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}