export function SectionHeading({ 
  title, 
  subtitle,
  centered = false
}: { 
  title: string
  subtitle?: string
  centered?: boolean
}) {
  return (
    <div className={`mb-12 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
      <div className={`w-12 h-1 bg-primary mb-6 ${centered ? 'mx-auto' : ''}`} />
      <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}
