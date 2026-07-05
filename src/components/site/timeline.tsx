"use client"

import { motion } from "motion/react"
import { Briefcase, GraduationCap, Code, Award } from "lucide-react"

const typeConfig = {
  education: { icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  employment: { icon: Briefcase, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  freelance: { icon: Code, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  leadership: { icon: Award, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
}

export function Timeline({ items }: { items: any[] }) {
  if (!items?.length) return <div className="text-muted-foreground text-center py-12">No experience entries found.</div>

  return (
    <div className="relative max-w-4xl mx-auto py-12">
      {/* Center Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

      <div className="space-y-12">
        {items.map((item, index) => {
          const isEven = index % 2 === 0
          const config = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.employment
          const Icon = config.icon

          const startDate = item.start_date ? new Date(item.start_date).getFullYear() : ""
          const endDate = item.end_date ? new Date(item.end_date).getFullYear() : "Present"
          const dateString = startDate ? `${startDate} — ${endDate}` : endDate

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col md:flex-row items-start md:items-center w-full"
            >
              {/* Icon / Marker */}
              <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full border-4 border-background ${config.bg} ${config.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content Box */}
              <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                <div className={`bg-card border ${config.border} p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                  {/* Subtle accent line inside card */}
                  <div className={`absolute top-0 bottom-0 w-1 ${config.bg} transition-all duration-300 ${isEven ? 'right-0 group-hover:w-full opacity-10' : 'left-0 group-hover:w-full opacity-10'}`} />
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${config.color}`}>
                        {item.type}
                      </span>
                      <span className="text-sm font-mono text-muted-foreground">{dateString}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold font-serif mb-1">{item.title}</h3>
                    <div className="text-primary font-medium mb-4">{item.org} {item.location && <span className="text-muted-foreground font-normal"> • {item.location}</span>}</div>
                    
                    {item.description && <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.description}</p>}
                    
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className={`text-sm text-muted-foreground space-y-1.5 ${isEven ? 'md:list-inside' : ''}`}>
                        {item.highlights.map((highlight: string, i: number) => (
                          <li key={i} className={`flex items-start gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${config.bg}`} />
                            <span className={isEven ? 'md:text-right' : ''}>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
