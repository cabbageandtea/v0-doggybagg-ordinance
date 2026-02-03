#!/usr/bin/env python3
"""
Lead Sniper — Data acquisition engine for DoggyBagg Ordinance.

Fetches San Diego Open Data (STRO, RUBT, Building Permits), applies 2026
intelligence filters, and outputs high-priority leads to leads_crm.csv.

Designed for GitHub Action automation with stealth delays for rate limits.
"""

import csv
import os
import random
import time
from pathlib import Path

import requests

# --- Configuration ---
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_CSV = BASE_DIR / "leads_crm.csv"
DELAY_MIN_SEC = 1.5
DELAY_MAX_SEC = 3.5

# San Diego Open Data — seshat.datasd.org (City uses this for CSV exports)
URL_STRO = "https://seshat.datasd.org/stro_licenses/stro_licenses_datasd.csv"
URL_RUBT = "https://seshat.datasd.org/rtax_accounts/rtax_accounts_datasd.csv"
URL_PERMITS_ACTIVE = "https://seshat.datasd.org/development_permits_set2/permits_set2_active_datasd.csv"
URL_PERMITS_CLOSED = "https://seshat.datasd.org/development_permits_set2/permits_set2_closed_datasd.csv"

# CKAN fallback (if resource_id available)
CKAN_BASE = "https://data.sandiego.gov/api/3/action"

# 2026 Intelligence — Priority zones
ZIP_PACIFIC_BEACH = "92109"
ZIP_MISSION_BEACH = "92109"
ZIP_LA_JOLLA = "92037"
TIER_3 = "Tier 3"
TIER_4 = "Tier 4"

# Transit Priority Areas (TPAs) — 2026 LDC density amendments
# Add more zips/planning areas as needed; sample set for high-density corridors
TPA_ZIPS = {
    "92101", "92103", "92104", "92105", "92110", "92113",
    "92114", "92115", "92116", "92117", "92111", "92126",
}

# ADU keywords in permit records
ADU_KEYWORDS = ("adu", "accessory dwelling", "junior", "granny", "secondary unit")
COMPLETED_STATUS = ("closed", "completed", "final", "approved")


def stealth_delay():
    """Random delay between API calls to stay within rate limits."""
    sec = random.uniform(DELAY_MIN_SEC, DELAY_MAX_SEC)
    time.sleep(sec)


def fetch_csv(url: str) -> list[dict]:
    """Fetch CSV from URL and return list of row dicts."""
    stealth_delay()
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    text = r.text
    lines = [l for l in text.splitlines() if l.strip()]
    if not lines:
        return []
    reader = csv.DictReader(lines)
    return list(reader)


def ckan_datastore_search(resource_id: str, filters: dict | None = None, limit: int = 1000) -> list[dict]:
    """Query San Diego CKAN datastore_search. Returns records."""
    stealth_delay()
    payload = {"resource_id": resource_id, "limit": limit}
    if filters:
        payload["filters"] = filters
    r = requests.get(f"{CKAN_BASE}/datastore_search", params=payload, timeout=60)
    r.raise_for_status()
    data = r.json()
    if not data.get("success"):
        raise RuntimeError(data.get("error", {}))
    return data.get("result", {}).get("records", [])


def enrich_contact_info(name: str | None, business_name: str | None) -> str:
    """
    Placeholder for Hunter.io or Apollo.io integration.
    Returns email when connected; empty string for now.
    """
    # TODO: Connect to Hunter.io or Apollo.io API
    _ = name, business_name
    return ""


# --- Priority 1: Tier 3 STRO in Pacific Beach / Mission Beach ---
def fetch_stro_priority1() -> list[dict]:
    """Tier 3 STRO owners in Pacific Beach and Mission Beach (Jan 28 tax proposal)."""
    rows = fetch_csv(URL_STRO)
    leads = []
    for row in rows:
        tier = (row.get("tier") or "").strip()
        zip_ = (row.get("zip") or "").strip()
        if tier != TIER_3:
            continue
        if zip_ != ZIP_PACIFIC_BEACH:
            continue
        name = (row.get("host_contact_name") or row.get("local_contact_contact_name") or "").strip()
        address = (row.get("address") or "").strip()
        if not address:
            continue
        leads.append({
            "Name": name or "Unknown",
            "Address": address,
            "Zone": "Pacific Beach / Mission Beach",
            "Lead_Type": "STRO_Tier3_Jan28_Tax",
            "Email": enrich_contact_info(name, None),
            "Status": "New",
        })
    return leads


