
async function main() {
  const db = (await import('../src/server/db.mjs')).default
  console.log('imported db:', db)
}

main()
