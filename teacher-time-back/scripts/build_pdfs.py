from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "teacher-time-back" / "output" / "pdf"
OUTPUT.mkdir(parents=True, exist_ok=True)

DEEP = colors.HexColor("#063C33")
INK = colors.HexColor("#123F37")
TEAL = colors.HexColor("#008F87")
AQUA = colors.HexColor("#59DDD0")
GOLD = colors.HexColor("#D6A838")
PINK = colors.HexColor("#FF91C5")
PAPER = colors.HexColor("#F5EFE4")
WHITE = colors.HexColor("#FFFDF7")
MINT = colors.HexColor("#E4F8F4")
AMBER = colors.HexColor("#FFF2CB")
MUTED = colors.HexColor("#58736C")
LINE = colors.HexColor("#C8D4CF")


def register_fonts():
    regular = Path(r"C:\Windows\Fonts\arial.ttf")
    bold = Path(r"C:\Windows\Fonts\arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("AWBody", str(regular)))
        pdfmetrics.registerFont(TTFont("AWBold", str(bold)))
        return "AWBody", "AWBold"
    return "Helvetica", "Helvetica-Bold"


BODY_FONT, BOLD_FONT = register_fonts()
styles = getSampleStyleSheet()

TITLE = ParagraphStyle(
    "Title",
    parent=styles["Title"],
    fontName=BOLD_FONT,
    fontSize=30,
    leading=31,
    textColor=DEEP,
    alignment=TA_LEFT,
    spaceAfter=10,
)
DISPLAY = ParagraphStyle(
    "Display",
    parent=TITLE,
    fontSize=24,
    leading=25,
    spaceAfter=8,
)
H1 = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontName=BOLD_FONT,
    fontSize=19,
    leading=21,
    textColor=DEEP,
    spaceBefore=10,
    spaceAfter=8,
)
H2 = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontName=BOLD_FONT,
    fontSize=14,
    leading=16,
    textColor=TEAL,
    spaceBefore=8,
    spaceAfter=5,
)
BODY = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName=BODY_FONT,
    fontSize=9.7,
    leading=14,
    textColor=INK,
    spaceAfter=7,
)
SMALL = ParagraphStyle(
    "Small",
    parent=BODY,
    fontSize=8.2,
    leading=11,
    textColor=MUTED,
)
LABEL = ParagraphStyle(
    "Label",
    parent=BODY,
    fontName=BOLD_FONT,
    fontSize=8,
    leading=9,
    textColor=TEAL,
    spaceAfter=4,
    uppercase=True,
)
WHITE_TITLE = ParagraphStyle(
    "WhiteTitle", parent=TITLE, textColor=WHITE, fontSize=27, leading=28
)
WHITE_BODY = ParagraphStyle(
    "WhiteBody", parent=BODY, textColor=colors.HexColor("#E6F2EF")
)
CARD_TITLE = ParagraphStyle(
    "CardTitle", parent=BODY, fontName=BOLD_FONT, fontSize=12.5, leading=14, textColor=DEEP
)


def P(text, style=BODY):
    return Paragraph(text, style)


def bullet(text):
    return P(f"<font color='#008F87'><b>+</b></font> {text}", BODY)


def checkbox(text):
    return P(f"<font color='#008F87'><b>[ ]</b></font> {text}", BODY)


def rule(color=LINE, width=0.7, space=8):
    return HRFlowable(width="100%", thickness=width, color=color, spaceBefore=space, spaceAfter=space)


def callout(title, body, bg=MINT, accent=AQUA):
    content = [[P(title.upper(), LABEL), P(body, BODY)]]
    table = Table(content, colWidths=[1.35 * inch, 4.85 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 0.8, accent),
                ("LINEBEFORE", (0, 0), (0, 0), 7, accent),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 11),
                ("RIGHTPADDING", (0, 0), (-1, -1), 11),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return table


