import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const DOUBAO_API_KEY = 'ark-39bf3f1b-08bc-4f29-b3ad-a4315e8b9153-f639d';

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

async function extractTextFromFile(file) {
  const ext = file.originalname.toLowerCase().split('.').pop();
  
  try {
    if (ext === 'pdf') {
      const data = await pdfParse(file.buffer);
      return data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    } else if (ext === 'doc') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }
    throw new Error('不支持的文件格式');
  } catch (error) {
    console.error('文件解析错误:', error);
    throw new Error('文件解析失败');
  }
}

async function analyzeDocumentWithDoubao(text) {
  const prompt = `你是一位专业的招投标文件审核专家。请对以下招投标文件进行全面检查，从以下几个维度识别问题：

1. **格式规范检查**：字体字号、行距页边距、章节编号连续性、页码、标点符号全角半角混用
2. **条款逻辑冲突**：前后矛盾表述、资质要求冲突、付款方式不一致、工期描述矛盾
3. **商务合规检查**：保证金金额、投标有效期、签字盖章位置、联系人信息完整性
4. **技术参数检查**：技术规格一致性、设备型号准确性、工程量清单准确性
5. **法规合规检查**：引用法规时效性、资质要求合理性
6. **文案低级错误**：错别字、标点混用、金额大小写不一致

请仔细阅读以下文档内容，识别所有问题，并返回JSON格式的检查结果：

文档内容：
${text.substring(0, 15000)}

请返回以下JSON格式（不要返回其他内容）：
{
  "totalErrors": 错误总数,
  "passRate": 通过率百分比,
  "categories": [
    {"category": "格式规范", "count": 数量, "percentage": 百分比},
    {"category": "条款逻辑", "count": 数量, "percentage": 百分比},
    {"category": "商务合规", "count": 数量, "percentage": 百分比},
    {"category": "技术参数", "count": 数量, "percentage": 百分比},
    {"category": "法规合规", "count": 数量, "percentage": 百分比},
    {"category": "文案错误", "count": 数量, "percentage": 百分比}
  ],
  "errors": [
    {
      "id": "1",
      "type": "format/logic/compliance/technical/typo",
      "category": "错误类别",
      "position": {"line": 行号, "column": 列号},
      "description": "错误描述",
      "suggestion": "修改建议",
      "severity": "high/medium/low",
      "legalBasis": "相关法规依据（如果有）"
    }
  ]
}`;

  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DOUBAO_API_KEY}`
    },
    body: JSON.stringify({
      model: 'doubao-pro-32k',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的招投标文件审核专家，擅长发现招标文件中的各类问题。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`豆包API请求失败: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('无法解析模型返回结果');
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' });
    }

    const text = await extractTextFromFile(req.file);
    
    res.json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      textLength: text.length,
      text: text
    });
  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: '请提供文档内容' });
    }

    const result = await analyzeDocumentWithDoubao(text);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('分析错误:', error);
    res.status(500).json({ 
      error: error.message
    });
  }
});

app.post('/api/upload-and-analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' });
    }

    const text = await extractTextFromFile(req.file);
    const result = await analyzeDocumentWithDoubao(text);
    
    res.json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      result
    });
  } catch (error) {
    console.error('处理错误:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
  console.log('API端点:');
  console.log('  POST /api/upload - 上传并解析文件');
  console.log('  POST /api/analyze - 使用豆包大模型分析文档');
  console.log('  POST /api/upload-and-analyze - 一键上传+分析');
});
