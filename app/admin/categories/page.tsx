import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { getAllCategories, deleteCategory } from "@/lib/db"
import { Edit, Trash2, Plus, AlertTriangle } from "lucide-react"

// Add this export to make the page dynamic
export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  let categories = []
  let error = null

  try {
    categories = await getAllCategories()
  } catch (err) {
    console.error("Error fetching categories:", err)
    error = "Failed to load categories"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Button asChild>
          <Link href="/admin/categories/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Categories</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Categories</CardTitle>
            <CardDescription>Manage the categories that users can assign to their quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  No categories found. Create your first category to get started.
                </p>
                <Button asChild>
                  <Link href="/admin/categories/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/categories/${category.id}`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <form
                              action={async () => {
                                "use server"
                                await deleteCategory(category.id)
                              }}
                            >
                              <Button variant="ghost" size="icon" type="submit">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          {categories.length > 0 && (
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Showing {categories.length} {categories.length === 1 ? "category" : "categories"}
              </p>
            </CardFooter>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Setup Categories Table</CardTitle>
          <CardDescription>Instructions for setting up the categories table in Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            It appears that the categories table doesn't exist in your Supabase database yet. You can create it by
            running the following SQL in the Supabase SQL editor:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`CREATE TABLE public.categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories
CREATE POLICY "Allow anyone to read categories" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Allow only admins to insert, update, delete categories
CREATE POLICY "Allow admins to insert categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow admins to update categories" 
  ON public.categories 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow admins to delete categories" 
  ON public.categories 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

