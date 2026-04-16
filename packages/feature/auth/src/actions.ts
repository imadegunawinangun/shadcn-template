"use server"

import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const email = formData.get("email")
  console.log("Mock login for:", email)
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const email = formData.get("email")
  console.log("Mock signup for:", email)
  redirect("/login")
}
