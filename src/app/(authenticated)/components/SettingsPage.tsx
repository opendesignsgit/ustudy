"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/Auth';

interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  selfControl: boolean;
}

interface RolePermissions {
  [collectionName: string]: Permission;
}

interface Role {
  name: string;
  permissions: RolePermissions;
}

export const SettingsPage: React.FC = () => {
  const { user, userType } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Define available collections
  const availableCollections = [
    'users',
    'universities',
    'university-pages',
    'students',
    'courses',
    'bookings',
    'posts',
    'media',
    'categories'
  ];

  // Define available roles
  const availableRoles = ['admin', 'editor', 'university-role', 'post-editor'];

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
      
      // Initialize default role permissions
      const defaultRoles: Role[] = availableRoles.map(roleName => ({
        name: roleName,
        permissions: availableCollections.reduce((acc, collection) => {
          acc[collection] = {
            create: false,
            read: false,
            update: false,
            delete: false,
            selfControl: false
          };
          return acc;
        }, {} as RolePermissions)
      }));

      // Set default permissions based on role
      defaultRoles.forEach(role => {
        switch (role.name) {
          case 'admin':
            // Admin has full access to everything
            Object.keys(role.permissions).forEach(collection => {
              role.permissions[collection] = {
                create: true,
                read: true,
                update: true,
                delete: true,
                selfControl: true
              };
            });
            break;
          
          case 'university-role':
            // University role can manage their own university and related pages
            role.permissions['universities'] = {
              create: false,
              read: true,
              update: true,
              delete: false,
              selfControl: true
            };
            role.permissions['university-pages'] = {
              create: true,
              read: true,
              update: true,
              delete: true,
              selfControl: true
            };
            role.permissions['media'] = {
              create: true,
              read: true,
              update: true,
              delete: true,
              selfControl: true
            };
            break;
          
          case 'editor':
            // Editor can manage posts and media
            role.permissions['posts'] = {
              create: true,
              read: true,
              update: true,
              delete: true,
              selfControl: false
            };
            role.permissions['media'] = {
              create: true,
              read: true,
              update: true,
              delete: true,
              selfControl: false
            };
            role.permissions['categories'] = {
              create: true,
              read: true,
              update: true,
              delete: true,
              selfControl: false
            };
            break;
          
          case 'post-editor':
            // Post editor can only manage posts
            role.permissions['posts'] = {
              create: true,
              read: true,
              update: true,
              delete: false,
              selfControl: false
            };
            break;
        }
      });

      setRoles(defaultRoles);
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
    updatedRoles[roleIndex].permissions[collection][permission] = value;
    setRoles(updatedRoles);
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      setMessage('');

      // Here you would typically save to backend
      // For now, we'll just simulate saving to localStorage
      localStorage.setItem('rolePermissions', JSON.stringify(roles));
      
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
        <button
          onClick={savePermissions}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
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
                <tr key={role.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.name}
                  </td>
                  {collections.map(collection => (
                    <td key={collection} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={role.permissions[collection]?.create || false}
                            onChange={(e) => updatePermission(roleIndex, collection, 'create', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Create</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={role.permissions[collection]?.read || false}
                            onChange={(e) => updatePermission(roleIndex, collection, 'read', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Read</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={role.permissions[collection]?.update || false}
                            onChange={(e) => updatePermission(roleIndex, collection, 'update', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Update</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={role.permissions[collection]?.delete || false}
                            onChange={(e) => updatePermission(roleIndex, collection, 'delete', e.target.checked)}
                            className="mr-1 h-3 w-3"
                          />
                          <span className="text-xs">Delete</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={role.permissions[collection]?.selfControl || false}
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
          <li><strong>Create:</strong> Permission to create new records</li>
          <li><strong>Read:</strong> Permission to view records</li>
          <li><strong>Update:</strong> Permission to modify records</li>
          <li><strong>Delete:</strong> Permission to delete records</li>
          <li><strong>Self-Control:</strong> Permission to manage only their own data (e.g., universities can manage their own page)</li>
        </ul>
      </div>
    </div>
  );
};