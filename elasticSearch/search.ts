import * as dotenv from "dotenv"
import { z } from "zod";
dotenv.config()

import { Client } from '@elastic/elasticsearch'


const cloudId = process.env.ELASTIC_SEARCH_CLOUD_ID || ''
const apiKey = process.env.ELASTIC_SEARCH_API_KEY || ''

export const elasticClient = new Client({
  cloud: { id: cloudId },
  auth: { apiKey: apiKey }
});

// 測試連線狀態
// elasticClient.info()
//   .then((response: object) => console.log(response))
//   .catch((error: any) => console.error(error));

interface Document {
  title: string
  content: string
  highlight: string[]
  analyzer: string
}

const elasticSearchDataSchema = z.object({
  hits: z.object({
    hits: z.array(
      z.object({
        _source: z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
        }),
      })
    ),
  }),
});

export async function searchByElastic(keywords: string[]) {
  const data = await elasticClient.search<Document>({
    size: 20, // 因為default回傳是10筆
    index: 'search-friends',
    q: keywords.join(','), // 分詞器會自動把詞句找出最適合的單詞，所以傳string
    analyzer: "icu_analyzer"
  })
  const checkData = elasticSearchDataSchema.parse(data);
  const hitsArray = checkData.hits.hits;
  const articleId = hitsArray.map(item => {
    return parseInt(item._source.id.split('articles_')[1])
  })
  return articleId
}