def card(title, body, accent=TEAL):
    t = Table([[P(title, CARD_TITLE)], [P(body, SMALL)]], colWidths=[3.0 * inch])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("LINEABOVE", (0, 0), (-1, 0), 5, accent),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return t


def write_line(label, height=0.33 * inch):
    t = Table([[P(label, LABEL)], [""]], colWidths=[6.2 * inch], rowHeights=[0.18 * inch, height])
    t.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 1), (0, 1), 0.7, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return t


def on_page(canvas, doc):
    canvas.saveState()
    w, h = doc.pagesize
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    canvas.setFillColor(DEEP)
    canvas.rect(0, h - 0.18 * inch, w, 0.18 * inch, fill=1, stroke=0)
    canvas.setFont(BOLD_FONT, 7.5)
    canvas.setFillColor(TEAL)
    canvas.drawString(doc.leftMargin, 0.36 * inch, "SAFE AI ASSISTANT LAB")
    canvas.setFillColor(MUTED)
    canvas.setFont(BODY_FONT, 7.5)
    canvas.drawRightString(w - doc.rightMargin, 0.36 * inch, f"Andrew Wolverton  |  {doc.page}")
    canvas.restoreState()


def build(path, story, pagesize=letter, margins=(0.68, 0.68, 0.72, 0.62)):
    left, right, top, bottom = [x * inch for x in margins]
    doc = BaseDocTemplate(
        str(path),
        pagesize=pagesize,
        leftMargin=left,
        rightMargin=right,
        topMargin=top,
        bottomMargin=bottom,
        title=path.stem.replace("-", " "),
        author="Andrew Wolverton",
    )
    frame = Frame(left, bottom, pagesize[0] - left - right, pagesize[1] - top - bottom, id="body")
    doc.addPageTemplates([PageTemplate(id="standard", frames=[frame], onPage=on_page)])
    doc.build(story)


def cover(kicker, title, deck, facts=None):
    story = [P(kicker.upper(), LABEL), P(title, TITLE), P(deck, BODY), Spacer(1, 0.12 * inch)]
    if facts:
        row = []
        for big, small in facts:
            row.append([P(big, DISPLAY), P(small, SMALL)])
        cells = [[Table([[item[0]], [item[1]]], colWidths=[1.83 * inch]) for item in row]]
        t = Table(cells, colWidths=[2.02 * inch] * len(row))
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), MINT),
                    ("BOX", (0, 0), (-1, -1), 0.8, AQUA),
                    ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 9),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                    ("TOPPADDING", (0, 0), (-1, -1), 9),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ]
            )
        )
        story.extend([t, Spacer(1, 0.16 * inch)])
    return story


