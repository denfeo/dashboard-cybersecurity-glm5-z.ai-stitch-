#!/usr/bin/env python3
"""
Incident Report PDF Generator
Generates professional SOC incident reports using ReportLab
"""

import json
import sys
import os
from datetime import datetime

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, Image, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

# Register font families for bold support
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Color scheme
PRIMARY_COLOR = colors.HexColor('#00f2fe')
CRITICAL_COLOR = colors.HexColor('#ff4d4d')
HIGH_COLOR = colors.HexColor('#f59e0b')
MEDIUM_COLOR = colors.HexColor('#fbbf24')
SUCCESS_COLOR = colors.HexColor('#10b981')
DARK_BG = colors.HexColor('#1a1d23')
HEADER_BG = colors.HexColor('#1F4E79')

def create_styles():
    """Create custom paragraph styles"""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='ReportTitle',
        fontName='Times New Roman',
        fontSize=28,
        leading=34,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1a1d23'),
        spaceAfter=20
    ))
    
    # Subtitle style
    styles.add(ParagraphStyle(
        name='ReportSubtitle',
        fontName='Times New Roman',
        fontSize=14,
        leading=18,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=30
    ))
    
    # Section header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Times New Roman',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1a1d23'),
        spaceBefore=20,
        spaceAfter=12
    ))
    
    # Body text (Russian)
    styles.add(ParagraphStyle(
        name='BodyRU',
        fontName='SimHei',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        textColor=colors.black,
        wordWrap='CJK'
    ))
    
    # Body text (English)
    styles.add(ParagraphStyle(
        name='BodyEN',
        fontName='Times New Roman',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        textColor=colors.black
    ))
    
    # Monospace for logs
    styles.add(ParagraphStyle(
        name='Mono',
        fontName='DejaVuSans',
        fontSize=8,
        leading=10,
        alignment=TA_LEFT,
        textColor=colors.HexColor('#10b981'),
        backColor=colors.HexColor('#1a1d23'),
        leftIndent=10,
        rightIndent=10
    ))
    
    # Table header
    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='Times New Roman',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.white
    ))
    
    # Table cell
    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Times New Roman',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.black
    ))
    
    # Table cell RU
    styles.add(ParagraphStyle(
        name='TableCellRU',
        fontName='SimHei',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.black,
        wordWrap='CJK'
    ))
    
    return styles

