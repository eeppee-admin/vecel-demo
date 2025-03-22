import { pipeline } from '@xenova/transformers';

// 加载 NLP 模型
const classifier = await pipeline('text-classification', 'Xenova/bert-base-multilingual-uncased');

router.post('/moderate', async (req, res) => {
  const { content } = req.body;
  
  // 实时内容审核
  const { results } = await classifier(content, {
    topk: 3,
    threshold: 0.85
  });

  res.json({
    code: 200,
    data: {
      safe: results[0].label !== 'OFFENSIVE',
      scores: results
    }
  });
});