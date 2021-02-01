export default function Card({
  header,
  body,
  color
}: {
  header: string,
  body?: string,
  color: "red" | "gray"
}) {
  return (
    <div className={`bg-${color}-100 w-2/3 mx-auto h-32 flex p-6 rounded-lg shadow-xl`}>
      <div className="pt-1">
        <h4 className={`text-xl text-${color}-900 leading-tight`}>{header}</h4>
        <span className="text-base text-gray-600 leading-normal inline-block">{body}</span>
      </div>
    </div>
  )
}

