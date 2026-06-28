"use client"

import { useState } from "react"

const page = () => {
    const [email,setEmail] = useState<string>('')
    const [name,setName] = useState<string>('')

    const uploadAdmin = async(e:any)=>{
        e.preventDefault();
        const admin = await fetch("/api/auth/admin/upload",{
            method: "POST",
            body: JSON.stringify({
                name,
                email
            })
        })

        if(admin.status==200){
            return alert("admin added sucessfully")
        }

        if(admin.status==400){
            return alert("user already exist")
        }
        
    }
  return (
    <div>
        <form onSubmit={uploadAdmin}>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" name="name" />
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" name="email" />
            <button type="submit">Upload</button>
        </form>
    </div>
  )
}

export default page
