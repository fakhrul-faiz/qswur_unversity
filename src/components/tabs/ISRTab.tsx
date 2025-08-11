import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, Info, AlertCircle, Globe } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { ISRFormData, CalculationResult } from '../../types';

const isrSchema = z.object({
  international_students: z.number().min(0, 'Cannot be negative'),
  total_students: z.number().min(1, 'Must be at least 1'),
}).refine(data => data.international_students <= data.total_students, {
  message: 'International students cannot exceed total students',
  path: ['international_students'],
});

export const ISRTab: React.FC = () => {
  const { isrData, setIsrData, isrResult, setIsrResult } = useDataStore();
  const currentIsrDataRef = useRef(isrData);
  
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ISRFormData>({
    resolver: zodResolver(isrSchema),
    defaultValues: isrData,
  });

  const watchedData = watch();

  // Update ref when store data changes
  useEffect(() => {
    currentIsrDataRef.current = isrData;
  }, [isrData]);

  useEffect(() => {
    if (
      watchedData.international_students !== currentIsrDataRef.current.international_students ||
      watchedData.total_students !== currentIsrDataRef.current.total_students
    ) {
      setIsrData(watchedData);
    }
  }, [watchedData.international_students, watchedData.total_students, setIsrData]);

  useEffect(() => {
    if (watchedData.international_students !== undefined && watchedData.total_students) {
      const ratio = watchedData.international_students / watchedData.total_students;
      const percentage = ratio * 100;
      // ISR Score calculation (higher ratio is better for internationalization)
      const score = Math.min(100, percentage * 3); // Score triples the percentage, capped at 100
      
      const result: CalculationResult = {
        ratio: Math.round(ratio * 1000) / 1000,
        percentage: Math.round(percentage * 100) / 100,
        score: Math.round(score * 100) / 100,
      };
      
      setIsrResult(result);
    } else {
      setIsrResult(null);
    }
  }, [watchedData.international_students, watchedData.total_students, setIsrResult]);

  const hasValidationError = watchedData.international_students > watchedData.total_students;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  International Student Ratio
                </h2>
                <p className="mt-2 text-sm text-slate-600 font-medium">
                  Calculate the international student ratio for your university
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label htmlFor="international_students" className="block text-sm font-semibold text-slate-700">
                International Students
              </label>
              <input
                {...register('international_students', { valueAsNumber: true })}
                type="number"
                min="0"
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                placeholder="Enter number of international students"
              />
              {errors.international_students && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.international_students.message}</p>
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
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                placeholder="Enter total number of students"
              />
              {errors.total_students && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.total_students.message}</p>
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
                      International students cannot exceed total students
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
                    <p><strong>Ratio:</strong> International Students ÷ Total Students</p>
                    <p><strong>Percentage:</strong> Ratio × 100</p>
                    <p><strong>Score:</strong> Percentage × 3 (capped at 100)</p>
                    <p className="mt-2 text-xs text-blue-700 font-medium">
                      Higher international student ratios indicate better global diversity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-2xl">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Calculation Results
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Real-time ISR calculations and diversity metrics
            </p>
          </div>

          <div className="p-8">
            {isrResult && !hasValidationError ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-100 p-6 rounded-xl border border-violet-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">International Student Ratio</span>
                      <span className="text-3xl font-extrabold text-violet-700">{isrResult.ratio}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">International Students %</span>
                      <span className="text-3xl font-extrabold text-emerald-700">{isrResult.percentage}%</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-rose-50 to-pink-100 p-6 rounded-xl border border-rose-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">ISR Score</span>
                      <span className="text-3xl font-extrabold text-rose-700">{isrResult.score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar with Color Coding */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">ISR Score Progress</span>
                    <span className="text-slate-600 font-medium">{isrResult.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isrResult.score >= 75 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 h-4'
                          : isrResult.score >= 50
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 h-4'
                          : 'bg-gradient-to-r from-red-500 to-rose-500 h-4'
                      }`}
                      style={{ width: `${Math.min(isrResult.score, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 text-center font-medium">
                    {isrResult.score >= 75 
                      ? 'Excellent international diversity'
                      : isrResult.score >= 50
                      ? 'Good international representation'
                      : 'Room for improvement in international diversity'
                    }
                  </div>
                </div>

                {/* Student Body Breakdown */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Student Body Composition</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">International Students</span>
                      <span className="font-semibold text-violet-600">
                        {watchedData.international_students || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">Domestic Students</span>
                      <span className="font-semibold text-slate-700">
                        {(watchedData.total_students || 0) - (watchedData.international_students || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-slate-300 pt-3">
                      <span className="text-slate-800">Total Students</span>
                      <span className="text-slate-800">{watchedData.total_students || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Diversity Visualization</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500 shadow-sm"
                        style={{ width: `${isrResult.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 min-w-0">
                      {isrResult.percentage}% International
                    </span>
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
                    : 'Enter student numbers to see calculations'
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