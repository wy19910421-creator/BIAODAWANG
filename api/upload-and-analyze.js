const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const DOUBAO_API_KEY = 'ark-39bf3f1b-08bc-4f29-b3ad-a4315e8b9153-f639d';
const DOUBAO_ENDPOINT_ID = 'ep-20260510220258-bx5rk';

async function extractTextFromFile(buffer, filename) {
  const ext = filename.toLowerCase().split('.').pop();
  
  try {
    if (ext === 'pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (ext === 'docx' || ext === 'doc') {
      const result = await mammoth.extractRawText({ buffer });
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
      description: '文档内容过短',
      suggestion: '请上传完整的招投标文件',
      severity: 'low',
      legalBasis: ''
    });
  }
  
  if (text.includes('工程') || text.includes('项目')) {
    errors.push({
      id: String(errorId++),
      type: 'logic',
      category: '条款逻辑',
      position: { line: 5, column: 1 },
      description: '建议检查工期描述是否一致',
      suggestion: '请确认工期描述保持一致',
      severity: 'medium',
      legalBasis: ''
    });
  }
  
  if (text.includes('保证金') || text.includes('金额')) {
    errors.push({
      id: String(errorId++),
      type: 'compliance',
      category: '商务合规',
      position: { line: 10, column: 1 },
      description: '建议检查保证金金额',
      suggestion: '保证金不应超过项目估算价的2%',
      severity: 'high',
      legalBasis: '《招标投标法实施条例》'
    });
  }
  
  errors.push({
    id: String(errorId++),
    type: 'typo',
    category: '文案错误',
    position: { line: 3, column: 1 },
    description: '检查标点符号',
    suggestion: '建议使用全角标点',
    severity: 'low',
    legalBasis: ''
  });
  
  const totalErrors = errors.length;
  const passRate = Math.max(70, 100 - totalErrors * 5);
  
  return {
    totalErrors,
    passRate,
    categories: [
      { category: '格式规范', count: errors.filter(e => e.category === '格式规范').length, percentage: 25 },
      { category: '条款逻辑', count: errors.filter(e => e.category === '条款逻辑').length, percentage: 25 },
      { category: '商务合规', count: errors.filter(e => e.category === '商务合规').length, percentage: 25 },
      { category: '技术参数', count: 0, percentage: 0 },
      { category: '法规合规', count: 0, percentage: 0 },
      { category: '文案错误', count: errors.filter(e => e.category === '文案错误').length, percentage: 25 }
    ],
    errors
  };
}

async function analyzeDocumentWithDoubao(text) {
  const endpoints = [
    `https://ark.cn-beijing.volces.com/api/v3/bots/${DOUBAO_ENDPOINT_ID}/completions`,
    `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`尝试: ${endpoint}`);
      
      const body = endpoint.includes('/bots/') 
        ? {
            messages: [
              { role: 'system', content: '你是招投标审核专家，请返回JSON格式结果。' },
              { role: 'user', content: `检查文档返回JSON: ${text.substring(0, 2000)}` }
            ],
            temperature: 0.3
          }
        : {
            model: 'doubao-pro-32k',
            messages: [
              { role: 'system', content: '你是招投标审核专家，请返回JSON格式结果。' },
              { role: 'user', content: `检查文档返回JSON: ${text.substring(0, 2000)}` }
            ],
            temperature: 0.3
          };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOUBAO_API_KEY}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error(`失败: ${response.status}`);
        continue;
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
      
      if (!content) continue;

      try {
        return JSON.parse(content);
      } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
      }
    } catch (error) {
      console.error(`错误: ${error.message}`);
    }
  }

  return generateMockResult(text);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ error: '请上传文件' });
    }

    console.log(`处理文件: ${file.name}`);
    
    const text = await extractTextFromFile(file.buffer, file.name);
    const result = await analyzeDocumentWithDoubao(text);
    
    res.status(200).json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      result
    });
  } catch (error) {
    console.error('处理错误:', error);
    res.status(500).json({ error: error.message });
  }
};
