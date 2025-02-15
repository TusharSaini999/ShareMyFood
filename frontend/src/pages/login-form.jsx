import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email or Phone Number</Label>
        <Input id="email" placeholder="m@example.com" required type="text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" required type="password" />
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
        Log In
      </Button>
      <div className="text-center">
        <a href="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot Password?
        </a>
      </div>
    </motion.form>
  )
}
