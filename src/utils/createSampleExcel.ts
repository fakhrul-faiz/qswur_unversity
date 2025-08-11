import * as XLSX from 'xlsx';

// Sample university data starting from row 5
const sampleData = [
  // Headers (row 4 in Excel, index 0 in array)
  [
    'Index', 'Rank', 'Previous Rank', 'Name', 'Country/Territory', 'Region', 
    'Size', 'Focus', 'Research', 'Status', 'AR SCORE', 'AR RANK', 
    'ER SCORE', 'ER RANK', 'FSR SCORE', 'FSR RANK', 'CPF SCORE', 'CPF RANK',
    'IFR SCORE', 'IFR RANK', 'ISR SCORE', 'ISR RANK', 'ISD SCORE', 'ISD RANK',
    'IRN SCORE', 'IRN RANK', 'EO SCORE', 'EO RANK', 'SUS SCORE', 'SUS RANK',
    'Overall SCORE', 'Column2', 'Rank_Duplicate'
  ],
  // Data rows (starting from row 5 in Excel)
  [1, 1, 1, 'Massachusetts Institute of Technology', 'United States', 'North America', 'Medium', 'Focused', 'High Research', 'Private', 100.0, 1, 100.0, 1, 100.0, 1, 100.0, 1, 95.2, 5, 90.1, 8, 88.5, 12, 92.3, 3, 85.7, 15, 78.9, 25, 100.0, '', 1],
  [2, 2, 3, 'University of Cambridge', 'United Kingdom', 'Europe', 'Large', 'Comprehensive', 'High Research', 'Public', 99.2, 2, 99.8, 2, 98.5, 3, 99.1, 2, 98.7, 1, 95.3, 2, 91.2, 8, 95.8, 1, 88.4, 8, 82.1, 18, 99.2, '', 2],
  [3, 3, 2, 'Stanford University', 'United States', 'North America', 'Large', 'Comprehensive', 'High Research', 'Private', 98.9, 3, 99.5, 3, 97.8, 4, 98.7, 3, 92.1, 8, 88.9, 12, 89.7, 10, 94.2, 2, 87.3, 10, 80.5, 20, 98.9, '', 3],
  [4, 4, 4, 'University of Oxford', 'United Kingdom', 'Europe', 'Large', 'Comprehensive', 'High Research', 'Public', 98.5, 4, 99.1, 4, 99.2, 2, 97.9, 4, 97.8, 2, 94.7, 3, 90.8, 9, 93.5, 4, 86.9, 12, 81.7, 19, 98.5, '', 4],
  [5, 5, 5, 'Harvard University', 'United States', 'North America', 'Large', 'Comprehensive', 'High Research', 'Private', 98.1, 5, 98.7, 5, 96.3, 6, 97.2, 5, 89.4, 15, 87.2, 18, 88.1, 14, 91.8, 6, 84.6, 18, 79.3, 23, 98.1, '', 5],
  [6, 6, 6, 'Imperial College London', 'United Kingdom', 'Europe', 'Medium', 'Focused', 'High Research', 'Public', 97.8, 6, 98.3, 6, 95.7, 8, 96.8, 6, 96.5, 3, 93.1, 4, 87.9, 15, 90.7, 8, 83.2, 22, 78.8, 24, 97.8, '', 6],
  [7, 7, 7, 'UCL', 'United Kingdom', 'Europe', 'Large', 'Comprehensive', 'High Research', 'Public', 97.2, 7, 97.9, 7, 94.8, 12, 96.1, 7, 95.8, 4, 92.6, 5, 86.7, 18, 89.9, 9, 82.5, 24, 77.9, 26, 97.2, '', 7],
  [8, 8, 8, 'ETH Zurich', 'Switzerland', 'Europe', 'Medium', 'Focused', 'High Research', 'Public', 96.9, 8, 97.5, 8, 96.8, 5, 95.7, 8, 94.2, 6, 91.8, 6, 85.3, 22, 88.4, 11, 81.7, 26, 76.5, 28, 96.9, '', 8],
  [9, 9, 10, 'University of Chicago', 'United States', 'North America', 'Medium', 'Comprehensive', 'High Research', 'Private', 96.5, 9, 97.1, 9, 95.2, 10, 95.3, 9, 88.7, 18, 86.9, 19, 84.8, 24, 87.6, 12, 80.9, 28, 75.8, 30, 96.5, '', 9],
  [10, 10, 9, 'National University of Singapore', 'Singapore', 'Asia', 'Large', 'Comprehensive', 'High Research', 'Public', 96.1, 10, 96.7, 10, 94.5, 13, 94.9, 10, 93.6, 7, 90.4, 7, 83.2, 28, 86.8, 13, 79.4, 30, 74.2, 35, 96.1, '', 10]
];

export const createSampleExcelFile = () => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet with empty rows 1-3, then headers and data starting from row 4
  const ws_data = [
    [], // Row 1 (empty)
    [], // Row 2 (empty)
    [], // Row 3 (empty)
    ...sampleData // Headers (row 4) and data (rows 5+)
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  
  // Set column widths for better readability
  const colWidths = [
    { wch: 8 },   // Index
    { wch: 8 },   // Rank
    { wch: 12 },  // Previous Rank
    { wch: 35 },  // Name
    { wch: 18 },  // Country/Territory
    { wch: 15 },  // Region
    { wch: 10 },  // Size
    { wch: 15 },  // Focus
    { wch: 15 },  // Research
    { wch: 12 },  // Status
    { wch: 10 },  // AR SCORE
    { wch: 10 },  // AR RANK
    { wch: 10 },  // ER SCORE
    { wch: 10 },  // ER RANK
    { wch: 10 },  // FSR SCORE
    { wch: 10 },  // FSR RANK
    { wch: 10 },  // CPF SCORE
    { wch: 10 },  // CPF RANK
    { wch: 10 },  // IFR SCORE
    { wch: 10 },  // IFR RANK
    { wch: 10 },  // ISR SCORE
    { wch: 10 },  // ISR RANK
    { wch: 10 },  // ISD SCORE
    { wch: 10 },  // ISD RANK
    { wch: 10 },  // IRN SCORE
    { wch: 10 },  // IRN RANK
    { wch: 10 },  // EO SCORE
    { wch: 10 },  // EO RANK
    { wch: 10 },  // SUS SCORE
    { wch: 10 },  // SUS RANK
    { wch: 12 },  // Overall SCORE
    { wch: 10 },  // Column2
    { wch: 8 }    // Rank (duplicate)
  ];
  
  ws['!cols'] = colWidths;
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'University Rankings');
  
  // Generate buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Create blob and download
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'university_rankings_sample.xlsx';
  link.click();
  window.URL.revokeObjectURL(url);
};