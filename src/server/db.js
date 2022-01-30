import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
// 2階層上がルートディレクトリ
const rootdir = __dirname.split('/').slice(0, -2).join('/')

// Use JSON file for storage
const file = join(rootdir, process.env.DB_NAME || 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

export default db
