"use client"

import { signIn } from "next-auth/react"
const GoogleButton = () => {
  return (
    <button onClick={()=>signIn("google")}>Continue with Google</button>
  )
}

export default GoogleButton