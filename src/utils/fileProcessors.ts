import mammoth from 'mammoth'
import { parseDocx } from 'docx'
import pdf from 'pdf-parse'

export interface ProcessedFile {
  title: string
  content: string
  type: 'text' | 'epub' | 'doc' | 'docx' | 'pdf'
}

/**
 * 处理多种格式的文件
 */
export class MultiFormatFileProcessor {
  /**
   * 处理文件并返回文本内容
   */
  static async processFile(file: File): Promise<ProcessedFile> {
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.split('.').pop() || ''

    try {
      switch (fileExtension) {
        case 'txt':
          return await this.processTextFile(file)
        case 'epub':
          return await this.processEpubFile(file)
        case 'doc':
          return await this.processDocFile(file)
        case 'docx':
          return await this.processDocxFile(file)
        case 'pdf':
          return await this.processPdfFile(file)
        default:
          throw new Error(`不支持的文件格式: ${fileExtension}`)
      }
    } catch (error) {
      throw new Error(`处理${fileExtension}文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理纯文本文件
   */
  private static async processTextFile(file: File): Promise<ProcessedFile> {
    const content = await this.readFileAsText(file)
    return {
      title: this.extractTitle(file.name),
      content: content,
      type: 'text'
    }
  }

  /**
   * 处理EPUB文件
   */
  private static async processEpubFile(file: File): Promise<ProcessedFile> {
    // 简化的EPUB处理，实际项目中可以使用epub.js等库
    const content = await this.readFileAsText(file)
    const cleanContent = content.replace(/<[^>]*>/g, '') // 移除HTML标签
    
    return {
      title: this.extractTitle(file.name),
      content: cleanContent,
      type: 'epub'
    }
  }

  /**
   * 处理DOC文件（使用mammoth）
   */
  private static async processDocFile(file: File): Promise<ProcessedFile> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file)
      const result = await mammoth.extractRawText({ arrayBuffer })
      
      return {
        title: this.extractTitle(file.name),
        content: result.value,
        type: 'doc'
      }
    } catch (error) {
      throw new Error(`DOC文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理DOCX文件
   */
  private static async processDocxFile(file: File): Promise<ProcessedFile> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file)
      const result = await mammoth.extractRawText({ arrayBuffer })
      
      return {
        title: this.extractTitle(file.name),
        content: result.value,
        type: 'docx'
      }
    } catch (error) {
      throw new Error(`DOCX文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 处理PDF文件
   */
  private static async processPdfFile(file: File): Promise<ProcessedFile> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file)
      const pdfData = await pdf(Buffer.from(arrayBuffer))
      
      return {
        title: this.extractTitle(file.name),
        content: pdfData.text,
        type: 'pdf'
      }
    } catch (error) {
      throw new Error(`PDF文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 读取文件为文本
   */
  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('无法读取文件内容'))
        }
      }
      
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file, 'utf-8')
    })
  }

  /**
   * 读取文件为ArrayBuffer
   */
  private static readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result
        if (result instanceof ArrayBuffer) {
          resolve(result)
        } else {
          reject(new Error('无法读取文件内容'))
        }
      }
      
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 从文件名提取标题
   */
  private static extractTitle(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, '') // 移除文件扩展名
  }

  /**
   * 获取支持的文件格式列表
   */
  static getSupportedFormats(): Array<{ extension: string; name: string; description: string }> {
    return [
      { extension: 'txt', name: '纯文本文件', description: '支持UTF-8编码的文本文件' },
      { extension: 'epub', name: '电子书', description: 'EPUB格式的电子书文件' },
      { extension: 'doc', name: 'Word文档', description: 'Microsoft Word 97-2003文档' },
      { extension: 'docx', name: 'Word文档', description: 'Microsoft Word 2007+文档' },
      { extension: 'pdf', name: 'PDF文档', description: 'Adobe PDF文档' }
    ]
  }

  /**
   * 检查文件格式是否支持
   */
  static isFormatSupported(fileName: string): boolean {
    const supportedExtensions = ['txt', 'epub', 'doc', 'docx', 'pdf']
    const fileExtension = fileName.toLowerCase().split('.').pop() || ''
    return supportedExtensions.includes(fileExtension)
  }

  /**
   * 获取文件大小限制（以字节为单位）
   */
  static getFileSizeLimit(): number {
    return 50 * 1024 * 1024 // 50MB
  }

  /**
   * 检查文件大小是否在限制内
   */
  static isFileSizeValid(file: File): boolean {
    return file.size <= this.getFileSizeLimit()
  }
}
