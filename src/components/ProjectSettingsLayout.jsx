import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from 'components/Header'
import ProjectSidebar from 'components/ProjectSidebar'
import ProjectSettingHeader from 'components/ProjectSettingsHeader'



export default class ProjectSettingsLayout extends React.Component {

  handleScroll = function(e) {
    if (window.pageYOffset > 55) {
      document.getElementById('aces-main').classList.add('scrolled');
    } else {
      document.getElementById('aces-main').classList.remove('scrolled');
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
    return (
      <>
        <Head>
          <title>{this.props.title ? this.props.title : this.props.info?.licenseName}</title>
        </Head>

        <main id="aces-main" className="white relative min-h-screen">
          <div>
            <Header
              info={this.props.info}
              project={this.props.project ? this.props.project : false}
              activeNav={this.props.activeNav}
            />
          </div>
          <div id="aces-content" className="relative text-sm antialiased">

          <div className="px-4 sm:px-6 py-10">
            <div className="aces-geist">
              <div className="flex flex-row">
                <div className="hidden sm:block sm:w-32 md:w-40 sm:-mt-2">
                  <ProjectSidebar project={this.props.project} selected={this.props.selected}/>
                </div>
                {/*  */}
                <div className="flex-grow sm:ml-10">
                  <div className="">
                    <Link href="/[slug]/projects/[id]/settings" as={`/${this.props.project?.license}/projects/${this.props.project?._id}/settings`}>
                      <a className="block sm:hidden bg-white font-semibold border-b -mx-4 -mt-10 mb-8 px-4 py-6">
                        <div className="hover:text-gray-500">
                          <svg
                            className="inline-block mr-2 stroke-current stroke-2"
                            viewBox="0 0 24 24"
                            width="20" height="20"
                            fill="none"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            shapeRendering="geometricPrecision"
                          >
                            <path d="M15 18l-6-6 6-6"></path>
                          </svg>
                          <span className="">Back to Project Setting</span>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div>
                    <ProjectSettingHeader project={this.props.project} title={this.props.title}/>

                    {this.props.children}

                  </div>
                </div>
              </div>
            </div>
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