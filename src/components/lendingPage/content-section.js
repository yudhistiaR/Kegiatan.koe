export function ContentSection({
  children,
  backgroundColor = 'bg-[#2d3154]',
  className = ''
}) {
  return (
    <section className={`py-20 ${backgroundColor} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
