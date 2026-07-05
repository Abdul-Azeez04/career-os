export function SkillBadge({ 
  skill 
}: { 
  skill: { name: string; category?: string | null; proficiency: number } 
}) {
  const categoryColors: Record<string, string> = {
    framework: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    language: "bg-green-500/10 text-green-500 border-green-500/20",
    tool: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    creative: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    other: "bg-primary/10 text-primary border-primary/20",
  }

  const catColor = skill.category ? categoryColors[skill.category] || categoryColors.other : categoryColors.other

  return (
    <div className={`px-3 py-1.5 rounded-full border ${catColor} text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105 cursor-default`}>
      <span>{skill.name}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div 
            key={level} 
            className={`w-1.5 h-1.5 rounded-full ${level <= skill.proficiency ? 'bg-current opacity-80' : 'bg-current opacity-20'}`}
          />
        ))}
      </div>
    </div>
  )
}
