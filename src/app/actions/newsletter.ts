"use server"

import { z } from "zod"
import { subscribeEmail } from "@/lib/data/blog"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const source = (formData.get("source") as string) || "website"

  try {
    const validatedData = newsletterSchema.parse({ email })
    await subscribeEmail(validatedData.email, undefined, source)
    return { success: true, message: "Thanks for subscribing!" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
