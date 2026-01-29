import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { DelegateDTO } from '@/app/api/delegates/route'

interface TeamRow {
  teamId: number
  delegateCount: number
  delegates: Array<{
    name: string
    category: string | null
    day1: boolean
    day2: boolean
    day3: boolean
  }>
}

function groupDelegatesByTeam(delegates: DelegateDTO[]): TeamRow[] {
  const teamMap = new Map<number, DelegateDTO[]>()

  // Group by team_id
  for (const delegate of delegates) {
    if (!teamMap.has(delegate.team_id)) {
      teamMap.set(delegate.team_id, [])
    }
    teamMap.get(delegate.team_id)!.push(delegate)
  }

  // Convert to sorted array
  const teams: TeamRow[] = Array.from(teamMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([teamId, delegateList]) => {
      // Sort delegates by name within team
      const sortedDelegates = delegateList.sort((a, b) =>
        a.delegate_name.localeCompare(b.delegate_name)
      )

      return {
        teamId,
        delegateCount: delegateList.length,
        delegates: sortedDelegates.slice(0, 5).map((d) => ({
          name: d.delegate_name,
          category: d.category,
          day1: d.attendance.day1,
          day2: d.attendance.day2,
          day3: d.attendance.day3,
        })),
      }
    })

  return teams
}

function getAttendanceStatus(isPresent: boolean): string {
  return isPresent ? 'P' : 'A'
}

export async function generateAttendanceSheet(delegates: DelegateDTO[]): Promise<void> {
  // Create PDF in landscape A4
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 10

  // Add title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Misaal Attendance Sheet', margin, margin + 5)

  // Add date and note
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`Date: ${currentDate}`, margin, margin + 12)
  doc.text('Grouped by Team', margin, margin + 17)

  // Group data
  const teamRows = groupDelegatesByTeam(delegates)

  // Prepare table data
  const tableHeaders = [
    'Team',
    'Count',
    'Name 1',
    'Cat 1',
    'D1',
    'D2',
    'D3',
    'Name 2',
    'Cat 2',
    'D1',
    'D2',
    'D3',
    'Name 3',
    'Cat 3',
    'D1',
    'D2',
    'D3',
    'Name 4',
    'Cat 4',
    'D1',
    'D2',
    'D3',
    'Name 5',
    'Cat 5',
    'D1',
    'D2',
    'D3',
  ]

  const tableData = teamRows.map((team) => {
    const row: string[] = [team.teamId.toString(), team.delegateCount.toString()]

    // Add up to 5 delegates
    for (let i = 0; i < 5; i++) {
      const delegate = team.delegates[i]
      if (delegate) {
        row.push(
          delegate.name.substring(0, 15),
          delegate.category ? delegate.category.substring(0, 10) : '—',
          getAttendanceStatus(delegate.day1),
          getAttendanceStatus(delegate.day2),
          getAttendanceStatus(delegate.day3)
        )
      } else {
        row.push('—', '—', '—', '—', '—')
      }
    }

    return row
  })

  // Generate table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: margin + 22,
    margin: margin,
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [50, 50, 50],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineColor: [200, 200, 200],
    },
    bodyStyles: {
      textColor: [40, 40, 40],
      fontSize: 8,
      lineColor: [220, 220, 220],
      halign: 'center',
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 8 },
      4: { halign: 'center', cellWidth: 6 },
      5: { halign: 'center', cellWidth: 6 },
      6: { halign: 'center', cellWidth: 6 },
      9: { halign: 'center', cellWidth: 6 },
      10: { halign: 'center', cellWidth: 6 },
      11: { halign: 'center', cellWidth: 6 },
      14: { halign: 'center', cellWidth: 6 },
      15: { halign: 'center', cellWidth: 6 },
      16: { halign: 'center', cellWidth: 6 },
      19: { halign: 'center', cellWidth: 6 },
      20: { halign: 'center', cellWidth: 6 },
      21: { halign: 'center', cellWidth: 6 },
      24: { halign: 'center', cellWidth: 6 },
      25: { halign: 'center', cellWidth: 6 },
      26: { halign: 'center', cellWidth: 6 },
    },
  })

  // Add footer with page numbers
  const totalPages = (doc as any).internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - margin
    )
  }

  // Download PDF
  doc.save('attendance-sheet.pdf')
}
