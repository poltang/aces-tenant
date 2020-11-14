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
    // const doc = await db.collection('projects').findOne({ _id: id })
    // const json = JSON.parse( JSON.stringify(doc) )
    // const info = {
    //   _id: json._id,
    //   license: json.license,
    //   title: json.title,
    //   description: json.description,
    //   startDate: json.startDate,
    //   endDate: json.endDate,
    //   status: json.status,
    //   contact: json.contact,
    //   admin: json.admin,
    //   modules: json.modules,
    //   accessCode: json.accessCode,
    // }
    // return info
    const rs = await db.collection('projects').aggregate(
      { $match: { _id: id }},
      { $lookup: {
        localField: 'clientId',
        from: 'clients',
        foreignField: '_id',
        as: 'clients' // always array
      }},
      { $undwind: '$client' }
    ).toArray()
    let project = JSON.parse( JSON.stringify(rs[0]) )
    project.client = project.clients[0] ? project.clients[0] : null
    delete project.clients
    return project
  } catch (error) {
    throw error
  }
}

export async function getAcesModulesMeta(db) {
  try {
    const meta = await db.collection('modules_meta').find({}).toArray()
    const modules = await db.collection('modules').find({}, {
      projection: {
        type: 1,
        variant: 1,
        method: 1,
        name: 1,
        label: 1,
        description: 1,
        length: 1,
        maxTime: 1,
      }
    }).toArray()

    let modulesMeta = meta
    modulesMeta?.forEach((elm, index) => {
      modulesMeta[index]['selected'] = false
      modulesMeta[index]['modules'] = []
      modulesMeta[index]['collection'].forEach(variant => {
        const v = modules.find(m => m.variant == variant)
        if (v) {
          // console.log(v)
          modulesMeta[index]['modules'].push(v)
        }
      })
      delete modulesMeta[index]['collection']
    })

    return modulesMeta
  } catch (error) {
    throw error
  }
}