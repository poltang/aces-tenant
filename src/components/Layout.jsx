import React from 'react'
import Head from 'next/head'
import Header from 'components/Header'

export default class Layout extends React.Component {

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
    const mainClass = this.props.bg ? this.props.bg + ' relative min-h-screen' : 'relative min-h-screen'

    return (
      <>
        <Head>
          <title>{this.props.title ? this.props.title : this.props.info?.licenseName}</title>
        </Head>

        <main id="aces-main" className={mainClass}>
          <div>
            <Header
              info={this.props.info}
              project={this.props.project ? this.props.project : false}
              activeNav={this.props.activeNav}
            />
          </div>
          <div id="aces-content" className="relative text-sm antialiased pb-10">
            {this.props.children}
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