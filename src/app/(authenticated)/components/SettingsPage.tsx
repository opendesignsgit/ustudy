"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/Auth';

interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  selfControl: boolean;
}

interface Privilege {
  collection: string;
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  selfControl?: boolean;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  privileges: Privilege[];
}

export const SettingsPage: React.FC = () => {
  const { user, userType } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Define available collections based on the payload config
  const availableCollections = [
    'users',
    'roles',
    'universities',
    'university-pages',
    'students',
    'courses',
    'bookings',
    'posts',
    'pages',
    'media',
    'categories'
  ];

  useEffect(() => {
    // Check if user has permission to access settings
    if (userType !== 'university' && user?.role !== 'admin') {
      return;
    }

    loadRolesAndPermissions();
  }, [user, userType]);

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      
      // Fetch roles from the API
      const response = await fetch('/api/roles', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const rolesData = await response.json();
        setRoles(rolesData.docs || []);
      } else {
        setMessage('Error loading roles from server');
      }
      
      setCollections(availableCollections);
    } catch (error) {
      console.error('Error loading roles and permissions:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = (roleIndex: number, collection: string, permission: keyof Permission, value: boolean) => {
    const updatedRoles = [...roles];
    const role = updatedRoles[roleIndex];
    
    // Find or create the privilege for this collection
    let privilege = role.privileges.find(p => p.collection === collection);
    if (!privilege) {
      privilege = { collection };
      role.privileges.push(privilege);
    }
    
    // Update the specific permission
    privilege[permission] = value;
    
    setRoles(updatedRoles);
  };

  const getPermissionValue = (role: Role, collection: string, permission: keyof Permission): boolean => {
    const privilege = role.privileges.find(p => p.collection === collection);
    return privilege?.[permission] || false;
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      setMessage('');

      // Save each role to the server
      for (const role of roles) {
        const response = await fetch(`/api/roles/${role.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            privileges: role.privileges,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save role ${role.name}`);
        }
      }
      
      setMessage('Permissions saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving permissions:', error);
      setMessage('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  // Check if user has access to settings
  if (userType !== 'university' && user?.role !== 'admin') {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You don't have permission to access settings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Settings - Roles & Access</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Settings - Roles & Access</h2>
        <div className="space-x-2">
          <button
            onClick={loadRolesAndPermissions}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={savePermissions}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role / Collection
                </th>
                {collections.map(collection => (
                  <th key={collection} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {collection}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role, roleIndex) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div>
                      <div className="font-semibold">{role.name}</div>
                      {role.description && (
                        <div className="text-xs text-gray-500">{role.description}</div>
                      )}
                    </div>
                  </td>
                  {collections.map(collection => (
                    <td key={collection} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={getPermissionValue(role, collection, 'view')}
                            onChange={(e) => updatePermission(roleIndex, collection, 'view', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">View</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={getPermissionValue(role, collection, 'create')}
                            onChange={(e) => updatePermission(roleIndex, collection, 'create', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Create</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={getPermissionValue(role, collection, 'edit')}
                            onChange={(e) => updatePermission(roleIndex, collection, 'edit', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Edit</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={getPermissionValue(role, collection, 'delete')}
                            onChange={(e) => updatePermission(roleIndex, collection, 'delete', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Delete</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={getPermissionValue(role, collection, 'selfControl')}
                            onChange={(e) => updatePermission(roleIndex, collection, 'selfControl', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs text-blue-600">Self-Control</span>
                        </label>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Permission Types:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>View:</strong> Show collection in admin panel/nav only if this is enabled for user's role</li>
          <li><strong>Create:</strong> Allow action only if corresponding privilege is enabled</li>
          <li><strong>Edit:</strong> Allow action only if corresponding privilege is enabled</li>
          <li><strong>Delete:</strong> Allow action only if corresponding privilege is enabled</li>
          <li><strong>Self-Control:</strong> Restrict access to entries created by (or assigned to) the logged-in user. Combine with other privileges as needed</li>
        </ul>
      </div>
    </div>
  );
};