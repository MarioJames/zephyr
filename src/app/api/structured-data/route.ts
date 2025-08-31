import { NextRequest, NextResponse } from 'next/server';
import { getZephyrDB, StructuredDataModel } from '@/database/zephyrDB';
import { getChatDB } from '@/database/chatDB';
import structuredDataAPI from '@/services/structured-data';
import { DocumentModel } from '@/database/chatDB/models/document';

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
 * POST /api/structured-data - 根据文件ID创建结构化数据
 * 只需要传入 fileId，会自动从数据库获取文档内容并调用 NLP 服务解析
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必需字段
    if (!body.fileId) {
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

    const { fileId } = body;

    // 1. 从 chatDB 获取文档内容
    const chatDb = await getChatDB();
    const documentModel = new DocumentModel(chatDb);
    const document = await documentModel.findByFileId(fileId);

    if (!document || !document.content) {
      return NextResponse.json(
        {
          success: false,
          error: '文档不存在',
          message: `文件 ${fileId} 对应的文档内容不存在或为空`,
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    // 2. 调用 NLP 服务解析结构化数据
    const nlpResult = await structuredDataAPI.extractFileStructuredData(
      document.content
    );

    // 3. 存储到 zephyrDB
    const db = await getZephyrDB();
    const structuredModel = new StructuredDataModel(db);

    const structuredData = await structuredModel.create({
      fileId: fileId,
      data: nlpResult,
    });

    return NextResponse.json({
      success: true,
      data: structuredData,
      message: '结构化数据创建成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('POST /api/structured-data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建结构化数据失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/structured-data?fileId=xxx - 根据文件ID更新结构化数据
 * 重新从数据库获取文档内容并调用 NLP 服务解析，更新现有的结构化数据
 */
export async function PUT(request: NextRequest) {
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

    // 1. 检查结构化数据是否存在
    const db = await getZephyrDB();
    const structuredModel = new StructuredDataModel(db);
    const existsStructured = await structuredModel.existsByFileId(fileId);

    if (!existsStructured) {
      return NextResponse.json(
        {
          success: false,
          error: '记录不存在',
          message: `文件 ${fileId} 没有对应的结构化数据，请先创建`,
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    // 2. 从 chatDB 获取文档内容
    const chatDb = await getChatDB();
    const documentModel = new DocumentModel(chatDb);
    const document = await documentModel.findByFileId(fileId);

    if (!document || !document.content) {
      return NextResponse.json(
        {
          success: false,
          error: '文档不存在',
          message: `文件 ${fileId} 对应的文档内容不存在或为空`,
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    // 3. 调用 NLP 服务重新解析结构化数据
    const nlpResult = await structuredDataAPI.extractFileStructuredData(
      document.content
    );

    // 4. 更新结构化数据
    const updatedRecord = await structuredModel.updateByFileId(fileId, {
      data: nlpResult,
    });

    if (!updatedRecord) {
      return NextResponse.json(
        {
          success: false,
          error: '更新失败',
          message: `更新文件 ${fileId} 的结构化数据失败`,
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: '结构化数据更新成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('PUT /api/structured-data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新结构化数据失败',
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
