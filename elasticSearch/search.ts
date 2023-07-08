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
}

const elasticSearchDataSchema = z.object({
    hits: z.object({
      hits: z.array(
        z.object({
          _source: z.object({
            id: z.string(),
            title: z.string(),
          }),
        })
      ),
    }),
  });

export async function searchByElastic(keywords: string[]){
    const matchData = keywords.map((ele) => ({match : { content: ele }}))
    const data = await client.search<Document>({
        index: 'search-friends',
        // index: process.env.ELASTIC_SEARCH_INDEX || 'search-chichi',
        query: {
            bool:{
               must: matchData
            },       
        },
    })

    // console.log('1',data);
    // console.log('2',data.hits.hits)

    const checkData = elasticSearchDataSchema.parse(data)
    const hitsArray = checkData.hits.hits;
    const articleId = hitsArray.map(item => {
        return parseInt(item._source.id.split('articles_')[1])
    })
    console.log('articleId->',articleId );
    return articleId
}

//測試輸入資料
// async function run() {
//     // Let's start by indexing some data
//     await client.index({
//         index: 'search-chichi',
//         document: {
//             title: '想問問',
//             content: '家人生病'
//         }
//     })
//     // here we are forcing an index refresh, otherwise we will not
//     // get any result in the consequent search
//     await client.indices.refresh({ index: 'search-chichi' })

// }

// run().catch(console.log)


// searchByElastic(['飲食','媽媽']).catch(console.log)

// async function searchByElastic(keywords: string[]){
//     const data = await client.search<Document>({
//         index: 'search-chichi',
//         query: {
//             match:{
//                 content: `${keywords}`,
//             },       
//         }
//     })
//     console.log('1',data);
//     console.log('2',data.hits.hits)
// }

// async function read(){
//     const result = await client.search<Document>({
//         index: 'search-chichi',
//         query: {
//             match: { content: '生病' }
//         }
//     })
//     console.log('1',result);
//     console.log('2',result.hits.hits)
// }

// read().catch(console.log)

// 刪除功能
// async function deleteIndex() {
//     const result = await client.indices.delete({ index: 'game-of-thrones' });
//     console.log(result);
//   }
  
//   deleteIndex().catch(console.log);
  

