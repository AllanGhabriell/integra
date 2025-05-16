// pages/api/testSession.js
import { getSession } from 'next-auth/react'

const handler = async (req, res) => {
  const session = await getSession({ req })
  res.json({ session })
}

export default handler
