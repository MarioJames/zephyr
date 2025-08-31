/**
 * 代表文件中的一个逻辑单元/页面/块。
 */
export interface LobeDocumentPage {
  /**
   * 此页/块内容的字符数。
   */
  charCount: number;

  /**
   * 此页/块内容的行数。
   */
  lineCount: number;

  /**
   * 与此页/块相关的元数据。
   */
  metadata: {
    /**
     * 允许添加其他特定于页/块的元数据。
     */
    [key: string]: any;

    /**
     * 如果原始文件单元被进一步分割成块，这是当前块的索引。
     */
    chunkIndex?: number;

    /**
     * 处理此页/块时发生的错误。
     */
    error?: string;

    /**
     * 此页/块在原始文件中的结束行号。
     */
    lineNumberEnd?: number;

    /**
     * 此页/块在原始文件中的起始行号。
     */
    lineNumberStart?: number;

    /**
     * 页码 (适用于 PDF, DOCX)。
     */
    pageNumber?: number;

    /**
     * 与此页/块相关的章节标题。
     */
    sectionTitle?: string;

    /**
     * 工作表名称 (适用于 XLSX)。
     */
    sheetName?: string;

    /**
     * 幻灯片编号 (适用于 PPTX)。
     */
    slideNumber?: number;

    /**
     * 如果原始文件单元被进一步分割成块，这是该单元的总块数。
     */
    totalChunks?: number;
  };

  /**
   * 此页/块的核心文本内容。
   */
  pageContent: string;
}
