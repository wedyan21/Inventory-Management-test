import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { InventoryItem, CreateItemData } from '../../types';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';

interface ItemFormProps {
  item?: InventoryItem | null;
  onClose: () => void;
  onSave: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<CreateItemData>();

  const qty = watch('qty', 0);
  const quantitySold = watch('quantity_sold', 0);

  useEffect(() => {
    if (item) {
      reset({
        item_no: item.item_no || '',
        company_name: item.company_name || '',
        name: item.name,
        piece_type: item.piece_type,
        office: item.office,
        qty: item.qty,
        quantity_sold: item.quantity_sold,
        exit_date: item.exit_date || '',
        image_path: item.image_path || '',
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: CreateItemData) => {
    try {
      const itemData = {
        ...data,
        exit_date: data.exit_date || null,
        image_path: data.image_path || null,
      };

      if (item) {
        // Update existing item
        await apiClient.updateItem(item.id, itemData);
        toast.success('Item updated successfully');
      } else {
        // Create new item
        await apiClient.createItem(itemData);
        toast.success('Item created successfully');
      }

      onSave();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Number
              </label>
              <input
                {...register('item_no')}
                type="text"
                className="input-field"
                placeholder="Enter item number (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                {...register('company_name', { required: 'Company name is required' })}
                type="text"
                className="input-field"
                placeholder="Enter company name"
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                {...register('name', { required: 'Item name is required' })}
                type="text"
                className="input-field"
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Piece Type *
              </label>
              <select
                {...register('piece_type', { required: 'Piece type is required' })}
                className="input-field"
              >
                <option value="">Select piece type</option>
                <option value="Piece">Piece</option>
                <option value="Box">Box</option>
                <option value="Pack">Pack</option>
                <option value="Packet">Packet</option>
                <option value="Dozen">Dozen</option>
                <option value="Carton">Carton</option>
                <option value="Kg">Kg (Kilogram)</option>
                <option value="g">g (Gram)</option>
                <option value="Litre">Litre</option>
                <option value="ml">ml (Millilitre)</option>
                <option value="Meter">Meter</option>
                <option value="Roll">Roll</option>
                <option value="Set">Set</option>
                <option value="Bundle">Bundle</option>
                <option value="Case">Case</option>
                <option value="Pair">Pair</option>
                <option value="Tube">Tube</option>
                <option value="Bottle">Bottle</option>
                <option value="Can">Can</option>
              </select>
              {errors.piece_type && (
                <p className="mt-1 text-sm text-red-600">{errors.piece_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office *
              </label>
              <input
                {...register('office', { required: 'Office is required' })}
                type="text"
                className="input-field"
                placeholder="Enter office location"
              />
              {errors.office && (
                <p className="mt-1 text-sm text-red-600">{errors.office.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Quantity *
              </label>
              <input
                {...register('qty', { 
                  required: 'Quantity is required',
                  min: { value: 0, message: 'Quantity must be positive' }
                })}
                type="number"
                className="input-field"
                placeholder="Enter total quantity"
              />
              {errors.qty && (
                <p className="mt-1 text-sm text-red-600">{errors.qty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Sold
              </label>
              <input
                {...register('quantity_sold', { 
                  min: { value: 0, message: 'Quantity sold must be positive' }
                })}
                type="number"
                className="input-field"
                placeholder="Enter quantity sold"
                defaultValue={0}
              />
              {errors.quantity_sold && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity_sold.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remaining Quantity
              </label>
              <input
                type="number"
                value={qty - quantitySold}
                className="input-field bg-gray-100"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                Automatically calculated: Total - Sold
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit Date
              </label>
              <input
                {...register('exit_date')}
                type="date"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Path
            </label>
            <input
              {...register('image_path')}
              type="text"
              className="input-field"
              placeholder="Enter image path (optional)"
            />
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
              {isSubmitting ? 'Saving...' : (item ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;