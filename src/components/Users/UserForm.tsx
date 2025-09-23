import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { User } from '../../types';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

interface UserFormData {
  username: string;
  password?: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
  onSave: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<UserFormData>();

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        role: user.role,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (user) {
        // Update existing user role
        await apiClient.updateUser(user.id, { role: data.role });
        toast.success('User updated successfully');
      } else {
        // Create new user
        await apiClient.createUser({
          username: data.username,
          password: data.password,
          role: data.role,
        });
        toast.success('User created successfully');
      }

      onSave();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              {...register('username', { 
                required: 'Username is required'
              })}
              type="text"
              className="input-field"
              placeholder="Enter username"
              disabled={!!user}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                {...register('password', { 
                  required: !user ? 'Password is required' : false,
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                className="input-field"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="input-field"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-1">Role Permissions:</p>
            <ul className="space-y-1">
              <li><strong>Admin:</strong> Full access to all features</li>
              <li><strong>Editor:</strong> Can manage inventory and generate reports</li>
              <li><strong>Viewer:</strong> Can only view inventory items</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Saving...' : (user ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;