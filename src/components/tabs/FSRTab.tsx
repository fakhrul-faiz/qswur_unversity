import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, Info } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { FSRFormData, CalculationResult } from '../../types';

const fsrSchema = z.object({
  total_academic_staff: z.number().min(1, 'Must be at least 1'),
  total_students: z.number().min(1, 'Must be at least 1'),
});

export const FSRTab: React.FC = () => {
  const { fsrData, setFsrData, fsrResult, setFsrResult } = useDataStore();
  const currentFsrDataRef = useRef(fsrData);
  
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FSRFormData>({
    resolver: zodResolver(fsrSchema),
    defaultValues: fsrData,
  });

  const watchedData = watch();

  // Update ref when store data changes
  useEffect(() => {
    currentFsrDataRef.current = fsrData;
  }, [fsrData]);

  useEffect(() => {
    if (
      watchedData.total_academic_staff !== currentFsrDataRef.current.total_academic_staff ||
      watchedData.total_students !== currentFsrDataRef.current.total_students
    ) {
      setFsrData(watchedData);
    }
  }, [watchedData.total_academic_staff, watchedData.total_students, setFsrData]);

  useEffect(() => {
    if (watchedData.total_academic_staff && watchedData.total_students) {
      const ratio = watchedData.total_students / watchedData.total_academic_staff;
      const percentage = (watchedData.total_academic_staff / watchedData.total_students) * 100;
      // FSR Score calculation (inverse relationship - lower ratio is better)
      const score = Math.max(0, Math.min(100, (20 / ratio) * 100));
      
      const result: CalculationResult = {
        ratio: Math.round(ratio * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        score: Math.round(score * 100) / 100,
      };
      
      setFsrResult(result);
    } else {
      setFsrResult(null);
    }
  }, [watchedData.total_academic_staff, watchedData.total_students, setFsrResult]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Faculty-Student Ratio
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Calculate the faculty-to-student ratio for your university
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label htmlFor="total_academic_staff" className="block text-sm font-semibold text-slate-700">
                Total Academic Staff
              </label>
              <input
                {...register('total_academic_staff', { valueAsNumber: true })}
                type="number"
                min="1"
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter total academic staff"
              />
              {errors.total_academic_staff && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.total_academic_staff.message}</p>
              )}
            </div>

            <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label htmlFor="total_students" className="block text-sm font-semibold text-slate-700">
                Total Students
              </label>
              <input
                {...register('total_students', { valueAsNumber: true })}
                type="number"
                min="1"
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter total students"
              />
              {errors.total_students && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.total_students.message}</p>
              )}
            </div>

            {/* Formula Explanation */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Calculation Formula</h4>
                  <div className="mt-3 text-sm text-blue-800 font-medium space-y-1">
                    <p><strong>Ratio:</strong> Students ÷ Academic Staff</p>
                    <p><strong>Percentage:</strong> (Academic Staff ÷ Students) × 100</p>
                    <p><strong>Score:</strong> (20 ÷ Ratio) × 100 (capped at 100)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Calculation Results
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Real-time FSR calculations
            </p>
          </div>

          <div className="p-8">
            {fsrResult ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Student-Faculty Ratio</span>
                      <span className="text-3xl font-extrabold text-indigo-700">{fsrResult.ratio}:1</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Faculty Percentage</span>
                      <span className="text-3xl font-extrabold text-emerald-700">{fsrResult.percentage}%</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">FSR Score</span>
                      <span className="text-3xl font-extrabold text-purple-700">{fsrResult.score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">FSR Score Progress</span>
                    <span className="text-slate-600 font-medium">{fsrResult.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.min(fsrResult.score, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">No Data Yet</h3>
                <p className="mt-2 text-sm text-slate-600 font-medium">
                  Enter academic staff and student numbers to see calculations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};