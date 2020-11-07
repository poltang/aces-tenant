import Head from 'next/head'
import DefaultErrorPage from 'next/error'

export default function NotFound() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>ACES - Page Not Found</title>
      </Head>
      <DefaultErrorPage statusCode={404} />
    </>
  )
}