import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Lấy thông tin từ payload của SePay
    // SePay gửi payload dạng JSON chứa các trường như content, transferAmount, ...
    // Tài liệu API SePay: https://docs.sepay.vn/
    
    const { 
      gateway, 
      transactionDate, 
      accountNumber, 
      content, 
      transferType, 
      transferAmount, 
      referenceCode 
    } = body;

    if (transferType !== 'in') {
      return NextResponse.json({ message: 'Bỏ qua giao dịch chuyển tiền ra' });
    }

    console.log('[SEPAY WEBHOOK]', { content, transferAmount, referenceCode });

    // TODO: Giải mã nội dung chuyển khoản (content) để lấy mã giao dịch (ví dụ TPF1234)
    // Sau đó tra cứu trong bảng Order/Transaction để biết tài khoản nào đang thanh toán
    // và nâng cấp Gói (Plan) cho Workspace đó.
    
    /* 
    Ví dụ logic xử lý:
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { code: extractedCode }
    });

    if (transaction) {
       await prisma.workspace.update({
         where: { id: transaction.workspaceId },
         data: { plan: 'PRO' }
       });
    }
    */

    return NextResponse.json({ success: true, message: 'Đã nhận webhook' });
  } catch (error: any) {
    console.error('[SEPAY WEBHOOK ERROR]', error);
    return NextResponse.json({ success: false, error: 'Đã có lỗi xảy ra' }, { status: 500 });
  }
}
