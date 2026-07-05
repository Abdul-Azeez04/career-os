"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { sendContactEmail } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    const validated = contactSchema.safeParse(rawData)

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      }
    }

    // Attempt to save to DB
    try {
      const supabase = await createClient()
      const { error: dbError } = await supabase.from('messages').insert({
        sender_name: validated.data.name,
        sender_email: validated.data.email,
        subject: validated.data.subject || null,
        body: validated.data.message,
        status: 'new'
      })
      
      if (dbError) {
        console.error("Supabase insert error in contact action:", dbError)
      }
    } catch (e) {
      console.warn("Could not save message to DB, proceeding to email only.", e)
    }

    // Send email via Resend
    await sendContactEmail({
      name: validated.data.name,
      email: validated.data.email,
      message: `${validated.data.subject ? `[Subject: ${validated.data.subject}]\n\n` : ''}${validated.data.message}`,
    })

    return {
      success: true,
      message: "Thanks for reaching out! I'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form action error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again or email me directly.",
    }
  }
}
