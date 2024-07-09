// GenerateCombinedPDF.jsx

import React, { useContext } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DataContext from './DataContext';
import { Button } from '@chakra-ui/react';

function GeneratePDF() {
  const { formData } = useContext(DataContext);
  const generateCombinedPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ['Field', 'Value'];
  
    formData.forEach((data, index) => {
      let tableRows = [];
  
      // Iterate over each key-value pair in the current data object
      Object.entries(data).forEach(([key, value]) => {
        tableRows.push([key, value]);
      });
  
      // Add a separator between tables except for the last one
      if (index !== formData.length - 1) {
        tableRows.push(['', '']); // Separator between forms
      }
  
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: index === 0 ? 10 : doc.previousAutoTable.finalY + 10, // Start position for each table
      });
    });
  
    doc.save('combined_forms.pdf');
  };
  

  return (
    <div>
      <Button onClick={generateCombinedPdf}>Generate Combined PDF</Button>
    </div>
  );
}

export default GeneratePDF;
