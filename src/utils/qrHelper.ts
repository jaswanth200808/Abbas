import QRCode from 'qrcode';

/**
 * Generate a QR Code Data URL from any string or UPI payment link
 */
export async function generateQrDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e1b4b', // Deep indigo
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
      ...options
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

/**
 * Generate a standard UPI payment string
 */
export function buildUpiPaymentString(params: {
  upiId: string;
  payeeName: string;
  amount?: number;
  itemTitle?: string;
  transactionNote?: string;
}): string {
  const { upiId, payeeName, amount, itemTitle, transactionNote } = params;
  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent(payeeName.trim());
  const note = encodeURIComponent(transactionNote || `Rent & Reuse - ${itemTitle || 'Campus Gear'}`);

  let upiString = `upi://pay?pa=${cleanUpi}&pn=${cleanName}&tn=${note}&cu=INR`;
  if (amount && amount > 0) {
    upiString += `&am=${amount}`;
  }
  return upiString;
}

/**
 * Standard campus sample QR presets for demo personas
 */
export const SAMPLE_SCANNER_PRESETS = [
  {
    name: 'GPay / PhonePe UPI QR',
    upiId: 'abbas.shaik@okhdfcbank',
    label: 'Google Pay / PhonePe UPI Scanner',
    type: 'upi'
  },
  {
    name: 'Paytm Campus Scanner',
    upiId: '9876543210@paytm',
    label: 'Paytm Student Scanner',
    type: 'upi'
  },
  {
    name: 'Campus Handover Verification QR',
    upiId: 'hostel-block-a.nie@axisbank',
    label: 'Campus Handover & Deposit QR',
    type: 'handover'
  }
];