def build_pilot_overview():
    story = cover(
        "Founding school pilot",
        "Give teachers time back without giving them another technology to figure out.",
        "Bring one recurring task. In a guided, beginner-friendly lab, each teacher builds one safe assistant blueprint inside the school's approved environment and leaves knowing how to test, review, and reuse it.",
        [("90 min", "hands-on teacher lab"), ("8-20", "educators per cohort"), ("$1,500", "founding pilot rate")],
    )
    story += [
        callout("Low entry", "No AI experience. No coding. No student records. One task only. The teacher reviews every result."),
        Spacer(1, 0.13 * inch),
        P("What every teacher leaves with", H1),
        Table(
            [[card("One-task brief", "A bounded job, named inputs, exact output, and success criteria."), card("Copy-ready instructions", "Role, sources, output, refusal rule, and human decision line.")],
             [card("Fictional test", "A safe practice source plus an expected correction challenge.", GOLD), card("Two-week decision", "Minutes, corrections, usefulness, safety slips, and keep/revise/stop.", PINK)]],
            colWidths=[3.07 * inch, 3.07 * inch],
            hAlign="LEFT",
            style=[("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 0), ("RIGHTPADDING", (0,0), (-1,-1), 7), ("TOPPADDING", (0,0), (-1,-1), 5), ("BOTTOMPADDING", (0,0), (-1,-1), 5)],
        ),
        Spacer(1, 0.1 * inch),
        P("Included", H2),
        P("45-minute leadership setup + 90-minute teacher build lab + participant toolkit + 30-minute virtual follow-up two weeks later. NYC in-person or live virtual delivery. A second same-day cohort is $750.", BODY),
        P("The boundary", H2),
        P("The assistant may draft and organize. It does not grade, evaluate students, make regulated decisions, or process student records. School leadership owns tool approval and policy. Teachers retain every instructional and final-use decision.", BODY),
        rule(space=5),
        P("SEE THE COMPLETE INTERACTIVE WORKSHOP PREVIEW", LABEL),
        P("www.awolverton.com/ai-schools.html  |  hello@awolverton.com", H2),
    ]
    build(OUTPUT / "Teacher-Time-Back-Lab-Pilot-Overview.pdf", story, margins=(0.62, 0.62, 0.58, 0.52))


def build_leadership():
    story = cover(
        "Leadership setup guide",
        "Create the approved environment before teachers build.",
        "A 45-minute decision guide for one lower-risk, school-aligned teacher cohort. This does not replace school policy, privacy review, or legal advice.",
        [("45 min", "setup conversation"), ("5", "decisions to make"), ("0", "student records needed")],
    )
    story += [callout("Fallback", "If the approved environment is unclear, the lab runs in paper/demo mode with fictional material. Teachers do not create workaround accounts."), PageBreak()]
    sections = [
        ("1. Name the approved environment", [
            "Record the exact tool, account type, and access route teachers may use.",
            "Approved tool and version", "Approved account or sign-in", "Age or role restrictions", "Data-processing restrictions", "Where staff confirm approval", "Leader who owns the answer"
        ]),
        ("2. Set the input lanes", [
            "GREEN: blank templates, fictional examples, public information, teacher-written material, and approved student-neutral sources.",
            "YELLOW: internal documents, high-stakes translations, personnel notes, regulated decisions, copyrighted material without clear reuse rights, or combinations of details that may identify someone.",
            "RED: student records, direct or indirect identifiers, identifiable student work, grades, rosters, behavior, health, disability, counseling, family, or confidential staff information."
        ]),
        ("3. Confirm the human decision line", [
            "The assistant may draft, organize, reformat, summarize neutral material, or propose options.",
            "It does not grade, score, rank, diagnose, recommend discipline, determine accommodations, write an IEP, make placement decisions, send communications, or replace required professional review."
        ]),
        ("4. Select the cohort", [
            "Recommended size: 8-20 educators.",
            "Prefer a shared planning context or grade band where possible.",
            "Invite one participating leader who can answer local questions.",
            "Do not use the session to evaluate teacher performance."
        ]),
        ("5. Choose first-build lanes", [
            "Reuse Planner: approved lessons, directions, unit structures, and checklists.",
            "Family Message Drafter: neutral logistics and general updates only.",
            "Meeting-to-Action Assistant: neutral or properly de-identified agendas and notes.",
            "Teaching Library Organizer: educator-owned, student-neutral resources.",
            "Feedback Framework Builder: rubrics and neutral stems, never student scoring."
        ]),
    ]
    for idx, (heading, items) in enumerate(sections):
        story.append(P(heading, H1))
        for item in items:
            if idx == 0 and item != items[0]:
                story.append(write_line(item, 0.28 * inch))
            elif item == items[0] and idx == 0:
                story.append(P(item, BODY))
            else:
                story.append(bullet(item))
        if idx in (1, 3):
            story.append(PageBreak())
    story += [P("Day-of readiness", TITLE)]
    for item in [
        "The approved environment and account are named on the opening slide.",
        "Teachers can sign in before the lab begins.",
        "The school's use and privacy guidance is available.",
        "The escalation contact is named.",
        "The fictional practice pack is distributed.",
        "Teachers understand that no student records are needed.",
        "A leader will participate or remain reachable.",
    ]:
        story.append(checkbox(item))
    story += [Spacer(1, 0.18 * inch), callout("Follow-up", "Use cohort-level counts only: tested assistants, keep/revise/stop choices, time and correction patterns, safety slips, and next support. Do not use workshop data for teacher evaluation.", AMBER, GOLD)]
    build(OUTPUT / "Leadership-Setup-Guide.pdf", story)


def build_facilitator():
    story = cover(
        "Facilitator guide",
        "Run one 90-minute lab that ends with a working blueprint.",
        "Lead with workload, not AI features. Show the finished artifact first. Keep every safety rule visible in the artifact itself.",
        [("10", "name the drain"), ("55", "protect and build"), ("25", "practice and save")],
    )
    story += [callout("Opening line", "You are not here to master AI. You are here to stop rebuilding one piece of work."), PageBreak()]
    agenda = [
        ("0-10", "Name the time drain", "Show the completed Reuse Planner. Participants write: I keep rebuilding..."),
        ("10-25", "Protect the inputs", "Name the approved environment. Use the green, yellow, and red cards. Every participant writes approved and prohibited inputs."),
        ("25-40", "Choose and bound", "Apply four filters: repeatable, student-neutral, reviewable, bounded. Narrow or reroute any task that fails."),
        ("40-65", "Build the blueprint", "Define role, sources, output, quality, refusal, and human decision. Use plain language, not prompt jargon."),
        ("65-80", "Test and review", "Use the fictional practice pack. Review accuracy, bias, appropriateness, and alignment. Revise once."),
        ("80-90", "Save and measure", "Save the instructions, test, review routine, and two-week measurement log."),
    ]
    data = [[P("TIME", LABEL), P("MOVE", LABEL), P("FACILITATOR JOB", LABEL)]]
    for time, move, job in agenda:
        data.append([P(time, CARD_TITLE), P(move, CARD_TITLE), P(job, BODY)])
    t = Table(data, colWidths=[0.72 * inch, 1.55 * inch, 3.93 * inch], repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), DEEP), ("TEXTCOLOR", (0,0), (-1,0), WHITE), ("GRID", (0,0), (-1,-1), 0.7, LINE), ("BACKGROUND", (0,1), (-1,-1), WHITE), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9), ("TOPPADDING", (0,0), (-1,-1), 9), ("BOTTOMPADDING", (0,0), (-1,-1), 9)]))
    story += [t, PageBreak(), P("The six-field build", TITLE)]
    fields = [
        ("Role", "What single job does the assistant perform?"),
        ("Sources", "What blank, public, fictional, educator-owned, or approved neutral sources may it use?"),
        ("Output", "What exact structure should it return?"),
        ("Quality", "What makes the draft useful and easy to review?"),
        ("Refusal", "What must make it stop and ask for a safer source?"),
        ("Human decision", "What professional decision remains with the educator?"),
    ]
    story.append(Table([[card(a,b, [TEAL,AQUA,GOLD,PINK,TEAL,GOLD][i]) for i,(a,b) in enumerate(fields[:2])], [card(a,b, [TEAL,AQUA,GOLD,PINK,TEAL,GOLD][i+2]) for i,(a,b) in enumerate(fields[2:4])], [card(a,b, [TEAL,AQUA,GOLD,PINK,TEAL,GOLD][i+4]) for i,(a,b) in enumerate(fields[4:])]], colWidths=[3.08*inch,3.08*inch], style=[("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
    story += [PageBreak(), P("Common moments", TITLE)]
    responses = [
        ("I do not know anything about AI.", "That is fine. You need one task and your professional judgment. The structure does the rest."),
        ("Can I paste student work if I remove the name?", "Not in this workshop. Names are only one identifier, and local rules may be stricter. Use the fictional pack and ask the privacy lead about the real workflow."),
        ("Can it grade for me?", "It can help build a rubric or neutral feedback framework. Student-level evaluation and every final score stay with the educator."),
        ("The approved tool is unavailable.", "Switch to paper/demo mode. Complete the blueprint and rehearsal. Do not create a workaround account."),
    ]
    for q,a in responses:
        story += [P(q,H2), P(a,BODY)]
    story += [PageBreak(), P("Two-week follow-up", TITLE)]
    for item in ["0-5: anonymous pulse and wins.", "5-15: compare before/after minutes and correction work.", "15-23: diagnose common failure patterns.", "23-28: each educator chooses keep, revise, or stop.", "28-30: name unanswered policy or support needs for leadership."]:
        story.append(bullet(item))
    story.append(callout("Close", "The assistant drafts. You decide. If it takes longer to correct than to do yourself, revise it or stop using it.", MINT, AQUA))
    build(OUTPUT / "Facilitator-Guide.pdf", story)


def build_workbook():
    story = cover(
        "Participant workbook",
        "One task. One assistant. One safe test.",
        "You do not need AI experience, coding, or student records. Use this workbook to build a small assistant you can test and improve.",
        [("1", "recurring task"), ("4", "review checks"), ("2 weeks", "measure before deciding")],
    )
    story += [callout("Important", "Use only the school-approved environment. If that is unclear, stay in paper/demo mode and ask leadership."), PageBreak(), P("1. Name the time drain", TITLE)]
    for label in ["I keep rebuilding, rewriting, reorganizing, or reformatting", "It happens approximately this often", "It usually takes this many minutes", "I want the time back for"]:
        story.append(write_line(label, 0.55*inch))
    story += [PageBreak(), P("2. Run the first-task filters", TITLE)]
    for item in ["Repeatable: this happens often.", "Student-neutral: it can work without student records.", "Reviewable: I can quickly judge the result.", "Bounded: I can describe the job in one sentence."]:
        story.append(checkbox(item))
    story += [Spacer(1, .2*inch), callout("If a box is empty", "Narrow the task or choose another. A smaller first assistant is more likely to be useful and safe.", AMBER, GOLD), PageBreak(), P("3. Check the environment", TITLE)]
    for label in ["School-approved tool", "Approved account or sign-in", "Where I check local guidance", "Who I ask when unsure"]:
        story.append(write_line(label, 0.46*inch))
    story += [PageBreak(), P("4. Protect the inputs", TITLE), P("My approved inputs", H2)]
    for _ in range(3): story.append(write_line("Blank, public, fictional, educator-owned, or approved neutral source", .38*inch))
    story += [P("My pause-and-ask inputs", H2)]
    for _ in range(2): story.append(write_line("Input that needs a local answer", .38*inch))
    story += [P("My never-enter inputs", H2)]
    for _ in range(3): story.append(write_line("Student, staff, or confidential information", .38*inch))
    story += [PageBreak(), P("5. Build the assistant", TITLE)]
    for label in ["Assistant name", "One-sentence job", "Role", "Approved sources", "Exact output", "Quality criteria", "Refusal rule", "Human decision line"]:
        story.append(write_line(label, 0.38*inch))
    story += [PageBreak(), P("6. Copy-ready instruction frame", TITLE), callout("Copy and complete", "You are my [ROLE]. Your only job is to [ONE BOUNDED TASK].<br/><br/>Use only [APPROVED SOURCES]. Do not assume facts that are not present. Return [EXACT OUTPUT AND FORMAT]. Make the draft [QUALITY CRITERIA].<br/><br/>If the request appears to contain student or confidential information, stop and ask for blank, fictional, public, or student-neutral replacement material and direct me to school guidance.<br/><br/>You may draft and organize. I make every instructional, evaluative, communication, and final-use decision. End with: Teacher review required: check accuracy, bias, appropriateness, and alignment before use.", WHITE, TEAL), PageBreak(), P("7. Test with fictional material", TITLE)]
    for label in ["Practice source used", "What worked", "What was missing or invented", "One instruction I changed"]:
        story.append(write_line(label, .62*inch))
    story += [PageBreak(), P("8. Review every output", TITLE)]
    for item in ["Accuracy: facts, assumptions, omissions, and invented details.", "Bias: whose context, language, and perspective are treated as default.", "Appropriateness: tone, level, accessibility, and format.", "Alignment: task, school guidance, and professional goal."]:
        story.append(checkbox(item))
    story += [Spacer(1,.2*inch), P("My decision", H2), checkbox("Use after editing"), checkbox("Revise the assistant"), checkbox("Stop"), PageBreak(), P("9. Two-week measurement", TITLE)]
    data = [[P(x,LABEL) for x in ["Date","Task","Before","With AI","Corrections","Useful?","Slip?","Decision"]]]
    for _ in range(7): data.append([""]*8)
    t = Table(data, colWidths=[.55*inch,1.35*inch,.58*inch,.58*inch,.72*inch,.58*inch,.48*inch,.72*inch], rowHeights=[.35*inch]+[.62*inch]*7, repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),DEEP),("TEXTCOLOR",(0,0),(-1,0),WHITE),("GRID",(0,0),(-1,-1),.7,LINE),("BACKGROUND",(0,1),(-1,-1),WHITE),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4)]))
    story += [t, Spacer(1,.15*inch), callout("Decision rule", "Keep it if it is useful, faster including corrections, safe, and easy to explain. Revise it if the job or output is unclear. Stop if correction work cancels the benefit or the safety boundary is unstable.", MINT, AQUA)]
    build(OUTPUT / "Teacher-Workbook.pdf", story)


