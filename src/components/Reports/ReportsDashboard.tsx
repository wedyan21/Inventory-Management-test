import React, { useState, useEffect } from 'react';
import { BarChart3, Package, TrendingDown, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { ReportData } from '../../types';
import { apiClient } from '../../lib/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const ReportsDashboard: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const data = await apiClient.getReports();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const workbook = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      { Metric: 'Total Items', Value: reportData.totalItems },
      { Metric: 'Total Quantity', Value: reportData.totalQuantity },
      { Metric: 'Total Sold', Value: reportData.totalSold },
      { Metric: 'Total Remaining', Value: reportData.totalRemaining }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Low Stock Items Sheet
    if (reportData.lowStockItems.length > 0) {
      const lowStockData = reportData.lowStockItems.map(item => ({
        'Item No': item.item_no || '',
        'Company Name': item.company_name || '',
        'Item Name': item.name,
        'Type': item.piece_type,
        'Office': item.office,
        'Remaining Qty': item.remaining_qty,
        'Total Qty': item.qty,
        'Quantity Sold': item.quantity_sold
      }));
      const lowStockSheet = XLSX.utils.json_to_sheet(lowStockData);
      XLSX.utils.book_append_sheet(workbook, lowStockSheet, 'Low Stock Items');
    }
    
    // Recent Exits Sheet
    if (reportData.recentExits.length > 0) {
      const recentExitsData = reportData.recentExits.map(item => ({
        'Item No': item.item_no || '',
        'Company Name': item.company_name || '',
        'Item Name': item.name,
        'Type': item.piece_type,
        'Office': item.office,
        'Exit Date': item.exit_date ? new Date(item.exit_date).toLocaleDateString() : '',
        'Quantity Sold': item.quantity_sold,
        'Remaining Qty': item.remaining_qty
      }));
      const recentExitsSheet = XLSX.utils.json_to_sheet(recentExitsData);
      XLSX.utils.book_append_sheet(workbook, recentExitsSheet, 'Recent Exits');
    }
    
    const fileName = `inventory_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load report data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
        <button
          onClick={exportToExcel}
          className="btn-primary flex items-center space-x-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Quantity</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData.totalQuantity}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sold</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData.totalSold}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Remaining</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData.totalRemaining}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {reportData.lowStockItems.length > 0 && (
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="space-y-2">
            {reportData.lowStockItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.office}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {item.remaining_qty} remaining
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Exits */}
      {reportData.recentExits.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Exits (Last 30 days)</h2>
          <div className="space-y-2">
            {reportData.recentExits.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.office}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {item.exit_date ? new Date(item.exit_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Status Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Stock</span>
            <span className="text-sm text-gray-900">{reportData.totalQuantity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: '100%' }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Sold</span>
            <span className="text-sm text-gray-900">{reportData.totalSold}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ 
                width: `${reportData.totalQuantity > 0 ? (reportData.totalSold / reportData.totalQuantity) * 100 : 0}%` 
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Remaining</span>
            <span className="text-sm text-gray-900">{reportData.totalRemaining}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full" 
              style={{ 
                width: `${reportData.totalQuantity > 0 ? (reportData.totalRemaining / reportData.totalQuantity) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;