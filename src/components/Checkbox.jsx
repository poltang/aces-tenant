import { useState } from 'react'

export function CB({ checked, handler }) {
  const [state, setState] = useState(checked)
  const b0 = "btn flex w-4 h-4 rounded-fulls border border-gray-400 hover:border-gray-500"
  const b1 = "btn btn-on flex w-4 h-4 rounded-fulls bg-blue-400 border border-blue-400"

  function doHandler(e) {
    setState(!state)
    if (handler) handler(e)
  }

  return (
    <>
    <button onClick={doHandler} className={state ? b1 : b0}>
      <div className="inner w-full h-full rounded-fulls border border-gray-200">&nbsp;</div>
    </button>
    <style jsx>{`
    .btn {
      padding: 2px;
    }
    .inner {
      border-width: 2px;
      font-size:6px;
      line-height: 6px
    }
    .btn:hover .inner {

    }
    .btn.btn-on .inner {
      border-color: #fff;
      background-color: #67afe3;
    }
    .btn.btn-on:hover .inner {
      background-color: #fff;
    }
    `}</style>
    </>
  )
}