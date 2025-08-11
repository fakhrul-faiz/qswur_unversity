import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, Info, AlertCircle } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { IFRFormData, CalculationResult } from '../../types';

const ifrSchema = z.object({
  international_staff: z.number().min(0, 'Cannot be negative'),
  total_academic_staff: z.number().min(1, 'Must be at least 1'),
}).refine(data => data.international_staff <= data.total_academic_staff, {
  message: 'International staff cannot exceed total academic staff',
  path: ['international_staff'],
});

export const IFRTab: React.FC = () => {
  const { ifrData, setIfrData, ifrResult, setIfrResult } = useDataStore();
  const currentIfrDataRef = useRef(ifrData);
  
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<IFRFormData>({
    resolver: zodResolver(ifrSchema),
    defaultValues: ifrData,
  });

  const watchedData = watch();

  // Update ref when store data changes
  useEffect(() => {
    currentIfrDataRef.current = ifrData;
  }, [ifrData]);

  useEffect(() => {
    if (
      watchedData.international_staff !== currentIfrDataRef.current.international_staff ||
      watchedData.total_academic_staff !== currentIfrDataRef.current.total_academic_staff
    ) {
      setIfrData(watchedData);
    }
  }, [watchedData.international_staff, watchedData.total_academic_staff, setIfrData]);

  useEffect(() => {
    if (watchedData.international_staff !== undefined && watchedData.total_academic_staff) {
      const ratio = watchedData.international_staff / watchedData.total_academic_staff;
      const percentage = ratio * 100;
      // IFR Score calculation (higher ratio is better for internationalization)
      const score = Math.min(100, percentage * 2); // Score doubles the percentage, capped at 100
      
      const result: CalculationResult = {
        ratio: Math.round(ratio * 1000) / 1000,
        percentage: Math.round(percentage * 100) / 100,
        score: Math.round(score * 100) / 100,
      };
      
      setIfrResult(result);
    } else {
      setIfrResult(null);
    }
  }, [watchedData.international_staff, watchedData.total_academic_staff, setIfrResult]);

  const hasValidationError = watchedData.international_staff > watchedData.total_academic_staff;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-2xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              International Faculty Ratio
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Calculate the international faculty ratio for your university
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label htmlFor="international_staff" className="block text-sm font-semibold text-slate-700">
                International Academic Staff
              </label>
              <input
                {...register('international_staff', { valueAsNumber: true })}
                type="number"
                min="0"
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                placeholder="Enter international academic staff"
              />
              {errors.international_staff && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.international_staff.message}</p>
              )}
            </div>

            <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label htmlFor="total_academic_staff" className="block text-sm font-semibold text-slate-700">
                Total Academic Staff
              </label>
              <input
                {...register('total_academic_staff', { valueAsNumber: true })}
                type="number"
                min="1"
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                placeholder="Enter total academic staff"
              />
              {errors.total_academic_staff && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.total_academic_staff.message}</p>
              )}
            </div>

            {/* Validation Warning */}
            {hasValidationError && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Validation Error</h4>
                    <p className="mt-2 text-sm text-red-800 font-medium">
                      International staff cannot exceed total academic staff
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Formula Explanation */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Calculation Formula</h4>
                  <div className="mt-3 text-sm text-blue-800 font-medium space-y-1">
                    <p><strong>Ratio:</strong> International Staff ÷ Total Academic Staff</p>
                    <p><strong>Percentage:</strong> Ratio × 100</p>
                    <p><strong>Score:</strong> Percentage × 2 (capped at 100)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Calculation Results
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Real-time IFR calculations
            </p>
          </div>

          <div className="p-8">
            {ifrResult && !hasValidationError ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-100 p-6 rounded-xl border border-teal-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">International Faculty Ratio</span>
                      <span className="text-3xl font-extrabold text-teal-700">{ifrResult.ratio}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">International Faculty %</span>
                      <span className="text-3xl font-extrabold text-emerald-700">{ifrResult.percentage}%</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">IFR Score</span>
                      <span className="text-3xl font-extrabold text-purple-700">{ifrResult.score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">IFR Score Progress</span>
                    <span className="text-slate-600 font-medium">{ifrResult.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 h-4 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.min(ifrResult.score, 100)}%` }}
                    />
                  </div>
                </div>

                {/* International Faculty Breakdown */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Faculty Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">International Faculty</span>
                      <span className="font-semibold text-teal-600">{watchedData.international_staff || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">Domestic Faculty</span>
                      <span className="font-semibold text-slate-700">
                        {(watchedData.total_academic_staff || 0) - (watchedData.international_staff || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-slate-300 pt-3">
                      <span className="text-slate-800">Total Faculty</span>
                      <span className="text-slate-800">{watchedData.total_academic_staff || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">
                  {hasValidationError ? 'Invalid Data' : 'No Data Yet'}
                </h3>
                <p className="mt-2 text-sm text-slate-600 font-medium">
                  {hasValidationError 
                    ? 'Please correct the validation errors above'
                    : 'Enter faculty numbers to see calculations'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};