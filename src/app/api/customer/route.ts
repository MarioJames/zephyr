import { NextRequest, NextResponse } from 'next/server';
import { getServerDB } from '@/database/server';
import {
  CustomerModel,
  CreateCustomerSessionParams,
} from '@/database/models/customer';
import sessionsAPI, {
  SessionItem,
  SessionCreateRequest,
  SessionUpdateRequest,
  SessionListRequest,
} from '@/services/sessions';

// 定义合并后的客户详情类型
interface CustomerDetailResponse {
  session: SessionItem;
  extend?: {
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
  };
}

// 客户创建请求类型
export interface CustomerCreateRequest {
  // 外部系统字段（sessions）
  title: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  groupId?: string;
  agentId?: string;

  // 内部扩展字段（customerSessions）
  customerId?: number;
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

// 客户更新请求类型
export interface CustomerUpdateRequest extends Partial<CustomerCreateRequest> {}

/**
 * GET /api/customer - 获取客户详情或客户列表
 * 支持两种查询方式：
 * 1. 通过 sessionId 获取客户详情: ?sessionId=xxx
 * 2. 获取客户列表: 使用分页和过滤参数 ?page=1&pageSize=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    const db = await getServerDB();
    const customerModel = new CustomerModel(db);

    if (sessionId) {
      const sessionResponse = await sessionsAPI.getSessionDetail(sessionId);
      const customerSession = await customerModel.findBySessionId(sessionId);

      return NextResponse.json({
        success: true,
        data: { session: sessionResponse, extend: customerSession },
      });
    }

    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 10;

    const params: SessionListRequest = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const sessionList = await sessionsAPI.getSessionList(params);

    const sessionIds = sessionList.map((item) => item.id);

    // 从内部数据库获取扩展信息
    const customerSessionList = await customerModel.findBySessionIds(
      sessionIds
    );

    // 合并扩展信息
    const result: CustomerDetailResponse[] = sessionList.map((item) => {
      const customerSession = customerSessionList.find(
        (customer) => customer.sessionId === item.id
      );
      return { session: item, extend: customerSession };
    });

    // 获取总数量
    const total = await customerModel.count();

    return NextResponse.json({
      success: true,
      data: result,
      total,
    });
  } catch (error) {
    console.error('GET /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取客户信息失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customer - 创建客户
 * 先在外部系统创建会话，然后在内部数据库存储扩展信息
 */
export async function POST(request: NextRequest) {
  try {
    const body: CustomerCreateRequest = await request.json();

    // 1. 先在外部系统创建会话
    const sessionData: SessionCreateRequest = {
      title: body.title,
      description: body.description,
      avatar: body.avatar,
      agentId: body.agentId,
    };

    const sessionResponse = await sessionsAPI.createSession(sessionData);
    const sessionId = sessionResponse.id;

    // 2. 在内部数据库存储扩展信息
    const db = await getServerDB();
    const customerModel = new CustomerModel(db);

    const customerSessionData: CreateCustomerSessionParams = {
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

    // 创建客户拓展信息
    await customerModel.create(customerSessionData);

    // 查询客户拓展信息
    const customerSession = await customerModel.findBySessionId(sessionId);

    const result: CustomerDetailResponse = {
      session: sessionResponse,
      extend: customerSession,
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: '客户创建成功',
    });
  } catch (error) {
    console.error('POST /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建客户失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/customer?sessionId=xxx - 更新客户
 * 分别更新外部系统的会话信息和内部数据库的扩展信息
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const body: CustomerUpdateRequest = await request.json();

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

    // 根据sessionId更新
    const customerSession = await customerModel.findBySessionId(sessionId);
    if (!customerSession) {
      return NextResponse.json(
        {
          success: false,
          error: '客户信息不存在',
        },
        { status: 404 }
      );
    }

    // 1. 更新外部系统的会话信息
    const sessionUpdateData: SessionUpdateRequest = {
      title: body.title,
      description: body.description,
      avatar: body.avatar,
      agentId: body.agentId,
    };

    let updatedSession: SessionItem | null = null;
    updatedSession = await sessionsAPI.updateSession(
      sessionId,
      sessionUpdateData
    );

    // 2. 更新内部数据库的扩展信息
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

    await customerModel.update(customerSession.id, customerUpdateData);

    return NextResponse.json({
      success: true,
      data: null,
      message: '客户更新成功',
    });
  } catch (error) {
    console.error('PUT /api/customer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新客户失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