def build_example():
    story = cover(
        "Completed example",
        "Meet the Reuse Planner.",
        "A finished first assistant for a teacher who spends 25-35 minutes reformatting approved unit materials into a consistent weekly structure.",
        [("1", "bounded job"), ("0", "student records"), ("4", "review checks")],
    )
    story += [callout("Job", "Turn one approved, educator-owned lesson or unit outline into an editable weekly structure without adding student-specific content."), PageBreak(), P("The blueprint", TITLE)]
    fields = [
        ("Approved inputs", "Blank weekly template; educator-written objectives and directions; approved unit outline; public standards text when supplied; fictional practice details."),
        ("Never uses", "Student records, identifiers, identifiable work, grades, attendance, behavior, health, disability, family, counseling, rosters, grouping data, or private records."),
        ("Exact output", "Week-at-a-glance table; daily objectives; materials; concise directions; missing-information list; teacher decisions still needed."),
        ("Refusal", "Stop if an input appears sensitive. Do not repeat it. Ask for blank, public, fictional, or student-neutral replacement material."),
        ("Teacher decides", "Source accuracy, objective, sequence, accessibility, instructional fit, standards alignment, and final use."),
        ("Success", "A useful first draft that is faster to correct than to rebuild, with no safety slips."),
    ]
    for a,b in fields:
        story += [P(a,H2), P(b,BODY)]
    story += [PageBreak(), P("Copy-ready instructions", TITLE), callout("Reuse Planner", "You are my Reuse Planner. Your only job is to turn an approved, educator-owned lesson or unit outline into an editable weekly structure.<br/><br/>Use only the material I provide. Do not add facts, standards, activities, accommodations, or student needs that are not present. Return a week-at-a-glance table followed by daily objectives, a materials checklist, concise directions, and a list titled Teacher decisions still needed.<br/><br/>Never request or use student records, direct or indirect identifiers, identifiable student work, grades, attendance, behavior, health, disability, counseling, family, personnel, or confidential information. If the request appears to contain those details, stop, name the category without repeating it, and ask for blank, fictional, public, or student-neutral replacement material and school guidance.<br/><br/>You may draft and organize. I remain responsible for every instructional decision and final use. End each response with: Teacher review required: check accuracy, bias, appropriateness, and alignment before use.", WHITE, TEAL), PageBreak(), P("Fictional test", TITLE), P("Use the Harbor City Public Spaces unit in the Fictional Practice Pack. Ask the assistant to place the provided objectives and activities into the blank weekly structure. Do not ask it to invent student needs or assessment results.", BODY), P("Expected safe behavior", H2)]
    for item in ["preserves the provided objectives;", "labels missing information instead of inventing it;", "uses the requested weekly structure;", "includes the educator-review reminder;", "refuses if an identifiable student note appears."]:
        story.append(bullet(item))
    story += [PageBreak(), P("Two-week success test", TITLE)]
    for item in ["It produces a useful first draft at least three times.", "Total time including corrections is lower than the previous process.", "No prohibited information is entered.", "The educator can explain what the assistant may and may not do."]:
        story.append(checkbox(item))
    story.append(callout("Decision", "Keep, revise, or stop based on evidence. No fixed time saving is promised.", MINT, AQUA))
    build(OUTPUT / "Reuse-Planner-Completed-Example.pdf", story)


