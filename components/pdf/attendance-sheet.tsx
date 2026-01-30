import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { TeamRow } from "@/lib/attendance-report"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },
  note: {
    fontSize: 8,
    color: "#999999",
    marginTop: 3,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#d0d0d0",
    flexDirection: "row",
    fontWeight: "bold",
    color: "#333333",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderTopWidth: 0,
    minHeight: 20,
  },
  headerCell: {
    padding: 5,
    justifyContent: "center",
    fontSize: 7,
    fontWeight: "bold",
  },
  tableCell: {
    padding: 4,
    justifyContent: "center",
    fontSize: 7,
    color: "#1a1a1a",
  },
  teamColumn: {
    width: "3%",
    textAlign: "center",
  },
  countColumn: {
    width: "4%",
    textAlign: "center",
  },
  delegateGroup: {
    flex: 1,
    flexDirection: "row",
  },
  delegateBlock: {
    flex: 1,
    flexDirection: "row",
  },
  nameColumn: {
    width: "12%",
  },
  categoryColumn: {
    width: "10%",
  },
  attendanceColumn: {
    width: "3.5%",
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 1,
    fontSize: 6,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusPresent: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusAbsent: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    fontSize: 7,
    color: "#999999",
  },
  footerText: {
    flex: 1,
  },
})

interface AttendanceSheetPDFProps {
  teamRows: TeamRow[]
}

const AttendanceStatus = ({ day }: { day: boolean }) => (
  <View style={[styles.tableCell, styles.attendanceColumn]}>
    <Text style={[styles.statusBadge, day ? styles.statusPresent : styles.statusAbsent]}>
      {day ? "P" : "A"}
    </Text>
  </View>
)

export default function AttendanceSheetPDF({ teamRows }: AttendanceSheetPDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Misaal Attendance Sheet</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.note}>Grouped by Team</Text>
        </View>

        {/* Table Header */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.teamColumn]}>Team</Text>
            <Text style={[styles.headerCell, styles.countColumn]}>Count</Text>

            {Array.from({ length: 10 }).map((_, i) => (
              <View key={i} style={styles.delegateBlock}>
                <Text style={[styles.headerCell, styles.nameColumn]}>Name {i + 1}</Text>
                <Text style={[styles.headerCell, styles.categoryColumn]}>Category</Text>
                <Text style={[styles.headerCell, styles.attendanceColumn]}>D1</Text>
                <Text style={[styles.headerCell, styles.attendanceColumn]}>D2</Text>
                <Text style={[styles.headerCell, styles.attendanceColumn]}>D3</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {teamRows.map((team) => (
            <View key={team.teamId} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.teamColumn]}>{team.teamId}</Text>
              <Text style={[styles.tableCell, styles.countColumn]}>{team.delegateCount}</Text>

              {Array.from({ length: 10 }).map((_, delegateIndex) => {
                const delegate = team.delegates[delegateIndex]
                return (
                  <View key={delegateIndex} style={styles.delegateBlock}>
                    <Text style={[styles.tableCell, styles.nameColumn]}>
                      {delegate ? delegate.name.substring(0, 12) : "—"}
                    </Text>
                    <Text style={[styles.tableCell, styles.categoryColumn]}>
                      {delegate ? (delegate.category ? delegate.category.substring(0, 8) : "—") : "—"}
                    </Text>
                    {delegate ? (
                      <>
                        <AttendanceStatus day={delegate.day1} />
                        <AttendanceStatus day={delegate.day2} />
                        <AttendanceStatus day={delegate.day3} />
                      </>
                    ) : (
                      <>
                        <Text style={[styles.tableCell, styles.attendanceColumn]}>—</Text>
                        <Text style={[styles.tableCell, styles.attendanceColumn]}>—</Text>
                        <Text style={[styles.tableCell, styles.attendanceColumn]}>—</Text>
                      </>
                    )}
                  </View>
                )
              })}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Misaal Attendance Report</Text>
          <Text style={styles.footerText}>
            Generated on {new Date().toLocaleDateString("en-US")}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
