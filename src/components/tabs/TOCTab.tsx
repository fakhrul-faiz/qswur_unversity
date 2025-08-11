import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Download, FileText, Upload, Database, Loader2 } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { TOCFormData } from '../../types';
import { createSampleExcelFile } from '../../utils/createSampleExcel';
import { ImportExcelDialog } from '../modals/ImportExcelDialog';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const tocSchema = z.object({
  academic_reputation: z.number().min(0).max(100),
  employer_reputation: z.number().min(0).max(100),
  faculty_student_ratio: z.number().min(0).max(100),
  citations_per_faculty: z.number().min(0).max(100),
  international_faculty: z.number().min(0).max(100),
  international_students: z.number().min(0).max(100),
  international_students_diversity: z.number().min(0).max(100),
  international_research_network: z.number().min(0).max(100),
  employment_outcomes: z.number().min(0).max(100),
  sustainability: z.number().min(0).max(100),
  size: z.string(),
  focus: z.string(),
  research: z.string(),
  status: z.string(),
  ranking: z.number().min(1),
});

const indicators = [
  { key: 'academic_reputation', label: 'Academic Reputation' },
  { key: 'employer_reputation', label: 'Employer Reputation' },
  { key: 'faculty_student_ratio', label: 'Faculty Student Ratio' },
  { key: 'citations_per_faculty', label: 'Citations Per Faculty' },
  { key: 'international_faculty', label: 'International Faculty' },
  { key: 'international_students', label: 'International Students' },
  { key: 'international_students_diversity', label: 'International Students Diversity' },
  { key: 'international_research_network', label: 'International Research Network' },
  { key: 'employment_outcomes', label: 'Employment Outcomes' },
  { key: 'sustainability', label: 'Sustainability' },
];

const classifications = {
  size: ['S', 'M', 'L', 'XL'],
  focus: ['CO', 'FC', 'FO', 'SP'],
  research: ['HI', 'LO', 'ND','VH'],
  status: ['Public', 'Private for Profit', 'Private for Non-Profit'],
};

export const TOCTab: React.FC = () => {
  const { tocData, setTocData } = useDataStore();
  const { user } = useAuthStore();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoadingUTHM, setIsLoadingUTHM] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TOCFormData>({
    resolver: zodResolver(tocSchema),
    defaultValues: tocData,
  });

  const watchedData = watch();

  useEffect(() => {
    Object.entries(tocData).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key as keyof TOCFormData, value);
      }
    });
  }, [tocData, setValue]);

  const onSubmit = (data: TOCFormData) => {
    setTocData(data);
    console.log('Saving TOC data:', data);
  };

  const handleImportSuccess = () => {
    setIsImportModalOpen(false);
    // Optionally refresh data or show success message
    console.log('Excel data imported successfully');
  };

  const loadUthmData = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    setIsLoadingUTHM(true);

    try {
      const { data, error } = await supabase
        .from('university_excel_data')
        .select('*')
        .eq('Name', 'Universiti Tun Hussein Onn University of Malaysia (UTHM)')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.error('No UTHM data found in database');
          alert('No data found for Universiti Tun Hussein Onn University of Malaysia (UTHM)');
        } else {
          throw error;
        }
        return;
      }

      if (data) {
        // Map database columns to form fields with proper type conversion
        const mappedData: Partial<TOCFormData> = {
          // Indicators - convert string values back to numbers
          academic_reputation: parseFloat(data['AR SCORE'] || '0'),
          employer_reputation: parseFloat(data['ER SCORE'] || '0'),
          faculty_student_ratio: parseFloat(data['FSR SCORE'] || '0'),
          citations_per_faculty: parseFloat(data['CPF SCORE'] || '0'),
          international_faculty: parseFloat(data['IFR SCORE'] || '0'),
          international_students: parseFloat(data['ISR SCORE'] || '0'),
          international_students_diversity: parseFloat(data['ISD SCORE'] || '0'),
          international_research_network: parseFloat(data['IRN SCORE'] || '0'),
          employment_outcomes: parseFloat(data['EO SCORE'] || '0'),
          sustainability: parseFloat(data['SUS SCORE'] || '0'),
          
          // Classification - these are already strings
          size: data['Size'] || '',
          focus: data['Focus'] || '',
          research: data['Research'] || '',
          status: data['Status'] || '',
          
          // Overall - convert string values back to numbers
          ranking: parseInt(data['Rank'] || '0'),
          overall_score: parseFloat(parseFloat(data['Column2'] || '0').toFixed(2)),
        };

        // Update form fields using setValue
        Object.entries(mappedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as keyof TOCFormData, value);
          }
        });

        // Update the store
        setTocData(mappedData);

        console.log('UTHM data loaded successfully:', mappedData);
        alert('UTHM data loaded successfully!');
      }
    } catch (error: any) {
      console.error('Error loading UTHM data:', error);
      alert(`Error loading UTHM data: ${error.message}`);
    } finally {
      setIsLoadingUTHM(false);
    }
  };

  const exportToCSV = () => {
    const csv = Object.entries(watchedData)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'university-data.csv';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Table of Contents - University Data
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Enter university indicators, classification, and ranking information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          {/* Overall Ranking */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Overall Ranking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <label htmlFor="ranking" className="text-sm font-semibold text-slate-700">
                  University Ranking:
                </label>
                <input
                  {...register('ranking', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="text-4xl font-extrabold text-indigo-700 bg-white/80 border-2 border-indigo-300 rounded-xl px-6 py-3 w-48 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-lg transition-all duration-200"
                  placeholder="1"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="overall_score" className="text-sm font-semibold text-slate-700">
                  Overall Score:
                </label>
                <input
                  {...register('overall_score', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className="text-4xl font-extrabold text-purple-700 bg-white/80 border-2 border-purple-300 rounded-xl px-6 py-3 w-48 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-lg transition-all duration-200"
                  placeholder="0.0"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {errors.ranking && (
                <p className="text-sm text-red-600 font-medium">{errors.ranking.message}</p>
              )}
              {errors.overall_score && (
                <p className="text-sm text-red-600 font-medium">{errors.overall_score.message}</p>
              )}
            </div>
          </div>

          {/* Indicators Section */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Indicators (0-100%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {indicators.map((indicator) => (
                <div key={indicator.key} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label htmlFor={indicator.key} className="block text-sm font-semibold text-slate-700">
                    {indicator.label}
                  </label>
                  <input
                    {...register(indicator.key as keyof TOCFormData, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="0.0"
                  />
                  {errors[indicator.key as keyof TOCFormData] && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors[indicator.key as keyof TOCFormData]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Classification Section */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(classifications).map(([key, options]) => (
                <div key={key} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label htmlFor={key} className="block text-sm font-semibold text-slate-700 capitalize">
                    {key}
                  </label>
                  <select
                    {...register(key as keyof TOCFormData)}
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Select {key}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors[key as keyof TOCFormData] && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors[key as keyof TOCFormData]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200">
            <button
              type="button"
              onClick={loadUthmData}
              disabled={isLoadingUTHM}
              className="flex items-center space-x-2 px-6 py-3 border border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingUTHM ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span>Load UTHM Data</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <Database className="h-4 w-4" />
              <span>Import Excel</span>
            </button>
            <button
              type="button"
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={createSampleExcelFile}
              className="flex items-center space-x-2 px-6 py-3 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <FileText className="h-4 w-4" />
              <span>Download Sample Excel</span>
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Save className="h-4 w-4" />
              <span>Save Data</span>
            </button>
          </div>
        </form>

        {/* Import Excel Dialog */}
        <ImportExcelDialog
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />
      </div>
    </div>
  );
};
