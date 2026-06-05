import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
// Basic email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/team — List team members (Admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const workspaceId = (session.user as any).workspaceId;

    const members = await prisma.allowedEmail.findMany({
      where: { workspaceId },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/team — Add team member (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const email = body.email?.trim();

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await prisma.allowedEmail.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already on the team' },
        { status: 400 }
      );
    }

    const member = await prisma.allowedEmail.create({
      data: {
        email: email.toLowerCase(),
        role: 'STAFF',
        invitedById: session.user.id,
        workspaceId: (session.user as any).workspaceId,
      },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/team — Remove team member (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const workspaceId = (session.user as any).workspaceId;
    const member = await prisma.allowedEmail.findUnique({ where: { id } });
    if (!member || member.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent removing admin
    if (member.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot remove admin' },
        { status: 400 }
      );
    }

    await prisma.allowedEmail.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/team — Update team member role (Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { id, role } = body;

    if (!id || !role || !['ADMIN', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const workspaceId = (session.user as any).workspaceId;
    const member = await prisma.allowedEmail.findUnique({ where: { id } });
    if (!member || member.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Protect self-demotion
    if (member.email === session.user.email && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
    }

    const updated = await prisma.allowedEmail.update({
      where: { id },
      data: { role },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
    });

    // Also update the User role if the user has already signed in
    await prisma.user.updateMany({
      where: { email: member.email },
      data: { role },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

