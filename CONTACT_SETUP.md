# Contact Form Setup

Your contact form is now functional! Here's what was set up:

## What Changed

1. **Backend API** (`src/server.ts`): Added `/api/contact` endpoint that receives form submissions and sends emails via Resend
2. **Frontend Component** (`src/App.tsx`): Created `ContactForm` component with form validation, loading states, and success/error messages
3. **Email Service**: Integrated Resend for reliable email delivery

## Setup Instructions

### 1. Get a Resend API Key
- Go to https://resend.com/
- Sign up for a free account
- Copy your API key from the dashboard

### 2. Configure Environment Variable
- Create (or update) `.env.local` and replace `your_resend_api_key_here` with your actual Resend API key:
  ```
  RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
  ```
- **Do not commit** `.env.local` to GitHub. It should stay local only.
- If a key was ever committed, rotate it in Resend and update your local file.

### 3. Run the Development Server
```bash
npm run dev:server
```
Or use this to run both CSS watch and Vite:
```bash
npm run dev
```

### 4. Test the Form
- Navigate to http://localhost:5173 (or your Vite port)
- Scroll to the Contact section
- Fill out the form and submit
- You'll receive an email at mayssaelarradi@gmail.com with the message

## How It Works

1. User fills out the contact form with name, email, and message
2. Frontend validates the form and sends a POST request to `/api/contact`
3. Backend receives the request and sends an email via Resend
4. User gets instant visual feedback (success/error message)
5. Email recipient (you) gets a nicely formatted email with the sender's reply-to address

## Features

✅ Form validation (required fields)
✅ Loading state during submission
✅ Success/error messages
✅ Sender's email in reply-to field
✅ Clean HTML email formatting
✅ Error handling

## Production Deployment

When deploying:
1. Add the `RESEND_API_KEY` environment variable to your hosting provider
2. Make sure your backend can serve the API endpoint
3. Rate limiting is enabled on `/api/contact` to prevent abuse

## Troubleshooting

- **"Failed to send message"**: Check that `RESEND_API_KEY` is set correctly
- **Emails not arriving**: Check Resend's dashboard for delivery status
- **CORS errors**: The API endpoint should be on the same domain in production
