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

function generateMockResult(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const errors = [];
  let errorId = 1;
  
  errors.push({
    id: String(errorId++),
    type: 'format',
    category: '系统提示',
    position: { line: 1, column: 1 },
    description: '牛马罢工，人事正在协商',
    suggestion: '当前AI服务暂时不可用，系统将使用本地规则进行基础检查',
    severity: 'low',
    legalBasis: ''
  });
  
  if (lines.length < 10) {
    errors.push({
      id: String(errorId++),
      type: 'format',
      category: '格式规范',
      position: { line: 1, column: 1 },
      description: '文档内容过短，请上传完整的招投标文件',
      suggestion: '请上传完整的招投标文件以便进行全面检查',
      severity: 'low',
      legalBasis: ''
    });
  }
  
  if (text.includes('工程') || text.includes('项目')) {
    errors.push({
      id: String(errorId++),
      type: 'logic',
      category: '条款逻辑',
      position: { line: Math.min(5, lines.length), column: 1 },
      description: '建议检查工期描述是否一致',
      suggestion: '请确认文档中所有工期描述保持一致',
      severity: 'medium',
      legalBasis: ''
    });
  }
  
  if (text.includes('保证金') || text.includes('金额')) {
    errors.push({
      id: String(errorId++),
      type: 'compliance',
      category: '商务合规',
      position: { line: Math.min(10, lines.length), column: 1 },
      description: '建议检查保证金金额是否符合规定',
      suggestion: '根据招投标法，保证金金额不应超过项目估算价的2%',
      severity: 'high',
      legalBasis: '《招标投标法实施条例》第二十六条'
    });
  }
  
  errors.push({
    id: String(errorId++),
    type: 'typo',
    category: '文案错误',
    position: { line: Math.min(3, lines.length), column: 1 },
    description: '检查标点符号使用是否规范',
    suggestion: '建议使用全角标点符号',
    severity: 'low',
    legalBasis: ''
  });
  
  const totalErrors = errors.length;
  const passRate = Math.max(70, 100 - totalErrors * 5);
  
  return {
    totalErrors,
    passRate,
    categories: [
      { category: '系统提示', count: 1, percentage: Math.round((1 / totalErrors) * 100) },
      { category: '格式规范', count: errors.filter(e => e.category === '格式规范').length, percentage: Math.round((errors.filter(e => e.category === '格式规范').length / totalErrors) * 100) || 0 },
      { category: '条款逻辑', count: errors.filter(e => e.category === '条款逻辑').length, percentage: Math.round((errors.filter(e => e.category === '条款逻辑').length / totalErrors) * 100) || 0 },
      { category: '商务合规', count: errors.filter(e => e.category === '商务合规').length, percentage: Math.round((errors.filter(e => e.category === '商务合规').length / totalErrors) * 100) || 0 },
      { category: '技术参数', count: 0, percentage: 0 },
      { category: '法规合规', count: errors.filter(e => e.category === '法规合规').length, percentage: Math.round((errors.filter(e => e.category === '法规合规').length / totalErrors) * 100) || 0 },
      { category: '文案错误', count: errors.filter(e => e.category === '文案错误').length, percentage: Math.round((errors.filter(e => e.category === '文案错误').length / totalErrors) * 100) || 0 }
    ],
    errors
  };
}

async function analyzeDocumentWithDoubao(text) {
  try {
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
            content: '你是一位专业的招投标文件审核专家，擅长发现招标文件中的各类问题。请直接返回JSON格式的检查结果，不要添加任何解释性文字。'
          },
          {
            role: 'user',
            content: `请对以下招投标文件进行检查，返回JSON格式结果：\n\n${text.substring(0, 5000)}`
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      console.error(`API请求失败: ${response.status}`);
      throw new Error(`API请求失败，使用模拟数据`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API返回格式异常');
    }

    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析JSON');
    }
  } catch (error) {
    console.error('调用API失败，使用模拟数据:', error.message);
    return generateMockResult(text);
  }
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
  console.log('  POST /api/analyze - 使用大模型分析文档');
  console.log('  POST /api/upload-and-analyze - 一键上传+分析');
});