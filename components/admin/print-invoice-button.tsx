"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
    productName: string;
    quantity: number;
    price: string;
}

interface OrderData {
    id: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string | null;
    totalAmount: string | number;
    status: string | null;
    notes: string | null;
    createdAt: string | null;
    items: OrderItem[];
}

interface PrintInvoiceButtonProps {
    order: OrderData;
}

export function PrintInvoiceButton({ order }: PrintInvoiceButtonProps) {
    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(price) * 1000);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
        }).format(new Date(dateString));
    };

    const handlePrint = () => {
        const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.id.slice(0, 8)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 15px; }
          .store-name { font-size: 24px; font-weight: bold; }
          .store-info { font-size: 12px; color: #666; margin-top: 5px; }
          .order-id { font-size: 11px; color: #888; margin-top: 10px; }
          .section { margin: 15px 0; }
          .section-title { font-size: 12px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
          .customer-info { font-size: 13px; }
          .customer-info p { margin: 3px 0; }
          .items { width: 100%; }
          .item { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px dotted #ddd; }
          .item-name { flex: 1; }
          .item-qty { width: 50px; text-align: center; }
          .item-price { width: 100px; text-align: right; }
          .total { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding-top: 15px; border-top: 2px solid #333; margin-top: 15px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #333; font-size: 12px; color: #666; }
          .date { font-size: 11px; color: #888; margin-top: 5px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">Toserba WS Pedak</div>
          <div class="store-info">Kaliurang St No.KM.11, Pedak</div>
          <div class="store-info">Buka: 08:00 - 21:30</div>
          <div class="order-id">Order #${order.id.slice(0, 8).toUpperCase()}</div>
        </div>
        
        <div class="section">
          <div class="section-title">PELANGGAN</div>
          <div class="customer-info">
            <p><strong>${order.customerName}</strong></p>
            <p>${order.customerAddress}</p>
            ${order.customerPhone ? `<p>Tel: ${order.customerPhone}</p>` : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">ITEM PESANAN</div>
          <div class="items">
            ${order.items.map(item => `
              <div class="item">
                <span class="item-name">${item.productName}</span>
                <span class="item-qty">${item.quantity}x</span>
                <span class="item-price">${formatPrice(Number(item.price) * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="total">
          <span>TOTAL</span>
          <span>${formatPrice(order.totalAmount)}</span>
        </div>

        ${order.notes ? `<div class="section"><div class="section-title">CATATAN</div><p style="font-size: 12px;">${order.notes}</p></div>` : ''}

        <div class="footer">
          <p>Terima kasih telah berbelanja!</p>
          <p class="date">${formatDate(order.createdAt)}</p>
        </div>
      </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    };

    return (
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Printer className="h-4 w-4 mr-2" />
            Cetak Invoice
        </Button>
    );
}
