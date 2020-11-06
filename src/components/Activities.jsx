// Activities.jsx

export default function Activities({ logArray }) {
  return (
    <div className="text-xs">
    {logArray.map(log => (
      <div key={log._id}>
        <LogItem log={log.log} />
      </div>
    ))}
    </div>
  )
}

function LogItem({ log }) {
  const items = log.split(' ')
  const t = items[0].substr(0,19).replace("T"," ")
  return (
    <p className="border-b border-orange-200 pb-3 mb-3">
      <span className="text-pink-500 mr-2">{t}</span>
      <span className="font-semibold">{items[1]}</span><br/>
      <span className="">&rarr; {items[2]} {items[3]}</span>
    </p>
  )
}