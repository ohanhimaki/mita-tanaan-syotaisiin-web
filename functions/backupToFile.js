
// https://dba.stackexchange.com/questions/318299/how-to-backup-faunadb-collection
const process = require('process')
const { Client, query } = require('faunadb')
import fs from 'fs'
const client0 = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const backupFaunadb = async (indexName, pageSize, noOfPages) => {

  let after = []     // cursor to move to next page
  try {
    for (let i = 0; i < noOfPages; i++) {
      if (after === undefined) break    // stop after last page
      const result = await client0.query(
        q.Map(
          q.Paginate(q.Match(q.Index(indexName)), { size: pageSize, after }),
          q.Lambda('param1', q.Get(q.Var('param1')))  // here word 'param1' is random-word
        )
      )
      after = result.after
      console.log(after)
      const result0 = result.data.map(obj => obj.data)
      const result1 = JSON.stringify(result0, null, 2)

      await fs.promises.writeFile(`./${indexName}-${i}.json`, result1)
    }
  } catch (err) {
    console.log(err)
  }
}

const backupSolanaVault = async () => {
  const pageSize = 50, noOfPages = 5
  const promisesArr = [
    backupFaunadb('all_telegraph', pageSize, noOfPages),
  ]
  await Promise.all(promisesArr)
}

backupSolanaVault()
