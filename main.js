import mysql from 'mysql2/promise'
import toPascalCase from 'js-pascalcase'
import toCamelCase from 'js-camelcase'

const onlyShowSQL = true

// create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'example',
  password: 'password'
})

const [results] = await connection.query('SHOW TABLES;')

const tableNameList = results.map(i => Object.values(i)[0])

tableNameList.forEach(async tableName => {
  const sql = "ALTER TABLE `" + tableName + "` RENAME TO `" + toPascalCase(tableName) + "`;"
  if (onlyShowSQL) {
    console.log(sql)
  } else {
    await connection.query(sql)
  }

  const [columnList] = await connection.query("SHOW COLUMNS FROM `" + (onlyShowSQL ? tableName : toPascalCase(tableName)) + "`;")

  columnList.forEach(async column => {
    const sql = "ALTER TABLE `" + tableName + "` RENAME COLUMN`" + column.Field + "` TO `" + toCamelCase(column.Field) + "`;"
    if (onlyShowSQL)
      console.log(sql)
    else {
      await connection.query(sql)
    }
  })
})

console.log('Finished.')
