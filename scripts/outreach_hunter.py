#!/usr/bin/env python3
"""
Outreach Hunter — Proactive high-value relationship initiator.

Reads leads_crm.csv, filters High-Priority leads (PB/MB STRO, TPA density),
generates 1-page PDF Intelligence Briefs, and sends personalized emails via
Gmail API with LLM ghostwriting and human-mimic throttling.

Requires: Gmail API OAuth setup, OpenAI API key (or template fallback).
"""

from __future__ import annotations

import base64
import csv
import email.utils
import json
import os
import random
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Optional deps — fail gracefully if missing
try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.units import inch
    from reportlab.pdfgen import canvas
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    HAS_GMAIL = True
except ImportError:
    HAS_GMAIL = False

# --- Configuration ---
BASE_DIR = Path(__file__).resolve().parent.parent
LEADS_CSV = BASE_DIR / "leads_crm.csv"
CREDS_DIR = BASE_DIR / "scripts" / "outreach_creds"
CREDS_FILE = CREDS_DIR / "credentials.json"
TOKEN_FILE = CREDS_DIR / "token.json"
DAILY_COUNTER_FILE = BASE_DIR / ".outreach_daily_count.json"

MAX_EMAILS_PER_DAY = 5
PST = timezone(timedelta(hours=-8))
SEND_WINDOW_START = (8, 45)   # 8:45 AM
SEND_WINDOW_END = (16, 15)    # 4:15 PM
FOLLOWUP_HOURS = 72

SUBJECT_TEMPLATES = [
    "Urgent: Transfer Tax Impact for {address}",
    "Jan 28 Tax Update: Strategy for your {zone} property",
    "New Condo-Sale Equity at {address}?",
]

# High-priority zones / lead types
PB_MB_ZONES = ("Pacific Beach", "Mission Beach", "Pacific Beach / Mission Beach")
TPA_ZONE_PREFIX = "TPA_"
STRO_TYPES = ("stro", "STRO")
ADU_TYPES = ("adu", "ADU")


def is_high_priority(lead: dict) -> bool:
    zone = (lead.get("Zone") or "").strip()
    lt = (lead.get("Lead_Type") or "").strip().lower()
    if any(z in zone for z in PB_MB_ZONES) and any(s in lt for s in ("stro", "tier")):
        return True
    if zone.startswith(TPA_ZONE_PREFIX) or "TPA" in zone:
        return True
    if "92109" in zone or "92101" in zone or "92103" in zone:
        return True
    return "stro" in lt or "adu" in lt or "tpa" in lt


def is_not_contacted(lead: dict) -> bool:
    status = (lead.get("Status") or "").strip()
    return status in ("", "New") or status.lower() == "new"


def has_email(lead: dict) -> bool:
    return bool((lead.get("Email") or "").strip())


