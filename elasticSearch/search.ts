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
    analyzer:string
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

export async function searchByElastic(keywords: string[]){
    // const matchData = keywords.map((ele) => ({ match : { content: ele }}))
    const data = await client.search<Document>({
        size: 20, // 因為default回傳是10筆，如果size要改，可以去hits.value拿這邊修改的size數量資料
        index: 'search-friends',
        q: keywords.join(','), //分詞器會自動把詞句找出最適合的單詞，所以傳string
        analyzer: "icu_analyzer"
    })
    console.log('keywords',keywords.join(','));
    // console.log('符合關鍵字的document-->',data.hits.hits)
    const checkData = elasticSearchDataSchema.parse(data);
    // console.log('checkData->',checkData);
    const hitsArray = checkData.hits.hits;
    // console.log('hitsArray->',hitsArray);
    const articleId = hitsArray.map(item => {
        return parseInt(item._source.id.split('articles_')[1])
    })
    console.log('articleId->',articleId );
    return articleId
}


    // console.log('符合關鍵字的data-->',data)
    // console.log('符合關鍵字的document-->',data.hits.hits)
    // data.hits.hits.forEach((hit) => {
    //   console.log('與關鍵字相符的文字highlight-->', hit.highlight);
    // });
