export default function ProjectSettingsHeader({ project, title }) {
  return (
    <div className="border-b border-orange-300 pb-3 mb-4 -mt-4 sm:mt-0">
      <table className="leading-relaxed mx-auto sm:mx-0">
        <tbody>
          <tr className="">
            <td colSpan="2" className="text-2xl text-center sm:text-left font-semibold">
            {title}
            </td>
          </tr>
          <tr className="text-gray-700">
            <td>
              <span className="hidden sm:inline sm:pr-2">Proyek:</span>
            </td>
            <td className="text-center sm:text-left font-semibold">{project.label}</td>
          </tr>
          <tr className="text-gray-700">
            <td className="">
              <span className="hidden sm:inline">Klien:</span>
            </td>
            <td className="text-center sm:text-left font-semibold">{project.client.name}</td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
      td {
        padding: 0;
      }
      `}</style>
    </div>
  )
}