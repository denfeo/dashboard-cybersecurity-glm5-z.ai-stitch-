import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

// Incident types for export
interface IncidentExport {
  id: string
  type: string
  description: string
  priority: string
  status: string
  time: string
  source: string
  targetIP: string
  attackerIP: string
  severity: number
  assignedTo?: string
  mitreAttack?: string[]
  logs?: string[]
  timeline?: {
    id: string
    time: string
    title: string
    subtitle: string
    status: string
  }[]
}

// Generate PDF using Python script
async function generatePDF(incidents: IncidentExport[], stats: {
  total: number
  active: number
  resolved: number
  responseTime: number
}): Promise<Buffer> {
  // Create temp JSON file with data
  const tempDir = '/tmp/incident-reports'
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  
  const dataFile = path.join(tempDir, `data_${Date.now()}.json`)
  const outputFile = path.join(tempDir, `report_${Date.now()}.pdf`)
  
  // Write data to temp file
  fs.writeFileSync(dataFile, JSON.stringify({ incidents, stats }, null, 2))
  
  // Python script for PDF generation
  const pythonScript = path.join(process.cwd(), 'scripts', 'generate_incident_report.py')
  
  try {
    // Use the venv Python which has reportlab installed
    const pythonPath = '/home/z/.venv/bin/python3'
    await execFileAsync(pythonPath, [pythonScript, dataFile, outputFile])
    
    // Read generated PDF
    const pdfBuffer = fs.readFileSync(outputFile)
    
    // Clean up files
    try {
      fs.unlinkSync(dataFile)
      fs.unlinkSync(outputFile)
    } catch {}
    
    return pdfBuffer
  } catch (error) {
    // Clean up data file on error
    try {
      fs.unlinkSync(dataFile)
    } catch {}
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { incidents, stats } = body
    
    if (!incidents || !Array.isArray(incidents)) {
      return NextResponse.json(
        { error: 'Incidents data is required' },
        { status: 400 }
      )
    }
    
    // Generate PDF
    const pdfBuffer = await generatePDF(incidents, stats)
    
    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="incident-report-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    )
  }
}
