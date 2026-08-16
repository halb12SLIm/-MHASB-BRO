import html2pdf from "html2pdf.js";
import { Invoice, StoreSettings } from "../types";

export const printHighResInvoice = (invoice: Invoice, settings: StoreSettings) => {
  const element = document.createElement('div');
  element.id = 'invoice-print-template';
  
  const totalAmount = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const finalTotal = totalAmount + invoice.packagingFee;
  const remaining = finalTotal + invoice.previousDebt - invoice.paidAmount;

  element.innerHTML = `
    <div style="padding: 20px; font-family: 'Tajawal', sans-serif; direction: rtl; color: #1E1E1E; position: relative;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 10px;">
        ${settings?.logoBase64 ? `<img src="${settings.logoBase64}" style="width: 140px; height: auto;" />` : '<h1 style="color: #2E6F40; margin: 5px 0;">عسل سليم</h1>'}
        <h1 style="color: #2E6F40; margin: 5px 0; font-size: 20px;">فاتورة مبيعات - نقداً</h1>
        <p style="font-size: 14px; margin: 0;">التاريخ: ${new Date(invoice.date).toLocaleDateString('ar-SA')}</p>
      </div>

      <div style="display: flex; justify-content: space-between; border-bottom: 3px solid black; padding-bottom: 10px; margin-bottom: 10px;">
        <div style="width: 45%;">
          <p style="margin: 2px 0;"><strong>العميل:</strong> ${invoice.clientName}</p>
          <p style="margin: 2px 0;"><strong>رقم الفاتورة:</strong> ${invoice.id}</p>
        </div>
        <div style="width: 45%; text-align: left;">
          <p style="margin: 2px 0;"><strong>مناحل سليم</strong></p>
          <p style="margin: 2px 0;">انطاليا/تركيا</p>
          <p style="margin: 2px 0;">0939959738</p>
        </div>
      </div>

      <!-- Watermark Logo -->
      ${settings?.logoBase64 ? `
      <div style="position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%); width: 320px; height: 320px; 
                  background-image: url('${settings.logoBase64}'); 
                  background-repeat: no-repeat; 
                  background-position: center; 
                  background-size: contain; 
                  opacity: 0.1; 
                  z-index: -1;">
      </div>
      ` : `
      <div style="position: absolute; top: 300px; left: 50%; transform: translateX(-50%); opacity: 0.05; font-size: 200px; z-index: -1;">
        🐝
      </div>
      `}

      <!-- Integrated Table -->
      <table style="width: 100%; border-collapse: collapse; border: 2px solid black; margin-bottom: 5px; background-color: transparent;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid black; padding: 5px; font-weight: bold; font-size: 13px;">م</th>
            <th style="border: 1px solid black; padding: 5px; font-weight: bold; font-size: 13px;">الصنف</th>
            <th style="border: 1px solid black; padding: 5px; font-weight: bold; font-size: 13px;">الكمية</th>
            <th style="border: 1px solid black; padding: 5px; font-weight: bold; font-size: 13px;">السعر</th>
            <th style="border: 1px solid black; padding: 5px; font-weight: bold; font-size: 13px;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr>
              <td style="border: 1px solid black; padding: 4px; text-align: center; font-size: 12px;">${index + 1}</td>
              <td style="border: 1px solid black; padding: 4px; font-weight: bold; font-size: 12px;">${item.itemName}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; font-size: 12px;">${item.quantity}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; font-size: 12px;">${(item.unitPrice || 0).toFixed(2)} ${invoice.currency.toUpperCase()}</td>
              <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold; font-size: 12px;">${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)} ${invoice.currency.toUpperCase()}</td>
            </tr>
          `).join('')}
          
          <!-- Summary Rows -->
          <tr style="background-color: #E8F5E9; height: 25px;">
            <td colspan="4" style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: left; font-size: 11px;">الحساب السابق (عليكم)</td>
            <td style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: center; font-size: 11px;">${(invoice.previousDebt || 0).toFixed(2)} ${invoice.currency.toUpperCase()}</td>
          </tr>
          <tr style="height: 25px;">
            <td colspan="4" style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: left; font-size: 11px;">الإجمالي</td>
            <td style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: center; font-size: 11px;">${(finalTotal || 0).toFixed(2)} ${invoice.currency.toUpperCase()}</td>
          </tr>
          <tr style="height: 25px;">
            <td colspan="4" style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: left; font-size: 11px;">المدفوع</td>
            <td style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: center; font-size: 11px;">${(invoice.paidAmount || 0).toFixed(2)} ${invoice.currency.toUpperCase()}</td>
          </tr>
          <tr style="background-color: #E8F5E9; height: 25px;">
            <td colspan="4" style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: left; font-size: 11px;">الحساب الحالي (عليكم)</td>
            <td style="border: 1px solid black; padding: 2px 5px; font-weight: bold; text-align: center; font-size: 11px;">${(remaining || 0).toFixed(2)} ${invoice.currency.toUpperCase()}</td>
          </tr>
        </tbody>
      </table>

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px;">
        <div style="width: 120px; height: 120px; border: 3px solid #2E6F40; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; color: #2E6F40; font-weight: bold; font-size: 10px; transform: rotate(-15deg); padding: 5px;">
            سليم لتجارة العسل الطبيعي - خالص سليم
        </div>
        <div style="font-size: 10px; color: #888;">
            طباعة: ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString('ar-SA')}
        </div>
      </div>
    </div>
  `;
  
  const options = { margin: 10, filename: `Invoice_${invoice.id}.pdf`, html2canvas: { scale: 3 }, jsPDF: { format: 'a4' } };
  html2pdf().set(options).from(element).save();
};