def load_leads() -> list[dict]:
    if not LEADS_CSV.exists():
        return []
    rows = []
    with open(LEADS_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        for row in reader:
            rows.append(dict(row))
    return rows


def save_leads(rows: list[dict], fieldnames: list[str]) -> None:
    with open(LEADS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def get_fieldnames(rows: list[dict]) -> list[str]:
    base = ["Name", "Address", "Zone", "Lead_Type", "Email", "Status"]
    extra = ["Contacted_Date", "Gmail_Thread_Id", "FollowUp_Sent_Date"]
    return base + extra


# --- Transfer Tax (same logic as property page) ---
RATE_CURRENT = 0.55 / 500
RATE_PROPOSED = 30.55 / 500


def exit_tax_increase(value: float) -> float:
    return value * (RATE_PROPOSED - RATE_CURRENT)


def estimate_transfer_tax_risk(lead: dict) -> tuple[float, str]:
    """Return (est_tax_increase, label). Assume $1.5M for PB/MB/TPA/ADU."""
    return (exit_tax_increase(1_500_000), "$1.5M sale: ~$90k increase")


def adu_condo_potential(lead: dict) -> str:
    lt = (lead.get("Lead_Type") or "").lower()
    if "adu" in lt:
        return "$550k – $750k (est. separated asset value)"
    return "N/A (no completed ADU on record)"


# --- PDF Brief ---
def generate_property_report(lead_data: dict, out_path: Path) -> None:
    """Generate 1-page 2026 San Diego Property Intelligence Brief PDF."""
    if not HAS_REPORTLAB:
        raise RuntimeError("ReportLab required. Install: pip install reportlab")

    addr = lead_data.get("Address") or "Unknown"
    zone = lead_data.get("Zone") or "San Diego"
    tax_risk, tax_label = estimate_transfer_tax_risk(lead_data)
    adu_val = adu_condo_potential(lead_data)

    c = canvas.Canvas(str(out_path), pagesize=letter)
    w, h = letter

    # Watermark
    c.saveState()
    c.setFillColor(colors.HexColor("#e0e0e0"))
    c.setFont("Helvetica-Bold", 32)
    c.translate(w / 2, h / 2)
    c.rotate(45)
    c.drawCentredString(0, 0, "CONFIDENTIAL")
    c.restoreState()

    # Header
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(colors.HexColor("#1a1a1a"))
    c.drawString(inch, h - inch, "2026 San Diego Property Intelligence Brief")
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#666666"))
    c.drawString(inch, h - inch - 16, "DoggyBagg Ordinance | Feb 2, 2026")

    # Content
    y = h - inch - 60
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.HexColor("#1a1a1a"))
    c.drawString(inch, y, "Property Address")
    c.setFont("Helvetica", 11)
    y -= 20
    c.drawString(inch, y, addr)
    y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y, "Transfer Tax Exit Risk")
    c.setFont("Helvetica", 11)
    y -= 20
    c.setFillColor(colors.HexColor("#c2410c"))
    c.drawString(inch, y, f"Est. increase: ${tax_risk:,.0f} ({tax_label})")
    c.setFillColor(colors.HexColor("#1a1a1a"))
    y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y, "ADU Condo-Sale Potential")
    c.setFont("Helvetica", 11)
    y -= 20
    c.drawString(inch, y, adu_val)
    y -= 40

    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#888888"))
    c.drawString(inch, y, f"Zone: {zone} | Generated Feb 2, 2026")
    c.drawString(inch, y - 14, "This brief is for informational purposes. Consult a professional for advice.")

    c.save()


# --- LLM Ghostwriter ---
def write_email_body(lead: dict, is_followup: bool = False) -> str:
    """Generate Concerned Expert tone body via LLM or template."""
    api_key = os.environ.get("OPENAI_API_KEY")
    addr = lead.get("Address") or "[Address]"
    zone = lead.get("Zone") or "your area"
    name = (lead.get("Name") or "").strip() or "there"

    if api_key:
        try:
            import urllib.request
            import urllib.error
            body = _call_openai(api_key, lead, addr, zone, name, is_followup)
            if body:
                return body
        except Exception as e:
            print(f"[outreach_hunter] LLM fallback: {e}")

    if is_followup:
        return f"""Hi {name},

I wanted to follow up on the Property Intelligence Brief I sent for {addr}.

The Feb 5th "Neighborhoods for All" forum is coming up — it's a key deadline for many compliance and ordinance updates in San Diego. If you'd like a quick call to discuss how this affects your property, I'm happy to schedule one.

Best regards,
DoggyBagg Ordinance
"""

    return f"""Hi {name},

I'm reaching out regarding your property at {addr} in {zone}.

San Diego's proposed transfer tax changes (effective Jan 2026) could materially affect your exit strategy — and depending on your permit status, there may be ADU condo-sale opportunities under AB 1033.

I've attached a 1-page Intelligence Brief with specifics for this address. It's confidential and prepared for your eyes only. If you'd like to discuss next steps or schedule a quick audit, just reply to this email.

Best regards,
DoggyBagg Ordinance
"""


def _call_openai(api_key: str, lead: dict, addr: str, zone: str, name: str, is_followup: bool) -> str | None:
    try:
        import urllib.request
        import urllib.error
    except ImportError:
        return None
    sys_msg = "You are a concerned expert in San Diego real estate ordinances. Write a brief, professional email. Tone: concerned expert, not salesy. Do not use markdown. Sign as DoggyBagg Ordinance."
    if is_followup:
        user_msg = f"Follow-up to {name} about {addr}. Mention Feb 5th Neighborhoods for All forum as a compliance deadline. Soft nudge, not pushy."
    else:
        user_msg = f"Email to {name} about {addr} in {zone}. Mention transfer tax impact and ADU condo-sale potential. They received a PDF brief. Invite them to reply or schedule a call."
    data = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": sys_msg},
            {"role": "user", "content": user_msg},
        ],
        "max_tokens": 400,
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        j = json.load(resp)
    text = (j.get("choices") or [{}])[0].get("message", {}).get("content", "")
    return text.strip() if text else None


