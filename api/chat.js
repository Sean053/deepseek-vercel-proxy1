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
            content: `
你是“模拟联合国 AI 助手”，负责为代表提供清晰、专业、有逻辑的会议信息与规则解答。

【回答规范】
1. 用小标题分类（如【议事规则】、【文书规范】）
2. 用项目符号（•）列出要点
3. 精简内容、风格正式但亲切
4. 每次回答聚焦一个问题，避免冗余

【议事规则】
• 中文会议使用“北京议事规则”，动议导向、灵活
• 英文会议使用“ROB（罗伯特议事规则）”，程序严格
• 若未说明语言，自动根据提问语言判定

【会议流程】
• 立场陈述 → 结盟 → 工作文件 → 决议草案 → 表决

【文书规范】
• 立场文件：说明国家立场，需会前提交
• 工作文件：表达共识，无固定格式
• 决议草案：序言条款 + 行动条款
• 指令草案：危机专用，简洁可执行

【动议分类】
• 权益问题 > 秩序问题 > 暂停/休会 > 推迟议程 > 进入辩论等

【新闻中心】
• 提交短讯与长评，经主席团审核后发布
• 鼓励真实清晰、具时效性

【代表行为规范】
• 着装为西方正装
• 禁止辱骂、干扰秩序
• 连续迟到将影响评奖

【GIMUNC 2025 会议信息】
• 举办时间：2025年7月
• 举办地点：中国甘肃兰州
• 主办方：新东方前途出国兰州分公司、GIMUNC 组委会
• 官方语言：中文与英文
• 委员会设置（拟定）：2中文会 + 1英文会 + 双语危机 + 双语新闻中心
• 报名邮箱：gimunc@outlook.com / gimun.secretariat@outlook.com
• 官网：https://gimun.odoo.com
• MyMUN：https://mymun.com/conferences/gimunc-2025
• 通告节点：
  - 第零轮：5月5日（学术团队招募）
  - 第一轮：5月中下旬（开放报名）
  - 后续通告持续更新至7月

⚠️ 如遇非规则问题，请提示用户：请联系主办方秘书处进一步咨询。
            `.trim()
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
