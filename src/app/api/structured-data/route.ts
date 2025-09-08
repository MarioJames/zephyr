import { NextRequest, NextResponse } from 'next/server';
import { getZephyrDB, StructuredDataModel } from '@/database/zephyrDB';
import type { FileSummaryData } from '@/services/structured-data';

/**
 * GET /api/structured-data?fileId=xxx - 根据文件ID获取结构化数据
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'fileId 是必需的',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    const db = await getZephyrDB();
    const structuredModel = new StructuredDataModel(db);

    // 获取特定文件的结构化数据
    const structuredData = await structuredModel.findByFileId(fileId);

    return NextResponse.json({
      success: true,
      data: structuredData,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/structured-data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取结构化数据失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/structured-data - 保存内容摘要
 * 入参：{ fileId: string, data: FileSummaryData }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      fileId?: string;
      data?: FileSummaryData;
    };

    if (!body?.fileId || typeof body.fileId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'fileId 是必需的字符串',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    if (!body?.data || typeof body.data !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'data 是必需的对象',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    const db = await getZephyrDB();
    const structuredModel = new StructuredDataModel(db);

    const record = await structuredModel.upsertByFileId({
      fileId: body.fileId,
      data: body.data,
    });

    return NextResponse.json({
      success: true,
      data: record,
      message: '结构化数据保存成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('POST /api/structured-data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '保存结构化数据失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/structured-data?fileId=xxx - 根据文件ID删除结构化数据
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'fileId 是必需的',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    const db = await getZephyrDB();
    const structuredModel = new StructuredDataModel(db);

    // 删除文件对应的结构化数据
    const deleted = await structuredModel.deleteByFileId(fileId);

    return NextResponse.json({
      success: true,
      data: null,
      message: deleted ? '结构化数据删除成功' : '文件没有对应的结构化数据',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('DELETE /api/structured-data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除结构化数据失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
