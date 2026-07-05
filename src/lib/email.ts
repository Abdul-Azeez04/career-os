/**
 * Email utility using Resend for contact form notifications.
 */

interface ContactEmailData {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL

  if (!apiKey || !contactEmail) {
    console.warn('Resend API key or contact email not configured. Email not sent.')
    return { success: true } // Don't fail the form submission
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Career OS <noreply@resend.dev>',
      to: [contactEmail],
      subject: `New Contact Form Message from ${data.name}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #D4A853; margin-bottom: 20px;">New Contact Message</h2>
          <div style="background: #141416; border: 1px solid #2A2A2D; border-radius: 8px; padding: 20px;">
            <p style="color: #8A8A8E; margin: 0 0 4px 0;">From</p>
            <p style="color: #EDEDEF; margin: 0 0 16px 0; font-size: 16px;"><strong>${data.name}</strong></p>
            
            <p style="color: #8A8A8E; margin: 0 0 4px 0;">Email</p>
            <p style="color: #EDEDEF; margin: 0 0 16px 0;">
              <a href="mailto:${data.email}" style="color: #D4A853;">${data.email}</a>
            </p>
            
            <p style="color: #8A8A8E; margin: 0 0 4px 0;">Message</p>
            <p style="color: #EDEDEF; margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          <p style="color: #8A8A8E; font-size: 12px; margin-top: 20px;">
            Sent via Career OS contact form
          </p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: 'Failed to send email notification' }
  }
}
