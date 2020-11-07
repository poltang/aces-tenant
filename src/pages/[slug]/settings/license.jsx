import { useState } from 'react'
import Head from 'next/head'
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getLicensePaths, getLicenseInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import LicenseInfo from 'components/LicenseInfo'

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getLicensePaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  try {
    const rs = await db.collection('licenses').findOne({ code: params.slug })
    const license = JSON.parse( JSON.stringify(rs) )

    return {
      props: { info, license },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function License({ info, license }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ [info, user], license ]

  return (
    <Layout bg="white" info={info} activeNav="settings" debugs={debugs}>
      <div className="px-4 sm:px-6 py-10">
        <div className="aces-geist">
          <div className="flex flex-row">
            <div className="hidden sm:block sm:w-32 md:w-40 sm:-mt-2">
              <Sidebar info={info} selected="license"/>
            </div>
            {/*  */}
            <div className="flex-grow sm:ml-10">
              <div className="">
                <Link href="/[slug]/settings" as={`/${info?.code}/settings`}>
                  <a className="block sm:hidden bg-white font-semibold border-b -mx-4 -mt-10 mb-8 px-4 py-6">
                    <div className="hover:text-gray-500">
                      <svg className="inline-block mr-2 stroke-current stroke-2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision"><path d="M15 18l-6-6 6-6"></path></svg>
                      <span className="">Back to Setting</span>
                    </div>
                  </a>
                </Link>
              </div>
              <LicenseInfo license={license} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}