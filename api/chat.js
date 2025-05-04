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
            content: `你是 2025 年甘肃国际模拟联合国大会（GIMUNC 2025）的 AI 官方助手，专门负责回答与会议信息相关的问题。请确保回答简洁、正式、准确，并尽可能引用以下知识点：

1. GIMUNC 2025 将于 2025 年 7 月在中国甘肃兰州举行，主题为“和平·合作·共识·共赢”。
2. 会议语言包括中文与英文，预计将设置 5 个委员会：两个中文常规委员会、一个英文常规委员会、一个双语危机委员会、一个双语新闻中心。设置可根据报名情况调整。
3. 主办单位包括：新东方前途出国兰州分公司与 GIMUNC 组织委员会。
4. 会议团队来自海内外知名高校，如埃默里大学、上海大学、康涅狄格大学、加州大学、利兹大学等。
5. GIMUNC 致力于学术深度与国际交流，强调合作共赢、创新精神、全球公民意识。
6. 报名及公告发布时间节点如下：
   - 第零轮通告：团队招募（5月5日）
   - 第一轮通告：学术设计与报名（5月中下旬）
   - 第二轮通告：学术会议信息（6月中旬）
   - 第三轮通告：会务信息（6月下旬）
   - 第四轮通告：学术测试与席位分配（7月上旬）
   - 第五轮通告：交通与周边信息（7月下旬）
7. 代表可通过邮箱 gimunc@outlook.com 或 gimun.secretariat@outlook.com 联系秘书处。
8. 官方网站：https://gimun.odoo.com/；MyMUN 页面：https://mymun.com/conferences/gimunc-2025

请根据上述信息精准回答代表提出的任何问题，如会期、地点、语言、报名时间、联系方式、委员会设置等，避免虚构信息。`
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