# --- Gmail ---
SCOPES = ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.readonly"]


def get_gmail_service():
    if not HAS_GMAIL:
        raise RuntimeError("Gmail API required. Install: pip install google-auth-oauthlib google-api-python-client")
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDS_FILE.exists():
                raise FileNotFoundError(
                    f"Gmail credentials not found. Place credentials.json in {CREDS_DIR}. "
                    "See https://developers.google.com/gmail/api/quickstart/python"
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        CREDS_DIR.mkdir(parents=True, exist_ok=True)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)


def send_email(service, to: str, subject: str, body: str, pdf_path: Path | None = None) -> str | None:
    import email.mime.multipart
    import email.mime.text
    import email.mime.base
    import email.encoders

    msg = email.mime.multipart.MIMEMultipart()
    msg["To"] = to
    msg["From"] = "doggybag422@gmail.com"
    msg["Subject"] = subject
    msg["Date"] = email.utils.formatdate(localtime=True)
    msg.attach(email.mime.text.MIMEText(body, "plain"))
    if pdf_path and pdf_path.exists():
        with open(pdf_path, "rb") as f:
            attachment = email.mime.base.MIMEBase("application", "pdf")
            attachment.set_payload(f.read())
        email.encoders.encode_base64(attachment)
        attachment.add_header("Content-Disposition", "attachment", filename=pdf_path.name)
        msg.attach(attachment)
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    sent = service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return sent.get("threadId") or sent.get("id")


def has_reply(service, thread_id: str) -> bool:
    """Check if thread has messages after our send (simple: count > 1 = reply)."""
    try:
        thread = service.users().threads().get(userId="me", id=thread_id).execute()
        return len(thread.get("messages", [])) > 1
    except Exception:
        return False


# --- Throttling ---
def is_within_send_window() -> bool:
    now = datetime.now(PST)
    h, m = now.hour, now.minute
    start_h, start_m = SEND_WINDOW_START
    end_h, end_m = SEND_WINDOW_END
    t_now = h * 60 + m
    t_start = start_h * 60 + start_m
    t_end = end_h * 60 + end_m
    return t_start <= t_now <= t_end


def get_today_sent_count() -> int:
    if not DAILY_COUNTER_FILE.exists():
        return 0
    try:
        with open(DAILY_COUNTER_FILE) as f:
            d = json.load(f)
        today = datetime.now(PST).strftime("%Y-%m-%d")
        if d.get("date") == today:
            return int(d.get("count", 0))
    except Exception:
        pass
    return 0


def increment_today_sent() -> None:
    today = datetime.now(PST).strftime("%Y-%m-%d")
    count = get_today_sent_count() + 1
    with open(DAILY_COUNTER_FILE, "w") as f:
        json.dump({"date": today, "count": count}, f)


def can_send_more() -> bool:
    return get_today_sent_count() < MAX_EMAILS_PER_DAY and is_within_send_window()


# --- Main ---
def get_initial_outreach_leads(rows: list[dict]) -> list[tuple[int, dict]]:
    """High-priority, not contacted, has email."""
    out = []
    for i, r in enumerate(rows):
        if not is_high_priority(r):
            continue
        if not is_not_contacted(r):
            continue
        if not has_email(r):
            continue
        out.append((i, r))
    return out


def get_followup_leads(rows: list[dict], service=None) -> list[tuple[int, dict]]:
    """Contacted >72h ago, no reply (via Gmail), no follow-up sent."""
    now = datetime.now(PST)
    cutoff = now - timedelta(hours=FOLLOWUP_HOURS)
    out = []
    for i, r in enumerate(rows):
        status = (r.get("Status") or "").strip()
        if status != "Contacted_With_Brief":
            continue
        if (r.get("FollowUp_Sent_Date") or "").strip():
            continue
        cd = r.get("Contacted_Date") or ""
        if not cd:
            continue
        try:
            dt = datetime.strptime(cd.split(" ")[0], "%Y-%m-%d")
            dt = dt.replace(tzinfo=PST)
            if dt >= cutoff:
                continue
        except ValueError:
            continue
        thread_id = (r.get("Gmail_Thread_Id") or "").strip()
        if service and thread_id and has_reply(service, thread_id):
            rows[i]["Status"] = "Replied"
            continue
        out.append((i, r))
    return out


