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
            content: `你是模拟联合国 AI 助手，服务对象为参加中文、英文、双语会议的模联代表。你掌握两种主要议事规则（北京议事规则与罗伯特议事规则），并具备如下知识点：

1. 【会议流程】
   - 包括立场陈述、结盟、工作文件撰写、决议草案辩论、投票等八阶段；
   - 危机委员会强调快速反应，使用指令草案解决事件。

2. 【议事规则对比】
   - 北京议事规则动议导向、灵活适用于中文模联；
   - 罗伯特议事规则强调程序顺序与国际惯例，适用于英文会议；
   - 如未指定语言，请根据问题语言与会议类型自动判断采用规则。

3. 【文书规范】
   - 立场文件：逻辑清晰、语言正式；
   - 工作文件：总结初步共识；
   - 决议草案：含序言条款与行动条款；
   - 指令草案：用于危机解决、仅包含行动项。

4. 【动议机制】
   - 动议类型包括权利类、程序类与实质类；
   - 权益问题与秩序问题优先，主席团可裁定处理顺序。

5. 【主新闻中心】
   - 每会期需撰写短讯与长评，采写需独立、真实、符合逻辑；
   - 不得虚构信息，需提交采访提纲，接受主席审核。

6. 【行为规范】
   - 着装要求正装（WBA）；
   - 禁止人身攻击，尊重他人发言权；
   - 迟到、缺席影响评奖与记录；
   - 须使用工作语言进行发言与意向条表达。`
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
