import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface ImportExcelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ExcelRowData {
  [key: string]: any;
}

export const ImportExcelDialog: React.FC<ImportExcelDialogProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus('idle');
      setErrorMessage('');
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const mapExcelDataToDatabase = (excelData: ExcelRowData[]): any[] => {
    return excelData.map((row) => ({
      user_id: user?.id,
      Index: row['Index'] || null,
      Rank: row['Rank'] || null,
      'Previous Rank': row['Previous Rank'] || null,
      Name: row['Name'] || null,
      'Country/Territory': row['Country/Territory'] || null,
      Region: row['Region'] || null,
      Size: row['Size'] || null,
      Focus: row['Focus'] || null,
      Research: row['Research'] || null,
      Status: row['Status'] || null,
      'AR SCORE': row['AR SCORE'] || null,
      'AR RANK': row['AR RANK'] || null,
      'ER SCORE': row['ER SCORE'] || null,
      'ER RANK': row['ER RANK'] || null,
      'FSR SCORE': row['FSR SCORE'] || null,
      'FSR RANK': row['FSR RANK'] || null,
      'CPF SCORE': row['CPF SCORE'] || null,
      'CPF RANK': row['CPF RANK'] || null,
      'IFR SCORE': row['IFR SCORE'] || null,
      'IFR RANK': row['IFR RANK'] || null,
      'ISR SCORE': row['ISR SCORE'] || null,
      'ISR RANK': row['ISR RANK'] || null,
      'ISD SCORE': row['ISD SCORE'] || null,
      'ISD RANK': row['ISD RANK'] || null,
      'IRN SCORE': row['IRN SCORE'] || null,
      'IRN RANK': row['IRN RANK'] || null,
      'EO SCORE': row['EO SCORE'] || null,
      'EO RANK': row['EO RANK'] || null,
      'SUS SCORE': row['SUS SCORE'] || null,
      'SUS RANK': row['SUS RANK'] || null,
      'Overall SCORE': row['Overall SCORE'] || null,
      Column2: row['Column2'] || null,
      Rank_Duplicate: row['Rank_Duplicate'] || row['Rank'] || null,
    }));
  };

  const handleImport = async () => {
    if (!selectedFile || !user) {
      setErrorMessage('Please select a file and ensure you are logged in');
      return;
    }

    setIsImporting(true);
    setImportStatus('idle');
    setErrorMessage('');

    try {
      // Read the Excel file
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON, starting from row 4 (headers) and data from row 5
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        range: 3, // Start from row 4 (0-indexed, so 3)
        header: 1, // Use first row as headers
        defval: null, // Default value for empty cells
      });

      if (jsonData.length < 2) {
        throw new Error('Excel file must contain headers and at least one data row');
      }

      // Extract headers and data
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1) as any[][];

      // Convert to objects with proper headers
      const excelData: ExcelRowData[] = dataRows.map((row) => {
        const obj: ExcelRowData = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      // Filter out empty rows
      const validData = excelData.filter((row) => 
        Object.values(row).some(value => value !== null && value !== undefined && value !== '')
      );

      if (validData.length === 0) {
        throw new Error('No valid data found in the Excel file');
      }

      // Map to database format
      const mappedData = mapExcelDataToDatabase(validData);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('university_excel_data')
        .insert(mappedData)
        .select();

      if (error) {
        throw error;
      }

      setImportedCount(data?.length || 0);
      setImportStatus('success');
      onImportSuccess();
    } catch (error: any) {
      console.error('Import error:', error);
      setErrorMessage(error.message || 'Failed to import Excel file');
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportStatus('idle');
    setErrorMessage('');
    setImportedCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Import Excel File
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div className="text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx,.xls"
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <FileSpreadsheet className="h-5 w-5" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-400 transition-colors duration-200">
                  <FileSpreadsheet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium mb-2">Select Excel file to import</p>
                  <p className="text-sm text-slate-500">Supports .xlsx and .xls files</p>
                </div>
              )}

              <button
                onClick={handleChooseFile}
                className="mt-4 flex items-center space-x-2 px-6 py-3 border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md mx-auto"
              >
                <Upload className="h-4 w-4" />
                <span>{selectedFile ? 'Choose Different File' : 'Choose File'}</span>
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {importStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-green-900">Import Successful!</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Successfully imported {importedCount} records to the database.
                  </p>
                </div>
              </div>
            </div>
          )}

          {importStatus === 'error' && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Import Failed</h4>
                  <p className="text-sm text-red-800 mt-1">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Import Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Import Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Headers should be in row 4 of the Excel file</li>
              <li>• Data should start from row 5</li>
              <li>• Use the sample Excel format for best results</li>
              <li>• Empty rows will be automatically filtered out</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};