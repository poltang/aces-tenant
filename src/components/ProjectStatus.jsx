// ProjectStatus.jsx

export default function ProjectStatus({ status, label, margin}) {
  const base = "block float-left w-4 h-4 -ml-px mt-1s mr-2 rounded-full "
  const c1 = base + "bg-gray-400"
  const c2 = base + "bg-white border-4 border-green-400"
  const c3 = base + "bg-green-500"
  const c4 = base + "bg-gray-700"
  const c5 = base + "bg-yellow-200 border-2 border-red-500"

  const l1 = "inline-block -mt-1  text-gray-600"
  const l2 = "inline-block -mt-1  text-greem-600"
  const l3 = "inline-block -mt-1  text-green-600 font-bold"
  const l4 = "inline-block -mt-1  text-gray-700"
  const l5 = "inline-block -mt-1  text-red-600"

  // apply status
  let classes = { c: c1, l: l1 }
  if (status.toLowerCase() == 'ready') classes = { c: c2, l: l2 }
  else if (status.toLowerCase() == 'active') classes = { c: c3, l: l3 }
  else if (status.toLowerCase() == 'finished') classes = { c: c4, l: l4 }
  else if (status.toLowerCase() == 'cancelled') classes = { c: c5, l: l5 }

  // margin: vertical and positif (mt, mb, my)
  const theMargin = margin
    && margin.length > 1
    && margin.charAt(0) == 'm'
    && (margin.charAt(1) == 't'
    || margin.charAt(1) == 'b'
    || margin.charAt(1) == 'y') ? margin : ''

  return (
    <div className={"project-status text-xs uppercase " + theMargin}>
      <span className={classes.c}></span>
      <span className={classes.l}>{label}</span>
    </div>
  )
}