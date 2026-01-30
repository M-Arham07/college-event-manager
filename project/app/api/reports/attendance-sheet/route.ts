import { NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"
import { groupDelegatesByTeam, formatDate } from "@/lib/attendance-report"
import AttendanceSheetPDF from "@/components/pdf/attendance-sheet"

export async function GET() {
  try {
    await connectDB()

    // Fetch all delegates sorted by team_id and delegate_name
    const allDelegates = await Delegate.find({}).sort({ team_id: 1, delegate_name: 1 }).lean()

    // Convert to client format
    const clientDelegates = allDelegates.map((d: any) => ({
      _id: d._id.toString(),
      team_id: d.team_id,
      delegate_name: d.delegate_name,
      category: d.category,
      attendance: d.attendance || { day1: false, day2: false, day3: false },
      createdAt: new Date(d.createdAt).toISOString(),
      updatedAt: new Date(d.updatedAt).toISOString(),
    }))

    // Group by team
    const teamRows = groupDelegatesByTeam(clientDelegates)

    // Generate PDF
    const pdfBuffer = await renderToBuffer(<AttendanceSheetPDF teamRows={teamRows} />)

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="attendance-sheet-${new Date().toISOString().split("T")[0]}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error generating attendance sheet:", error)
    return NextResponse.json(
      { error: "Failed to generate attendance sheet" },
      { status: 500 }
    )
  }
}
