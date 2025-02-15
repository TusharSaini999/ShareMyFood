"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)

  /** @param {React.SyntheticEvent} event */
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
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="John Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" placeholder="m@example.com" required type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input id="phone" placeholder="+1 (555) 000-0000" type="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" required type="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" required type="password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ngo">NGO</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="farmer" disabled>
              Farmer (Coming Soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address (Optional)</Label>
        <Input id="address" placeholder="123 Main St, City, Country" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
        <Input id="profilePicture" type="file" accept="image/*" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the Terms & Conditions
        </label>
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </motion.form>
  )
}