# --- Priority 2: TPA property owners ---
def fetch_tpa_leads() -> list[dict]:
    """Property owners in Transit Priority Areas (2026 LDC density amendments)."""
    stro_rows = fetch_csv(URL_STRO)
    rubt_rows = []
    try:
        rubt_rows = fetch_csv(URL_RUBT)
    except Exception as e:
        print(f"[lead_sniper] RUBT fetch skipped: {e}")
    leads = []
    seen = set()

    for row in stro_rows:
        zip_ = (row.get("zip") or "").strip()
        if zip_ not in TPA_ZIPS:
            continue
        address = (row.get("address") or "").strip()
        if not address or address in seen:
            continue
        seen.add(address)
        name = (row.get("host_contact_name") or row.get("local_contact_contact_name") or "").strip()
        leads.append({
            "Name": name or "Unknown",
            "Address": address,
            "Zone": f"TPA_{zip_}",
            "Lead_Type": "STRO_TPA_LDC2026",
            "Email": enrich_contact_info(name, None),
            "Status": "New",
        })

    for row in rubt_rows:
        zip_ = (row.get("zip") or row.get("zip_code") or "").strip()
        if zip_ not in TPA_ZIPS:
            continue
        address = (row.get("address") or row.get("street_address") or row.get("property_address") or "").strip()
        if not address or address in seen:
            continue
        seen.add(address)
        name = (row.get("business_name") or row.get("owner") or row.get("account_name") or "").strip()
        leads.append({
            "Name": name or "Unknown",
            "Address": address,
            "Zone": f"TPA_{zip_}",
            "Lead_Type": "RUBT_TPA_LDC2026",
            "Email": enrich_contact_info(name, name),
            "Status": "New",
        })

    return leads


# --- Priority 3: Completed ADU permits (condo-sale eligible) ---
def fetch_adu_completed() -> list[dict]:
    """Owners with completed ADU permits — eligible for new condo-sale separate title laws."""
    leads = []
    seen = set()

    # Use closed permits (completed projects); active = in progress
    for url in (URL_PERMITS_CLOSED,):
        try:
            rows = fetch_csv(url)
        except Exception as e:
            print(f"[lead_sniper] Permits fetch skipped ({url}): {e}")
            continue
        for row in rows:
            # Seshat permits: PROJECT_TITLE, APPROVAL_TYPE, JOB_BC_CODE_DESCRIPTION, etc.
            desc = " ".join(
                str(v).lower() for k, v in row.items()
                if v and k in (
                    "description", "record_type", "type", "project_type", "work_description",
                    "PROJECT_TITLE", "PROJECT_SCOPE", "APPROVAL_TYPE", "JOB_BC_CODE_DESCRIPTION",
                )
            )
            if not any(k in desc for k in ADU_KEYWORDS):
                continue
            address = (
                row.get("ADDRESS_JOB") or row.get("address") or row.get("project_address")
                or row.get("street_address") or row.get("addr") or ""
            ).strip()
            if not address or address in seen:
                continue
            seen.add(address)
            name = (
                row.get("APPROVAL_PERMIT_HOLDER") or row.get("applicant") or row.get("owner")
                or row.get("contact_name") or ""
            ).strip()
            leads.append({
                "Name": name or "Unknown",
                "Address": address,
                "Zone": (row.get("zip") or row.get("zip_code") or "").strip(),
                "Lead_Type": "ADU_Completed_CondoSale",
                "Email": enrich_contact_info(name, None),
                "Status": "New",
            })

    return leads