def create_cover_page(story, styles, stats):
    """Create cover page"""
    story.append(Spacer(1, 80))
    
    # Logo/Icon placeholder
    story.append(Paragraph(
        '<font color="#00f2fe">&#9679;</font>',
        ParagraphStyle('Icon', fontSize=48, alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 20))
    
    # Title
    story.append(Paragraph('<b>Incident Security Report</b>', styles['ReportTitle']))
    story.append(Paragraph('<font name="SimHei">Отчёт по инцидентам безопасности</font>', styles['ReportSubtitle']))
    
    story.append(Spacer(1, 40))
    
    # Date and time
    now = datetime.now()
    story.append(Paragraph(
        f'<font name="SimHei">Дата создания: {now.strftime("%d.%m.%Y %H:%M")}</font>',
        ParagraphStyle('Date', fontName='SimHei', fontSize=12, alignment=TA_CENTER, textColor=colors.HexColor('#64748b'))
    ))
    
    story.append(Spacer(1, 60))
    
    # Quick stats table
    stats_data = [
        [Paragraph('<b>Total Incidents</b>', styles['TableHeader']),
         Paragraph('<b>Active Threats</b>', styles['TableHeader']),
         Paragraph('<b>Resolved (24h)</b>', styles['TableHeader']),
         Paragraph('<b>Avg Response</b>', styles['TableHeader'])],
        [Paragraph(str(stats.get('total', 0)), styles['TableCell']),
         Paragraph(str(stats.get('active', 0)), styles['TableCell']),
         Paragraph(str(stats.get('resolved', 0)), styles['TableCell']),
         Paragraph(f"{stats.get('responseTime', 0)} min", styles['TableCell'])]
    ]
    
    stats_table = Table(stats_data, colWidths=[3.5*cm, 3.5*cm, 3.5*cm, 3.5*cm])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HEADER_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#f8fafc')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(stats_table)
    
    story.append(Spacer(1, 60))
    
    # Organization info
    story.append(Paragraph(
        '<font name="SimHei">CyberGuard SOC Team</font>',
        ParagraphStyle('Org', fontName='SimHei', fontSize=11, alignment=TA_CENTER, textColor=colors.HexColor('#475569'))
    ))
    story.append(Paragraph(
        'Security Operations Center Alpha',
        ParagraphStyle('OrgSub', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#94a3b8'))
    ))
    
    story.append(PageBreak())

def create_summary_section(story, styles, incidents):
    """Create executive summary section"""
    story.append(Paragraph('<b>Executive Summary</b>', styles['SectionHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_COLOR, spaceAfter=10))
    
    # Priority distribution
    priorities = {'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0}
    statuses = {'New': 0, 'In Progress': 0, 'Investigating': 0, 'Resolved': 0}
    
    for inc in incidents:
        p = inc.get('priority', 'Medium')
        if p in priorities:
            priorities[p] += 1
        s = inc.get('status', 'New')
        if s in statuses:
            statuses[s] += 1
    
    summary_text = f"""
    <font name="SimHei">
    Данный отчёт содержит информацию о {len(incidents)} инцидентах безопасности, 
    обнаруженных системой мониторинга SOC. Из них:
    <br/><br/>
    • <font color="#ff4d4d"><b>Critical</b></font>: {priorities['Critical']} инцидентов
    • <font color="#f59e0b"><b>High</b></font>: {priorities['High']} инцидентов  
    • <font color="#fbbf24"><b>Medium</b></font>: {priorities['Medium']} инцидентов
    • <font color="#94a3b8"><b>Low</b></font>: {priorities['Low']} инцидентов
    <br/><br/>
    Статусы:
    • <b>New</b>: {statuses['New']}
    • <b>In Progress</b>: {statuses['In Progress']}
    • <b>Investigating</b>: {statuses['Investigating']}
    • <b>Resolved</b>: {statuses['Resolved']}
    </font>
    """
    story.append(Paragraph(summary_text, styles['BodyRU']))
    story.append(Spacer(1, 20))

def create_incidents_table(story, styles, incidents):
    """Create incidents table"""
    story.append(Paragraph('<b>Incident List</b>', styles['SectionHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_COLOR, spaceAfter=10))
    
    # Table header
    header = [
        Paragraph('<b>ID</b>', styles['TableHeader']),
        Paragraph('<b>Type</b>', styles['TableHeader']),
        Paragraph('<b>Priority</b>', styles['TableHeader']),
        Paragraph('<b>Status</b>', styles['TableHeader']),
        Paragraph('<b>Time</b>', styles['TableHeader']),
    ]
    
    data = [header]
    
    for inc in incidents:
        priority_colors = {
            'Critical': '#ff4d4d',
            'High': '#f59e0b',
            'Medium': '#fbbf24',
            'Low': '#94a3b8'
        }
        p_color = priority_colors.get(inc.get('priority', 'Medium'), '#64748b')
        
        row = [
            Paragraph(f"#{inc.get('id', 'N/A')}", styles['TableCell']),
            Paragraph(inc.get('type', 'Unknown'), styles['TableCell']),
            Paragraph(f'<font color="{p_color}"><b>{inc.get("priority", "Medium")}</b></font>', styles['TableCell']),
            Paragraph(inc.get('status', 'New'), styles['TableCell']),
            Paragraph(inc.get('time', 'N/A'), styles['TableCell']),
        ]
        data.append(row)
    
    table = Table(data, colWidths=[2.5*cm, 4*cm, 2.5*cm, 3*cm, 2.5*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HEADER_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(table)
    story.append(Spacer(1, 30))

def create_incident_details(story, styles, incidents):
    """Create detailed sections for each incident"""
    story.append(PageBreak())
    story.append(Paragraph('<b>Incident Details</b>', styles['SectionHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY_COLOR, spaceAfter=20))
    
    for inc in incidents:
        # Incident header
        inc_header = f"<b>#{inc.get('id', 'N/A')} - {inc.get('type', 'Unknown')}</b>"
        story.append(Paragraph(inc_header, ParagraphStyle(
            'IncHeader',
            fontName='Times New Roman',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#1a1d23'),
            spaceBefore=15,
            spaceAfter=8
        )))
        
        # Incident info table
        info_data = [
            [Paragraph('<font name="SimHei"><b>Параметр</b></font>', styles['TableCellRU']),
             Paragraph('<font name="SimHei"><b>Значение</b></font>', styles['TableCellRU'])],
            [Paragraph('<font name="SimHei">Описание</font>', styles['TableCellRU']),
             Paragraph(f"<font name='SimHei'>{inc.get('description', 'N/A')}</font>", styles['TableCellRU'])],
            [Paragraph('<font name="SimHei">Приоритет</font>', styles['TableCellRU']),
             Paragraph(f"<font name='SimHei'>{inc.get('priority', 'N/A')}</font>", styles['TableCellRU'])],
            [Paragraph('<font name="SimHei">Статус</font>', styles['TableCellRU']),
             Paragraph(f"<font name='SimHei'>{inc.get('status', 'N/A')}</font>", styles['TableCellRU'])],
            [Paragraph('<font name="SimHei">Target IP</font>', styles['TableCellRU']),
             Paragraph(inc.get('targetIP', 'N/A'), styles['TableCell'])],
            [Paragraph('<font name="SimHei">Attacker IP</font>', styles['TableCellRU']),
             Paragraph(inc.get('attackerIP', 'N/A'), styles['TableCell'])],
            [Paragraph('<font name="SimHei">Severity</font>', styles['TableCellRU']),
             Paragraph(f"{inc.get('severity', 0)}%", styles['TableCell'])],
        ]
        
        if inc.get('assignedTo'):
            info_data.append([
                Paragraph('<font name="SimHei">Назначен</font>', styles['TableCellRU']),
                Paragraph(f"<font name='SimHei'>{inc.get('assignedTo')}</font>", styles['TableCellRU'])
            ])
        
        if inc.get('mitreAttack'):
            info_data.append([
                Paragraph('MITRE ATT&CK', styles['TableCellRU']),
                Paragraph(', '.join(inc.get('mitreAttack', [])), styles['TableCell'])
            ])
        
        info_table = Table(info_data, colWidths=[4*cm, 10*cm])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(info_table)
        
        # Logs
        if inc.get('logs'):
            story.append(Spacer(1, 10))
            story.append(Paragraph('<font name="SimHei"><b>Логи:</b></font>', styles['BodyRU']))
            logs_text = '<br/>'.join(inc.get('logs', []))
            story.append(Paragraph(logs_text, styles['Mono']))
        
        story.append(Spacer(1, 20))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e2e8f0')))

def generate_report(data_file, output_file):
    """Generate the PDF report"""
    # Load data
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    incidents = data.get('incidents', [])
    stats = data.get('stats', {})
    
    # Create document
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
        title=f'Incident Report {datetime.now().strftime("%Y-%m-%d")}',
        author='Z.ai',
        creator='Z.ai',
        subject='Security Incident Report'
    )
    
    styles = create_styles()
    story = []
    
    # Build document
    create_cover_page(story, styles, stats)
    create_summary_section(story, styles, incidents)
    create_incidents_table(story, styles, incidents)
    create_incident_details(story, styles, incidents)
    
    # Build PDF
    doc.build(story)
    print(f"PDF generated: {output_file}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python generate_incident_report.py <data_file> <output_file>")
        sys.exit(1)
    
    data_file = sys.argv[1]
    output_file = sys.argv[2]
    
    generate_report(data_file, output_file)
