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

export async function getProjectInfo(db, id) {
  try {
    const doc = await db.collection('projects').findOne({ _id: id })
    const json = JSON.parse( JSON.stringify(doc) )
    const info = {
      _id: json._id,
      license: json.license,
      title: json.title,
      description: json.description,
      startDate: json.startDate,
      endDate: json.endDate,
      status: json.status,
      contact: json.contact,
      admin: json.admin,
      modules: json.modules,
      accessCode: json.accessCode,
    }

    return info
  } catch (error) {
    throw error
  }
}