def build_practice():
    story = cover(
        "Fictional practice pack",
        "Harbor City Public Spaces",
        "A completely fictional, student-neutral source set for testing an assistant without using student records.",
        [("2", "fictional proposals"), ("1", "blank weekly structure"), ("1", "built-in correction challenge")],
    )
    story += [callout("Practice only", "Nothing in this pack describes a real school, student, family, or community decision."), PageBreak(), P("Unit snapshot", TITLE), P("Grade band: 6-8<br/>Subject: Humanities / civics<br/>Essential question: How do public spaces communicate who belongs and what a community values?", BODY), P("Learning objectives", H2)]
    for item in ["Identify how design choices shape the use of a public space.", "Compare two fictional proposals using stated criteria.", "Support a recommendation with evidence from provided sources.", "Revise a public-facing explanation for clarity and audience."]:
        story.append(bullet(item))
    story += [PageBreak(), P("Source A: Harbor Steps Plaza", TITLE), P("Harbor City plans to replace a fenced parking lot beside the library with a public plaza. The draft proposal includes movable seating, shade trees, a small performance platform, a water fountain, and a wide path connecting the library to the bus stop. The projected construction cost is 2.4 million fictional dollars. A survey of 800 fictional residents identified shade, seating, and safe pedestrian access as the top priorities.", BODY), Spacer(1,.2*inch), P("Source B: Market Lane Garden", TITLE), P("A second proposal would turn the same site into a community garden with 42 raised beds, a tool shed, an outdoor classroom, and a weekend produce stand. The projected construction cost is 1.9 million fictional dollars. The garden group proposes reserving 10 beds for school and senior-center programs. The plan includes a narrow path but no direct bus-stop connection.", BODY), PageBreak(), P("Blank weekly structure", TITLE)]
    data=[[P(x,LABEL) for x in ["Day","Objective","Source / activity","Directions","Materials","Decision"]]]
    for day in ["Monday","Tuesday","Wednesday","Thursday","Friday"]:
        data.append([P(day,BODY),"","","","",""])
    t=Table(data,colWidths=[.65*inch,1.08*inch,1.18*inch,1.35*inch,.9*inch,1.0*inch],rowHeights=[.38*inch]+[1.05*inch]*5,repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),DEEP),("TEXTCOLOR",(0,0),(-1,0),WHITE),("GRID",(0,0),(-1,-1),.7,LINE),("BACKGROUND",(0,1),(-1,-1),WHITE),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5)]))
    story += [t, PageBreak(), P("Neutral family update brief", TITLE)]
    for item in ["Event: Harbor City Public Spaces Exhibition", "Date: Thursday, October 22", "Time: 5:30-7:00 p.m.", "Location: school library", "Purpose: families view displays and leave written feedback", "Accessibility: elevator entrance on Market Street", "Translation: school-approved versions follow the school's normal review process"]:
        story.append(bullet(item))
    story += [P("Neutral meeting notes", H1)]
    for item in ["Confirm exhibition room layout by October 8.", "Facilities lead checks display boards.", "Humanities team prepares a visitor guide.", "Main office confirms accessibility entrance.", "Next planning check: October 12 at 3:20 p.m."]:
        story.append(bullet(item))
    story += [PageBreak(), P("Safety interruption", TITLE), callout("Facilitator move", "Add a fictional line containing a name, ID, disability information, and housing detail. The assistant should refuse, avoid repeating the details, ask for a fictional or student-neutral replacement, and direct the educator to school guidance.", AMBER, GOLD), Spacer(1,.15*inch), P("Correction challenge", H1), P("The fictional draft incorrectly states that both proposals include a direct bus-stop connection. Participants should identify and correct the invented claim before use.", BODY)]
    build(OUTPUT / "Fictional-Practice-Pack.pdf", story)


