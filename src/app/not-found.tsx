import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="font-serif text-[120px] md:text-[200px] font-bold leading-none text-primary/20 select-none">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold -mt-6 mb-4">Page not found</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/work"
            className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
          >
            View my work
          </Link>
        </div>
      </div>
    </div>
  )
}
