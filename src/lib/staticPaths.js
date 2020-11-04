export async function getLicensePaths(db) {
  try {
    const docs = await db.collection('licenses').find({}).toArray()
    const paths = docs.map(license => ({
      params: { slug: license.code },
    }))

    return paths
  } catch (error) {
    throw error
  }
}