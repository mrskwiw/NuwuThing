import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createCategory } from "@/lib/db"
import { ChevronLeft, AlertTriangle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function CreateCategoryPage() {
  async function createNewCategory(formData: FormData) {
    "use server"

    try {
      const name = formData.get("name") as string
      const slug = formData.get("slug") as string
      const description = formData.get("description") as string
      const icon = formData.get("icon") as string

      await createCategory({
        name,
        slug,
        description,
        icon,
      })

      redirect("/admin/categories")
    } catch (error: any) {
      // If the table doesn't exist, redirect to the categories page
      if (error.code === "42P01") {
        redirect("/admin/categories")
      }
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Category</h1>
      </div>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Make sure the categories table exists in your Supabase database before creating a category. Check the
          instructions on the categories page if you haven't set up the table yet.
        </AlertDescription>
      </Alert>

      <Card>
        <form action={createNewCategory}>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>Create a new quiz category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g. Science" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="e.g. science" required />
              <p className="text-sm text-muted-foreground">Used in URLs, lowercase with no spaces</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="A short description of the category" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" name="icon" placeholder="e.g. Flask" />
              <p className="text-sm text-muted-foreground">Icon name from Lucide icons</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/categories">Cancel</Link>
            </Button>
            <Button type="submit">Create Category</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

