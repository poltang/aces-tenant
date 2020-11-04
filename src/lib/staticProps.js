export async function getLicenseInfo(db, slug) {
  try {
    const doc = await db.collection('licenses').findOne({ code: slug })
    const json = JSON.parse( JSON.stringify(doc) )
    const info = {
      code: json.code,
      type: json.type,
      licenseName: json.licenseName,
      publishDate: json.publishDate,
    }

    return info
  } catch (error) {
    throw error
  }
}