def main() -> None:
    import sys
    dry_run = "--dry-run" in sys.argv
    if dry_run:
        print("[outreach_hunter] DRY RUN (no emails sent, no CSV writes)")

    os.chdir(BASE_DIR)
    print("[outreach_hunter] Starting Outreach Hunter")

    if not LEADS_CSV.exists():
        print("[outreach_hunter] leads_crm.csv not found. Run lead_sniper.py first.")
        return

    rows = load_leads()
    fieldnames = get_fieldnames(rows)

    # Check Gmail / ReportLab
    if not HAS_REPORTLAB:
        print("[outreach_hunter] Install ReportLab: pip install reportlab")
        return
    if not HAS_GMAIL:
        print("[outreach_hunter] Install: pip install google-auth-oauthlib google-api-python-client")
        return

    if not dry_run and not can_send_more():
        print(f"[outreach_hunter] Throttle: outside {SEND_WINDOW_START}-{SEND_WINDOW_END} PST or already sent {MAX_EMAILS_PER_DAY} today")
        return

    if dry_run:
        initial = get_initial_outreach_leads(rows)
        followups = get_followup_leads(rows, service=None)
        print(f"[outreach_hunter] Would send: {len(initial)} initial, {len(followups)} follow-ups (max {MAX_EMAILS_PER_DAY}/day)")
        return

    service = get_gmail_service()
    pdf_dir = BASE_DIR / "outreach_pdfs"
    pdf_dir.mkdir(exist_ok=True)

    # 1. Follow-up loop first (softer touch)
    followups = get_followup_leads(rows, service)
    for idx, lead in followups:
        if not can_send_more():
            break
        email_addr = (lead.get("Email") or "").strip()
        addr = lead.get("Address") or "Unknown"
        body = write_email_body(lead, is_followup=True)
        subj = f"Re: {random.choice(SUBJECT_TEMPLATES).format(address=addr, zone=lead.get('Zone') or 'your area')}"
        try:
            msg_id = send_email(service, email_addr, subj, body, pdf_path=None)
            if msg_id:
                today = datetime.now(PST).strftime("%Y-%m-%d %H:%M")
                rows[idx]["Status"] = "Contacted_FollowUp"
                rows[idx]["FollowUp_Sent_Date"] = today
                rows[idx]["Gmail_Thread_Id"] = msg_id  # Store for future reply check
                increment_today_sent()
                print(f"[outreach_hunter] Follow-up sent: {addr} -> {email_addr}")
        except Exception as e:
            print(f"[outreach_hunter] Follow-up failed {addr}: {e}")

    # 2. Initial outreach
    initial = get_initial_outreach_leads(rows)
    random.shuffle(initial)
    for idx, lead in initial:
        if not can_send_more():
            break
        email_addr = (lead.get("Email") or "").strip()
        addr = lead.get("Address") or "Unknown"
        slug = re.sub(r"[^\w\-]", "", addr.lower().replace(" ", "-"))[:50]
        pdf_path = pdf_dir / f"brief_{slug or 'unknown'}.pdf"
        try:
            generate_property_report(lead, pdf_path)
        except Exception as e:
            print(f"[outreach_hunter] PDF failed {addr}: {e}")
            continue
        body = write_email_body(lead, is_followup=False)
        subj = random.choice(SUBJECT_TEMPLATES).format(
            address=addr,
            zone=lead.get("Zone") or "your area",
        )
        try:
            msg_id = send_email(service, email_addr, subj, body, pdf_path=pdf_path)
            if msg_id:
                today = datetime.now(PST).strftime("%Y-%m-%d %H:%M")
                rows[idx]["Status"] = "Contacted_With_Brief"
                rows[idx]["Contacted_Date"] = today
                rows[idx]["Gmail_Thread_Id"] = msg_id
                increment_today_sent()
                print(f"[outreach_hunter] Sent: {addr} -> {email_addr}")
        except Exception as e:
            print(f"[outreach_hunter] Send failed {addr}: {e}")
        time.sleep(random.uniform(30, 90))  # Human-mimic delay

    save_leads(rows, fieldnames)
    print("[outreach_hunter] Done. CSV updated.")


if __name__ == "__main__":
    main()