def build_cards():
    pagesize = landscape(letter)
    story = [P("PRINTABLE SAFETY + REVIEW CARDS", LABEL), P("Cut on the center lines. Keep one card beside the approved AI environment.", DISPLAY), Spacer(1,.1*inch)]
    cards = [
        ("BEFORE ANYTHING GOES IN", "1. Check the exact school-approved tool and account.<br/>2. Scan for direct and indirect identifiers.<br/>3. Prefer blank, public, fictional, educator-owned, or approved neutral sources.<br/>4. If unsure, stop and ask the named school contact.", AQUA),
        ("GREEN / YELLOW / RED", "<b>GREEN:</b> blank templates, public facts, fictional examples, approved neutral materials.<br/><br/><b>YELLOW:</b> internal documents, high-stakes translation, de-identified records, regulated decisions, or unusual detail combinations.<br/><br/><b>RED:</b> student records, identifiers, identifiable work, grades, rosters, behavior, health, disability, family, or confidential staff information.", GOLD),
        ("REVIEW EVERY OUTPUT", "<b>Accuracy:</b> What is true, assumed, missing, or invented?<br/><br/><b>Bias:</b> Whose context is treated as default?<br/><br/><b>Appropriateness:</b> Are tone, level, accessibility, and format right?<br/><br/><b>Alignment:</b> Does it support the task, local guidance, and professional goal?", PINK),
        ("THE HUMAN DECISION LINE", "The assistant may draft, organize, reformat, summarize neutral material, and offer options.<br/><br/>The educator keeps instructional judgment, student-level evaluation, grading, communication approval, accommodations, safety decisions, and final use.<br/><br/><b>The assistant drafts. People decide.</b>", TEAL),
    ]
    def big_card(title, body, accent):
        t=Table([[P(title,CARD_TITLE)],[P(body,BODY)]],colWidths=[4.55*inch],rowHeights=[.45*inch,2.02*inch])
        t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),WHITE),("BOX",(0,0),(-1,-1),1.1,accent),("LINEABOVE",(0,0),(-1,0),9,accent),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),18),("RIGHTPADDING",(0,0),(-1,-1),18),("TOPPADDING",(0,0),(-1,-1),15),("BOTTOMPADDING",(0,0),(-1,-1),15)]))
        return t
    grid=Table([[big_card(*cards[0]),big_card(*cards[1])],[big_card(*cards[2]),big_card(*cards[3])]],colWidths=[4.7*inch,4.7*inch],rowHeights=[2.62*inch,2.62*inch])
    grid.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),("LINEAFTER",(0,0),(0,-1),.6,LINE),("LINEBELOW",(0,0),(-1,0),.6,LINE)]))
    story.append(grid)
    build(OUTPUT / "Safe-Input-and-Review-Cards.pdf", story, pagesize=pagesize, margins=(.45,.45,.45,.45))


def main():
    build_pilot_overview()
    build_leadership()
    build_facilitator()
    build_workbook()
    build_example()
    build_practice()
    build_cards()
    for path in sorted(OUTPUT.glob("*.pdf")):
        print(f"{path.name}: {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
