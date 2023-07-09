import * as dotenv from "dotenv"
import { z } from "zod";
dotenv.config()

import { Client } from '@elastic/elasticsearch'



const cloudId = process.env.ELASTIC_SEARCH_CLOUD_ID || ''
const apiKey = process.env.ELASTIC_SEARCH_API_KEY || ''
 
const client = new Client({
  cloud: { id: cloudId},
  auth: { apiKey: apiKey}
});

// 測試連線狀態
client.info()
    .then((response: object) => console.log(response))
    .catch((error: any) => console.error(error));

interface Document {
    title: string
    content: string
    highlight:string[]
}

const elasticSearchDataSchema = z.object({
    hits: z.object({
      hits: z.array(
        z.object({
          _source: z.object({
            id: z.string(),
            title: z.string(),
          }),
          highlight:z.object({
            content: z.array(z.string()), // 修改此行
          })
        })
      ),
    }),
  });

export async function searchByElastic(keywords: string[]){
    const matchData = keywords.map((ele) => ({ match : { content: ele }}))
    const data = await client.search<Document>({
        index: 'search-friends',
        // index: process.env.ELASTIC_SEARCH_INDEX || 'search-chichi',
        query: {
          bool:{
             must:matchData
          },       
      },
        highlight: {
          fields: {
            content: {}
          }
        }
    })

    console.log('符合關鍵字的document-->',data.hits.hits)
    // data.hits.hits.forEach((hit) => {
    //   console.log('與關鍵字相符的文字highlight-->', hit.highlight);
    // });

    const checkData = elasticSearchDataSchema.parse(data)
    const hitsArray = checkData.hits.hits;
    const articleId = hitsArray.map(item => {
        return parseInt(item._source.id.split('articles_')[1])
    })
    console.log('articleId->',articleId );
    return articleId
}