# --- RUBT long-term landlords (bonus) ---
def fetch_rubt_landlords(limit: int = 500) -> list[dict]:
    """Long-term landlords from Rental Unit Business Tax accounts."""
    try:
        rows = fetch_csv(URL_RUBT)
    except Exception as e:
        print(f"[lead_sniper] RUBT fetch skipped: {e}")
        return []
    leads = []
    for row in rows[:limit]:
        address = (row.get("address") or row.get("street_address") or row.get("property_address") or "").strip()
        if not address:
            continue
        name = (row.get("business_name") or row.get("owner") or row.get("account_name") or "").strip()
        zip_ = (row.get("zip") or row.get("zip_code") or "").strip()
        leads.append({
            "Name": name or "Unknown",
            "Address": address,
            "Zone": zip_,
            "Lead_Type": "RUBT_Landlord",
            "Email": enrich_contact_info(name, name),
            "Status": "New",
        })
    return leads


def load_existing_addresses() -> set[str]:
    """Load addresses already in leads_crm.csv to avoid duplicates."""
    if not OUTPUT_CSV.exists():
        return set()
    addresses = set()
    with open(OUTPUT_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            addr = (row.get("Address") or "").strip()
            if addr:
                addresses.add(addr.lower())
    return addresses


def dedupe_leads(leads: list[dict], existing: set[str]) -> list[dict]:
    """Filter out leads already in CSV."""
    return [l for l in leads if (l.get("Address") or "").strip().lower() not in existing]


def append_leads(leads: list[dict]) -> None:
    """Append new leads to leads_crm.csv. Create file with headers if missing."""
    if not leads:
        return
    file_exists = OUTPUT_CSV.exists()
    with open(OUTPUT_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["Name", "Address", "Zone", "Lead_Type", "Email", "Status"])
        if not file_exists:
            writer.writeheader()
        writer.writerows(leads)


def main() -> None:
    """Run lead sniper: fetch, filter, dedupe, append to leads_crm.csv."""
    os.chdir(BASE_DIR)
    print("[lead_sniper] Starting DoggyBagg Lead Sniper")

    existing = load_existing_addresses()
    all_new = []

    # Priority 1: Tier 3 STRO in PB/Mission Beach
    try:
        p1 = fetch_stro_priority1()
        p1_new = dedupe_leads(p1, existing)
        for l in p1_new:
            existing.add((l.get("Address") or "").strip().lower())
        all_new.extend(p1_new)
        print(f"[lead_sniper] Priority 1 (STRO Tier3 PB/MB): {len(p1_new)} new of {len(p1)}")
    except Exception as e:
        print(f"[lead_sniper] Priority 1 failed: {e}")

    # Priority 2: TPA
    try:
        p2 = fetch_tpa_leads()
        p2_new = dedupe_leads(p2, existing)
        for l in p2_new:
            existing.add((l.get("Address") or "").strip().lower())
        all_new.extend(p2_new)
        print(f"[lead_sniper] Priority 2 (TPA): {len(p2_new)} new of {len(p2)}")
    except Exception as e:
        print(f"[lead_sniper] Priority 2 failed: {e}")

    # Priority 3: Completed ADU
    try:
        p3 = fetch_adu_completed()
        p3_new = dedupe_leads(p3, existing)
        for l in p3_new:
            existing.add((l.get("Address") or "").strip().lower())
        all_new.extend(p3_new)
        print(f"[lead_sniper] Priority 3 (ADU Completed): {len(p3_new)} new of {len(p3)}")
    except Exception as e:
        print(f"[lead_sniper] Priority 3 failed: {e}")

    # Bonus: RUBT landlords (sample)
    try:
        rubt = fetch_rubt_landlords(limit=200)
        rubt_new = dedupe_leads(rubt, existing)
        all_new.extend(rubt_new)
        print(f"[lead_sniper] RUBT landlords: {len(rubt_new)} new of {len(rubt)}")
    except Exception as e:
        print(f"[lead_sniper] RUBT failed: {e}")

    append_leads(all_new)
    print(f"[lead_sniper] Done. Appended {len(all_new)} new leads to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
