export function StatsGrid({ stats, columns = 4 }) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-8`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl lg:text-5xl font-bold text-[#4b6fd7] mb-2">
            {stat.value}
          </div>
          <p className="text-gray-300">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
