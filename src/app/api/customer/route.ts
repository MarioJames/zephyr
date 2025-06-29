import { NextRequest, NextResponse } from 'next/server';
import { getServerDB } from '@/database/server';
import {
  CustomerModel,
  CreateCustomerSessionParams,
} from '@/database/models/customer';

// 客户扩展信息类型
interface CustomerExtendInfo {
  id: number;
  sessionId: string;
  gender?: string | null;
  age?: number | null;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  wechat?: string | null;
  company?: string | null;
  industry?: string | null;
  scale?: string | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 客户扩展信息创建请求类型
export interface CustomerExtendCreateRequest {
  sessionId: string;
  gender?: string;
  age?: number;
  position?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  company?: string;
  industry?: string;
  scale?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  notes?: string;
}

// 客户扩展信息更新请求类型
export type CustomerExtendUpdateRequest = Partial<
  Omit<CustomerExtendCreateRequest, 'sessionId'>
>;

/**
 * GET /api/customer - 获取客户扩展信息
 * 支持两种查询方式：
 * 1. 通过 sessionId 获取单个客户扩展信息: ?sessionId=xxx
 * 2. 通过 sessionIds 批量获取客户扩展信息: ?sessionIds=id1,id2,id3
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const sessionIds = searchParams.get('sessionIds');

    const db = await getServerDB();
    const customerModel = new CustomerModel(db);

    if (sessionId) {
      // 获取单个客户扩展信息
      const customerExtend = await customerModel.findBySessionId(sessionId);
      return NextResponse.json({
        success: true,
        data: customerExtend,
        timestamp: Date.now(),
      });
    }

    if (sessionIds) {
      // 批量获取客户扩展信息
      const sessionIdList = sessionIds.split(',').filter(Boolean);
      const customerExtendList = await customerModel.findBySessionIds(
        sessionIdList
      );
      return NextResponse.json({
        success: true,
        data: customerExtendList,
        timestamp: Date.now(),
      });
    }

    // 获取所有客户扩展信息（可能需要分页）
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    const customerExtendList = await customerModel.list({
      page,
      pageSize,
    });
    const total = await customerModel.count();

    return NextResponse.json({
      success: true,
      data: customerExtendList,
      total,
      page,
      pageSize,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取客户扩展信息失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customer - 创建客户扩展信息
 * 只负责在内部数据库创建客户扩展信息，Session 的创建由 services/customer 处理
 */
export async function POST(request: NextRequest) {
  try {
    const body: CustomerExtendCreateRequest = await request.json();

    const db = await getServerDB();
    const customerModel = new CustomerModel(db);

    const customerSessionData: CreateCustomerSessionParams = {
      sessionId: body.sessionId,
      gender: body.gender,
      age: body.age,
      position: body.position,
      phone: body.phone,
      email: body.email,
      wechat: body.wechat,
      company: body.company,
      industry: body.industry,
      scale: body.scale,
      province: body.province,
      city: body.city,
      district: body.district,
      address: body.address,
      notes: body.notes,
    };

    // 创建客户扩展信息
    await customerModel.create(customerSessionData);

    // 查询创建的客户扩展信息
    const customerExtend = await customerModel.findBySessionId(body.sessionId);

    return NextResponse.json({
      success: true,
      data: customerExtend,
      message: '客户扩展信息创建成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('POST /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建客户扩展信息失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/customer?sessionId=xxx - 更新客户扩展信息
 * 只负责更新内部数据库的扩展信息，Session 的更新由 services/customer 处理
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const body: CustomerExtendUpdateRequest = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'sessionId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const customerModel = new CustomerModel(db);

    // 根据sessionId查找客户扩展信息
    const customerExtend = await customerModel.findBySessionId(sessionId);
    if (!customerExtend) {
      console.log('客户拓展信息不存在，创建新客户拓展信息');

      const newCustomerExtend = await customerModel.create({
        sessionId,
        ...body,
      });

      return NextResponse.json({
        success: true,
        data: newCustomerExtend,
        message: '客户扩展信息创建成功',
        timestamp: Date.now(),
      });
    }

    // 更新客户扩展信息
    const customerUpdateData: Partial<CreateCustomerSessionParams> = {
      sessionId,
      gender: body.gender,
      age: body.age,
      position: body.position,
      phone: body.phone,
      email: body.email,
      wechat: body.wechat,
      company: body.company,
      industry: body.industry,
      scale: body.scale,
      province: body.province,
      city: body.city,
      district: body.district,
      address: body.address,
      notes: body.notes,
    };

    await customerModel.update(customerExtend.id, customerUpdateData);

    // 返回更新后的扩展信息
    const updatedCustomerExtend = await customerModel.findBySessionId(
      sessionId
    );

    return NextResponse.json({
      success: true,
      data: updatedCustomerExtend,
      message: '客户扩展信息更新成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('PUT /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新客户扩展信息失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customer?sessionId=xxx - 删除客户扩展信息
 * 只负责删除内部数据库的扩展信息，Session 的删除由 services/customer 处理
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'sessionId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const customerModel = new CustomerModel(db);

    // 根据sessionId查找客户扩展信息
    const customerExtend = await customerModel.findBySessionId(sessionId);
    if (!customerExtend) {
      return NextResponse.json(
        {
          success: false,
          error: '客户扩展信息不存在',
        },
        { status: 404 }
      );
    }

    // 删除客户扩展信息
    await customerModel.deleteBySessionId(sessionId);

    return NextResponse.json({
      success: true,
      data: null,
      message: '客户扩展信息删除成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('DELETE /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除客户扩展信息失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
