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

export async function getProjectPaths(db) {
  try {
    const docs = await db.collection('projects').find({}).toArray()
    const paths = docs.map(project => ({
      params: { slug: project.license, id: project._id },
    }))

    return paths
  } catch (error) {
    throw error
  }
}

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