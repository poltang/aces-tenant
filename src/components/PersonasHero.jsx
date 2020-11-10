import Link from 'next/link'
import { BtnReverseSm } from "components/Buttons";

export default function Hero({ project, flag, fn1 }) {

  return (
    <div className="bg-white border-b border-gray-300 pt-6 pb-4 px-4 sm:px-6">
      <div className="aces-geist">
        <div className="flex flex-col">
          <div className="text-center sm:text-left">
            <div className="text-3xl text-gray-800 leading-snug tracking-loose">
              Project Personas
            </div>
            <div className="text-sm text-green-500 font-bold">
              {project.title}
            </div>
            <div className="text-sm text-gray-700 text-sm mb-1">
              {project.client.name}, {project.createdAt.substr(0,4)}
            </div>
          </div>
          {!flag && <div className="flex items-end justify-center text-gray-500 sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow text-xs font-semibold uppercase leading-loose">
              {/* <span className="inline-block w-8 h-8 border-4 text-white text-center rounded-full bg-gray-500">DV</span> */}
              <span className="text-gray-600 cursor-default">
                Data view
              </span>
              <span className="mx-2">|</span>
              <Link
              href="/[slug]/projects/[id]/assignments"
              as={`/${project.license}/projects/${project._id}/assignments`}>
                <a className="hover:text-gray-700">
                  Assignment View
                </a>
              </Link>
            </div>
            <div className="">
              <BtnReverseSm label="Add" props="mr-2" clickHandler={fn1} />
              <BtnReverseSm label="Add" props="mr-2" clickHandler={fn1} />
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}