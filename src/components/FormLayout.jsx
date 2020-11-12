import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from 'components/Header'

export default class FormLayout extends React.Component {

  handleScroll = function(e) {
    if (window.pageYOffset > 55) {
      // document.getElementById('aces-main').classList.add('scrolled');
    } else {
      // document.getElementById('aces-main').classList.remove('scrolled');
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  // This layout will be statically generated,
  // can't use user which is only available at runtime

  render() {
    const mainClass = this.props.bg ? this.props.bg + ' relative min-h-screen' : 'relative min-h-screen'

    return (
      <>
        <Head>
          <title>{this.props.title ? this.props.title : this.props.info?.licenseName}</title>
        </Head>

        <main id="aces-main" className={mainClass}>
          {/* <div>
            <div className="antialiased">
              <div className="bg-white px-4 sm:px-6">
                <div className="aces-geist text-sm py-3">
                  <div className="flex flex-row items-center">
                    <div className="flex flex-grow items-center">
                      <div id="aces-logo" className="rounded-full cursor-default p-1 h-8 w-8 -ml-1 mr-4">
                        <div className="rounded-full h-full bg-white hover:bg-transparent text-green-600 hover:text-white text-xl leading-5 text-center font-bold">a</div>
                      </div>
                      <div className="flex-grow">
                        <Link href={`/${this.props.info.code}`}>
                          <a className="text-gray-800 font-semibold">{this.props.info.licenseName}</a>
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-row items-center text-gray-600 leading-snug">
                      <div className="hidden sm:block">
                        <Link href="#">
                          <a className="mr-4 hover:text-gray-800">Support</a>
                        </Link>
                        <Link href="#">
                          <a className="mr-4 hover:text-gray-800">Docs</a>
                        </Link>
                      </div>
                      <Link href="/api/logout">
                        <a onClick={async (e) => {
                          e.preventDefault()
                          await mutateUser(fetchJson('/api/logout'))
                          router.push('/login')
                        }} className="rounded-sms border px-2 py-1 mt-px hover:text-gray-800 hover:border-gray-600">
                          <span className="block pb-px">Logout</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div id="aces-fixed" className="aces-form bg-white z-50 tracking-tight border-b border-gray-400">
                <div className="px-4 sm:px-6">
                  <div className="aces-geist">
                    <div className="flex items-end text-sm cursor-default">
                      <div className="aces-prompt-logo flex">
                        <div className="aces-logo-rainbow rounded-full p-1 h-6 w-6">
                          <div className="rounded-full h-full bg-white hover:bg-transparent text-pink-500 hover:text-white text-sm leading-3 pt-px text-center font-bold">a</div>
                        </div>
                      </div>
                      <div className="aces-prompt-nav flex flex-row flex-grow">
                        <div className="title text-xl text-gray-600 tracking-wide leading-loose -my-px py-1">
                          {this.props.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="px-4 sm:px-6 pt-10 pb-32">
            <div className="aces-geist text-sm antialiased">
              {this.props.children}
            </div>
          </div>
        </main>
        <footer id="aces-footer" className="antialiased h-64 text-xs text-gray-500 border-t border-gray-300">
          <p className="text-center my-6">GAIA ACES - LICENSE FOOTER</p>
        </footer>

        {process.env.NODE_ENV != 'production' && this.props.debugs && this.props.debugs.length > 0 && (
        <>
          <div className="debug antialiased bg-gray-600 py-4 px-4 sm:px-6">
            <div className={`grid grid-cols-${this.props.debugs.length} gap-4`}>
            {this.props.debugs.map((object, index) => (
              <div key={`debug-${index}`} className="border-l pl-2 border-gray-500 text-white">
                <pre className="overflow-scroll">{JSON.stringify(object, null, 2)}</pre>
              </div>
            ))}
            </div>
          </div>
          <style jsx>{`
          .debug {
            font-size: 11px;
          }
          .debug pre {
            max-height: 400px
          }
          `}</style>
        </>
        )}
      </>
    )
  }
}