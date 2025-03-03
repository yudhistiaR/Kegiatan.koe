const baseUrl = process.env.NEXT_PUBLIC_CLERK_FAPI // Default jika tidak ada
const apiVersion = process.env.NEXT_PUBLIC_CLERK_API_VERSION

export async function getBrowserToken() {
  return await fetch(
    `https://genuine-feline-15.clerk.accounts.dev/v1/dev_browser`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  ).then(res => console.log(res))
}
