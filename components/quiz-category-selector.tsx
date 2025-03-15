import { Button } from "@/components/ui/button"
import { Film, GraduationCap, Trophy, FlaskRoundIcon as Flask, Cpu, Landmark } from "lucide-react"

interface QuizCategorySelectorProps {
  categories: {
    id: string
    name: string
    icon: string
  }[]
}

export function QuizCategorySelector({ categories }: QuizCategorySelectorProps) {
  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Film":
        return <Film className="h-4 w-4 mr-2" />
      case "GraduationCap":
        return <GraduationCap className="h-4 w-4 mr-2" />
      case "Trophy":
        return <Trophy className="h-4 w-4 mr-2" />
      case "Flask":
        return <Flask className="h-4 w-4 mr-2" />
      case "Cpu":
        return <Cpu className="h-4 w-4 mr-2" />
      case "Landmark":
        return <Landmark className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button key={category.id} variant="outline" className="rounded-full" asChild>
            <a href={`/category/${category.id}`}>
              {renderIcon(category.icon)}
              {category.name}
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}

