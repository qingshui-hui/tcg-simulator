
async function main() {
  // https://numb86-tech.hatenablog.com/entry/2020/08/07/091142
  // CJS から ESM を読み込む
  const db = (await import('../src/server/db.mjs')).default
  console.log('imported db:', db)
}

main()
