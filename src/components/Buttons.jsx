import Link from 'next/link'


export function BtnLinkMini({ label, props, href, as }) {
  let base = "inline-block text-xs leading-tight"
  if (props) base += " " + props
  return (
    <div className="inline-block text-xs leading-tight">
      <Link href={href} as={as}>
        <a className="block bg-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1">
          {label}
        </a>
      </Link>
    </div>
  )
}

export function BtnMini({ name, label, value, props, handler }) {
  let base = "block border hover:text-white hover:bg-gray-700 px-2 py-1"
  if (props) base += " " + props
  return (
    <div className="inline-block text-xs leading-none">
      <button
      name={name}
      value={value}
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}


export function BtnSm({ label, props, isFull, disabled, clickHandler }) {
  let base = "hover:bg-gray-300 border border-gray-400 hover:border-gray-500 text-sm text-gray-600 hover:text-gray-700 px-4 py-2"
  if (isFull) base = "w-full " + base
  if (props) base += " " + props

  const handler = clickHandler ? clickHandler : () => {}

  if (disabled) return (
    <div className={isFull ? "inline-block w-full" : "inline-block"}>
      <button
      disabled
      className={base}>
        {label}
      </button>
    </div>
  )

  return (
    <div className={isFull ? "inline-block leading-none w-full" : "inline-block leading-none"}>
      <button
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}

export function BtnMd({ label, props, isFull, disabled, clickHandler }) {
  let base = "hover:bg-gray-300 border border-gray-400 hover:border-gray-500 text-sm text-gray-600 hover:text-gray-700 px-4 py-2"
  if (isFull) base = "w-full " + base
  if (props) base += " " + props

  const handler = clickHandler ? clickHandler : () => {}

  if (disabled) return (
    <div className={isFull ? "inline-block leading-normal w-full" : "inline-block leading-normal"}>
      <button
      disabled
      className={base}>
        {label}
      </button>
    </div>
  )

  return (
    <div className={isFull ? "inline-block leading-normal w-full" : "inline-block leading-normal"}>
      <button
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}

export function BtnHollowSm({ label, props, isFull, disabled,clickHandler }) {
  let base = "border border-gray-400 hover:border-gray-500 text-sm text-gray-600 hover:text-gray-700 px-4 py-2"
  if (isFull) base = "w-full " + base
  if (props) base += " " + props

  const handler = clickHandler ? clickHandler : () => {}

  if (disabled) return (
    <div className={isFull ? "inline-block w-full" : "inline-block"}>
      <button
      disabled
      className={base}>
        {label}
      </button>
    </div>
  )

  return (
    <div className={isFull ? "inline-block leading-none w-full" : "inline-block leading-none"}>
      <button
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}

export function BtnHollowMd({ label, props, isFull, disabled, clickHandler }) {
  let base = "border border-gray-400 hover:border-gray-500 text-sm text-gray-600 hover:text-gray-700 px-4 py-2"
  if (isFull) base = "w-full " + base
  if (props) base += " " + props

  const handler = clickHandler ? clickHandler : () => {}

  if (disabled) return (
    <div className={isFull ? "inline-block leading-normal w-full" : "inline-block leading-normal"}>
      <button
      disabled
      className={base}>
        {label}
      </button>
    </div>
  )

  return (
    <div className={isFull ? "inline-block leading-normal w-full" : "inline-block leading-normal"}>
      <button
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}

export function BtnReverseSm({ label, props, isFull, disabled, clickHandler }) {
  let base = "border border-gray-400 hover:border-gray-600 hover:bg-gray-600 text-sm text-gray-600 hover:text-white px-4 py-2"
  if (isFull) base = "w-full " + base
  if (props) base += " " + props

  const handler = clickHandler ? clickHandler : () => {}

  if (disabled) return (
    <div className={isFull ? "inline-block w-full" : "inline-block"}>
      <button
      disabled
      className={base}>
        {label}
      </button>
    </div>
  )

  return (
    <div className={isFull ? "inline-block leading-none w-full" : "inline-block leading-none"}>
      <button
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}

export function BtnReverseMd({ label, props, isFull, disabled, clickHandler }) {
  let base = "border border-gray-400 hover:border-gray-600 hover:bg-gray-600 text-sm text-gray-600 hover:text-white px-4 py-2"
  if (isFull) base = "w-full " + base
  if (props) base += " " + props

  const handler = clickHandler ? clickHandler : () => {}

  if (disabled) return (
    <div className={isFull ? "inline-block leading-normal w-full" : "inline-block leading-normal"}>
      <button
      disabled
      className={base}>
        {label}
      </button>
    </div>
  )

  return (
    <div className={isFull ? "inline-block leading-normal w-full" : "inline-block leading-normal"}>
      <button
      onClick={handler}
      className={base}>
        {label}
      </button>
    </div>
  )
}