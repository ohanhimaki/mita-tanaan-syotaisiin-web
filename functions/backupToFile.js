
// https://dba.stackexchange.com/questions/318299/how-to-backup-faunadb-collection
const process = require('process')
const { Client, query } = require('faunadb')
// import fs from 'fs'
const fs = require('fs')
// import {Collections,createIndex} from '.bootstrapDatabase.js'
const {Collections, createIndex} = require('./bootstrapDatabase.js')
const client0 = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const backupFaunadb = async (indexName, pageSize, noOfPages) => {

  let after = []     // cursor to move to next page
  try {
    for (let i = 0; i < noOfPages; i++) {
      if (after === undefined) break    // stop after last page
      const result = await client0.query(
        query.Map(
          query.Paginate(query.Match(query.Index(indexName)), { size: pageSize, after }),
          query.Lambda('param1', query.Get(query.Var('param1')))  // here word 'param1' is random-word
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

const backupSolanaVault = async (collectionName) => {
  const pageSize = 1000, noOfPages = 1000

// Create Index for collection with Terms field as empty (so we will get all objects in database without any filtering),
// and fetch all data inside collection using that index as follows:
  const indexName = `backup_${collectionName}`
  const values = []
  const terms = []
  await createIndex(indexName, collectionName, values, terms)



  const promisesArr = [
    backupFaunadb(indexName, pageSize, noOfPages),
  ]
  await Promise.all(promisesArr)
}

const backupAllCollections = async () => {
  // var results = Collections.forEach(async (collectionName) => {
  //   await backupSolanaVault(collectionName)
  // });

  const propertiesOfCollections = Object.keys(Collections)
  return propertiesOfCollections.map(async (collectionName) => {
    await backupSolanaVault(collectionName)
  })



}

const handler = async () => {
  // wait backup
  await backupAllCollections();

  return {
    statusCode: 200,
    body: JSON.stringify("Backup done"),
  }
}


module.exports = { handler }
