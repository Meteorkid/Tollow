# 📁 多格式文件支持

## 🎯 功能概述

Tollow打字练习网站现在支持多种文档格式，让用户可以上传各种类型的文件进行打字练习。

## 📋 支持的文件格式

### 1. **纯文本文件 (.txt)**
- **描述**: 支持UTF-8编码的纯文本文件
- **特点**: 加载速度快，兼容性最好
- **适用场景**: 小说、文章、代码等

### 2. **电子书 (.epub)**
- **描述**: EPUB格式的电子书文件
- **特点**: 支持结构化内容，自动提取标题
- **适用场景**: 电子书、长篇小说

### 3. **Word文档 (.doc)**
- **描述**: Microsoft Word 97-2003文档
- **特点**: 支持格式化文本，保持基本结构
- **适用场景**: 办公文档、报告、论文

### 4. **Word文档 (.docx)**
- **描述**: Microsoft Word 2007+文档
- **特点**: 现代格式，更好的兼容性
- **适用场景**: 现代Word文档、协作文档

### 5. **PDF文档 (.pdf)**
- **描述**: Adobe PDF文档
- **特点**: 跨平台兼容，保持原始格式
- **适用场景**: 学术论文、官方文档、电子书

## 🔧 技术实现

### 文件处理器架构
```typescript
export class MultiFormatFileProcessor {
  static async processFile(file: File): Promise<ProcessedFile>
  
  // 各种格式的处理方法
  private static processTextFile(file: File): Promise<ProcessedFile>
  private static processEpubFile(file: File): Promise<ProcessedFile>
  private static processDocFile(file: File): Promise<ProcessedFile>
  private static processDocxFile(file: File): Promise<ProcessedFile>
  private static processPdfFile(file: File): Promise<ProcessedFile>
}
```

### 依赖库
- **mammoth**: 处理DOC/DOCX文件
- **pdf-parse**: 处理PDF文件
- **FileReader API**: 处理TXT和EPUB文件

## 📏 文件限制

### 大小限制
- **最大文件大小**: 50MB
- **推荐文件大小**: 10MB以下
- **最小文件大小**: 1KB

### 格式限制
- 仅支持上述5种格式
- 文件必须包含可提取的文本内容
- 不支持加密或受保护的文档

## 🚀 使用方法

### 1. **拖拽上传**
- 将文件拖拽到上传区域
- 支持多文件同时拖拽（逐个处理）

### 2. **点击选择**
- 点击上传区域选择文件
- 使用系统文件选择器

### 3. **测试文件**
- 系统提供测试文件创建功能
- 支持TXT和DOCX格式测试

## ⚠️ 注意事项

### 文件质量
- 确保文件编码为UTF-8
- 避免损坏或损坏的文件
- 大型文件可能需要较长处理时间

### 格式兼容性
- DOC格式支持有限，建议使用DOCX
- PDF文件中的图片和表格可能无法正确提取
- EPUB文件需要符合标准格式

### 性能考虑
- 大文件处理时间较长
- 复杂格式可能影响性能
- 建议文件大小控制在合理范围内

## 🔮 未来扩展

### 计划支持的格式
- **RTF**: 富文本格式
- **ODT**: OpenDocument文本格式
- **HTML**: 网页文件
- **Markdown**: 标记语言文件

### 功能增强
- 批量文件处理
- 文件预览功能
- 格式转换工具
- 云端文件支持

## 📊 性能统计

### 处理速度（参考值）
- **TXT**: ~1MB/秒
- **EPUB**: ~500KB/秒
- **DOC**: ~300KB/秒
- **DOCX**: ~400KB/秒
- **PDF**: ~200KB/秒

### 内存使用
- 文件处理过程中内存使用增加
- 处理完成后自动释放
- 建议同时处理文件数量不超过3个

## 🛠️ 故障排除

### 常见问题
1. **文件无法上传**: 检查格式和大小
2. **内容显示异常**: 检查文件编码
3. **处理失败**: 尝试重新上传或使用其他格式

### 解决方案
- 使用TXT格式作为备选
- 检查文件是否损坏
- 联系技术支持

## 📚 相关文档

- [文件上传功能说明](./FILE_UPLOAD.md)
- [打字练习功能说明](./TYPING_PRACTICE.md)
- [项目架构说明](../architecture/PROJECT_STRUCTURE.md)
