import { NextRequest, NextResponse } from 'next/server';
import { getZephyrDB, StructuredDataModel } from '@/database/zephyrDB';
import { chatAPI } from '@/services';
import type { StructuredDataCreateRequest } from '@/services';
import { DocumentModel } from '@/database/chatDB/models/document';
import { getChatDB } from '@/database';
import { omit } from 'lodash-es';

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
 * POST /api/structured-data - 内容摘要与实体抽取
 * 入参与 SummarizeContentRequest 一致，直接调用 summarizeFileContent 返回结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StructuredDataCreateRequest;

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

    const db = await getChatDB();

    const documentModel = new DocumentModel(db);

    const document = await documentModel.findByFileId(body.fileId);

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: '文件不存在',
        },
        { status: 400 }
      );
    }

    if (!document.content) {
      return NextResponse.json({
        success: false,
        error: '文件内容不存在',
      });
    }

    console.log('document', document);
    console.log('body', body);

    const aiResult = await chatAPI.summarizeFileContent({
      content: document?.content,
      ...omit(body, ['fileId']),
    });

    return NextResponse.json({
      success: true,
      data: aiResult,
      message: '内容摘要生成成功',
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
