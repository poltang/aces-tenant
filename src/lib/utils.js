import { connect } from 'lib/database'

export async function getLicensePaths(db) {
  // const { db } = await connect()
  try {
    const rs = await db.collection('licenses').find(
      {},
      {projection: {_id: 0, slug: 1}}
    ).toArray()

    const paths = rs.map((license) => ({
      params: { license: license?.slug },
    }))

    return paths; //  { paths, fallback: true }
  } catch (error) {
    throw error
  }
}

export async function getProjectPaths(db) {
  console.log("getProjectPaths")
  // const { db } = await connect()
  try {
    const rs = await db.collection('projects').find(
      {},
      {projection: {_id: 1, license: 1}}
    ).toArray()

    const paths = rs.map((project) => ({
      params: { license: project.license, id: project._id.toString() },
    }))

    return paths; //  { paths, fallback: true }
  } catch (error) {
    throw error
  }
}

export async function getLicenseInfo(db, slug) {
  // if (!db || !slug) return {
  //   licenseSlug: '',
  //   licenseName: '',
  // }
  // const { db } = await connect()
  try {
    const rs = await db.collection('licenses').findOne({ slug: slug })
    const json = JSON.parse( JSON.stringify(rs) )
    const info = {
      licenseSlug: json.slug,
      licenseName: json.licenseName,
    }

    return info
  } catch (error) {
    throw error
  }
}