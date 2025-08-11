export function SectionHeader({ title, description, className = '' }) {
  return (
    <div className={`text-center space-y-4 mb-16 ${className}`}>
      <h2 className="text-3xl lg:text-4xl font-bold text-white">{title}</h2>
      {description && (
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">{description}</p>
      )}
    </div>
  )
}
