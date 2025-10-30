// Export utilities for PDF, Excel, and Word formats
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

export const exportToPDF = async (elementId: string, filename: string = 'pmo-lifecycle') => {
  try {
    const element = document.getElementById(elementId) || document.body;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Error exporting to PDF. Please try again.');
  }
};

export const exportToExcel = (data: any[], filename: string = 'pmo-data') => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PMO Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting to Excel. Please try again.');
  }
};

export const exportToWord = (content: string, filename: string = 'pmo-document') => {
  try {
    const blob = new Blob([content], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Word:', error);
    alert('Error exporting to Word. Please try again.');
  }
};

export const downloadTemplate = (templateName: string, type: string) => {
  // For now, create a simple template file
  let content = '';
  let mimeType = '';
  let extension = '';

  switch (type.toLowerCase()) {
    case 'pdf':
      // Create a simple PDF-like content
      content = `PMO Template: ${templateName}\n\nThis is a template for ${templateName}.\n\nPlease customize this template according to your organization's needs.`;
      mimeType = 'application/pdf';
      extension = 'pdf';
      break;
    case 'word':
      content = `<html><body><h1>PMO Template: ${templateName}</h1><p>This is a template for ${templateName}.</p><p>Please customize this template according to your organization's needs.</p></body></html>`;
      mimeType = 'application/msword';
      extension = 'doc';
      break;
    case 'excel':
      content = `Template Name,${templateName}\nDescription,Template for ${templateName}\nInstructions,Please customize according to your needs`;
      mimeType = 'application/vnd.ms-excel';
      extension = 'csv';
      break;
    default:
      content = `PMO Template: ${templateName}\n\nThis is a template for ${templateName}.`;
      mimeType = 'text/plain';
      extension = 'txt';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${templateName.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};