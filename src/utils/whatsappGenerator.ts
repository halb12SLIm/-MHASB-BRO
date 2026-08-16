import { Invoice, Client, calculateInvoiceTotal, calculateInvoiceRemaining, calculateItemTotal } from "../types";

export const shareInvoiceToWhatsApp = (invoice: Invoice, client: Client) => {
  const itemsList = invoice.items.map(item => 
    `• ${item.itemName} | الكمية: ${item.quantity} | السعر: ${(item.unitPrice || 0).toFixed(2)} ${invoice.currency.toUpperCase()} | الإجمالي: ${(calculateItemTotal(item) || 0).toFixed(2)} ${invoice.currency.toUpperCase()}`
  ).join('\n');

  const subtotal = invoice.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const total = calculateInvoiceTotal(invoice);
  const remaining = calculateInvoiceRemaining(invoice);

  const text = 
`🧾 *فاتورة مبيعات - سليم لتجارة العسل الطبيعي*
اسم العميل: ${client.name}
التاريخ: ${new Date(invoice.date).toLocaleDateString('ar-SA')} | رقم الفاتورة: #${invoice.id}
----------------------------------------
*تفاصيل الأصناف:*
${itemsList}
----------------------------------------
• المجموع الفرعي: ${(subtotal || 0).toFixed(2)} ${invoice.currency.toUpperCase()}
• التغليف: ${(invoice.packagingFee || 0).toFixed(2)} ${invoice.currency.toUpperCase()}
• الحساب السابق: ${(invoice.previousDebt || 0).toFixed(2)} ${invoice.currency.toUpperCase()}
• *المبلغ النهائي المستحق:* ${(remaining || 0).toFixed(2)} ${invoice.currency.toUpperCase()}
----------------------------------------
سليم لتجارة العسل الطبيعي نشكركم على ثقتكم بنا.
هذه الفاتورة صالحة إلى ثلاثة أيام، بعد الثلاثة أيام غير قابلة للترجيع.`;

  const phone = client.phone.replace(/\D/g, '');
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
