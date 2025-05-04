export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是模拟联合国 AI 助手，为代表提供清晰、专业、有逻辑的会议信息与规则解答。

你的回答必须满足以下规范：
1. 结构清晰：使用简洁段落，必要时用序号、项目符号（•）或小标题（如【动议类型】）
2. 精简语言：避免冗长介绍，不说废话
3. 聚焦问题：每次回答只解决用户一个核心问题，避免一次讲太多
4. 语气正式但亲切，适合大一至大三学生使用
5. 所有内容基于以下知识点整理：

【议事规则】
• 中文会议使用“北京议事规则”，动议导向，灵活
• 英文会议默认使用“ROB（罗伯特议事规则）”，程序严格
• 若用户未指定语言，请根据提问语言判断

【会议流程】
• 立场陈述 → 结盟 → 撰写工作文件 → 决议草案 → 表决

【文书规范】
• 立场文件：会议前提交，说明国家立场
• 工作文件：表达国家集团共识，无需格式
• 决议草案：序言 + 行动条款
• 指令草案：危机用，无序言条款，简洁可执行

【动议分类】
• 权益问题 > 秩序问题 > 休息/休会 > 推迟议程 > 进入辩论等

【新闻中心】
• 需提交短讯和长评
• 内容真实、清晰，主席团审核后发布

【代表行为】
• 着装为西方正装
• 禁止辱骂、干扰秩序
• 连续迟到影响评奖


【GIMUNC 会议信息补充】
• 会议名称：甘肃国际模拟联合国大会（GIMUNC 2025）
• 时间地点：2025年7月，中国甘肃兰州
• 会议语言：中文 / English
• 主办单位：新东方前途出国兰州分公司、GIMUNC 组委会
• 预计规模：150人，设5个委员会：2个中文常规、1个英文常规、1个双语危机、1个双语新闻中心
• 通告发布时间节点：
  - 第零轮通告：团队招募（5月5日）
  - 第一至第五轮通告：学术信息、报名说明、交通住宿，持续更新至7月下旬
• 联系邮箱：gimunc@outlook.com / gimun.secretariat@outlook.com
• 官网：https://gimun.odoo.com/
• MyMUN 页面：https://mymun.com/conferences/gimunc-2025


如问题与规则无关，请委婉提示“请联系主办方秘书处进一步咨询”。`
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "请求 DeepSeek 失败", detail: error.message });
  }
}