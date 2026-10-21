import { EventBrief, DetailedEventPlan, BudgetMetrics } from '../types/event';

export function formatEventPlanAsHtml(
  brief: EventBrief,
  plan: DetailedEventPlan,
  metrics: BudgetMetrics
): string {
  const confirmedCount = plan.guestList.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const pendingCount = plan.guestList.filter((g) => g.rsvpStatus === 'Pending').length;
  const declinedCount = plan.guestList.filter((g) => g.rsvpStatus === 'Declined').length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Celebration Dossier — ${brief.eventTitle}</title>
  <style>
    @page { margin: 20mm; size: A4; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1d1d1f; line-height: 1.5; margin: 0; padding: 24px; }
    .header { border-bottom: 2px solid #0071e3; padding-bottom: 16px; margin-bottom: 24px; }
    .badge { display: inline-block; background: #e8f2fe; color: #0071e3; font-weight: 600; font-size: 11px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; }
    h1 { font-size: 26px; font-weight: 700; margin: 8px 0 4px; color: #1d1d1f; }
    .tagline { color: #86868b; font-size: 14px; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
    .meta-card { background: #fbfbfd; border: 1px solid #d2d2d7; border-radius: 8px; padding: 12px; }
    .meta-label { font-size: 11px; text-transform: uppercase; color: #86868b; font-weight: 600; }
    .meta-value { font-size: 15px; font-weight: 600; color: #1d1d1f; margin-top: 4px; }
    h2 { font-size: 18px; border-bottom: 1px solid #d2d2d7; padding-bottom: 6px; margin-top: 28px; color: #1d1d1f; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { text-align: left; background: #f5f5f7; padding: 8px 10px; border-bottom: 1px solid #d2d2d7; font-weight: 600; color: #1d1d1f; }
    td { padding: 8px 10px; border-bottom: 1px solid #e5e5ea; }
    .status-confirmed { color: #34c759; font-weight: 600; }
    .status-pending { color: #ff9500; font-weight: 600; }
    .status-declined { color: #ff3b30; font-weight: 600; }
    .footer { margin-top: 40px; border-top: 1px solid #d2d2d7; padding-top: 12px; font-size: 11px; color: #86868b; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">CelebrationPilot AI — Master Event Dossier</span>
    <h1>${brief.eventTitle}</h1>
    <p class="tagline">${plan.title} • ${plan.tagline}</p>
  </div>

  <div class="grid">
    <div class="meta-card">
      <div class="meta-label">Date & Destination</div>
      <div class="meta-value">${brief.targetDate} • ${brief.city}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Venue & Guest Count</div>
      <div class="meta-value">${brief.venueType} (${brief.guestCount} Guests)</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Budget Health</div>
      <div class="meta-value">${brief.currency} ${metrics.totalSpent.toLocaleString()} / ${brief.currency} ${metrics.totalBudget.toLocaleString()} (${metrics.verdict})</div>
    </div>
  </div>

  <h2>Run of Show / Master Schedule</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Time</th>
        <th style="width: 25%;">Activity</th>
        <th style="width: 45%;">Details</th>
        <th style="width: 15%;">Lead</th>
      </tr>
    </thead>
    <tbody>
      ${plan.schedule
        .map(
          (s) => `
        <tr>
          <td><strong>${s.time}</strong></td>
          <td>${s.title}</td>
          <td>${s.description}</td>
          <td>${s.lead}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Budget Breakdown & Allocation</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Allocated (${brief.currency})</th>
        <th>Spent / Committed (${brief.currency})</th>
        <th>Verification</th>
        <th>Operational Notes</th>
      </tr>
    </thead>
    <tbody>
      ${plan.budgetBreakdown
        .map(
          (b) => `
        <tr>
          <td><strong>${b.category}</strong></td>
          <td>${b.allocated.toLocaleString()}</td>
          <td>${b.spent.toLocaleString()}</td>
          <td>${b.isVerifiedQuote ? '<span style="color:#0071e3;font-weight:600;">✓ Verified Quote</span>' : '<span style="color:#86868b;">Estimated</span>'}</td>
          <td>${b.notes}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Milestone Task Checklist</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Phase</th>
        <th style="width: 45%;">Task Title</th>
        <th style="width: 15%;">Priority</th>
        <th style="width: 20%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${plan.tasks
        .map(
          (t) => `
        <tr>
          <td>${t.duePhase}</td>
          <td><strong>${t.title}</strong></td>
          <td>${t.priority}</td>
          <td>${t.status === 'Completed' ? '<span class="status-confirmed">Completed</span>' : t.status === 'In Progress' ? '<span class="status-pending">In Progress</span>' : 'To Do'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Guest & RSVP Registry Summary</h2>
  <div style="margin: 12px 0; font-size: 13px;">
    <strong>Confirmed:</strong> ${confirmedCount} &nbsp;|&nbsp; 
    <strong>Pending:</strong> ${pendingCount} &nbsp;|&nbsp; 
    <strong>Declined:</strong> ${declinedCount}
  </div>
  <table>
    <thead>
      <tr>
        <th>Guest Name</th>
        <th>Category</th>
        <th>RSVP Status</th>
        <th>Dietary Needs</th>
        <th>Plus One</th>
      </tr>
    </thead>
    <tbody>
      ${plan.guestList
        .map(
          (g) => `
        <tr>
          <td><strong>${g.name}</strong></td>
          <td>${g.category}</td>
          <td class="status-${g.rsvpStatus.toLowerCase()}">${g.rsvpStatus}</td>
          <td>${g.dietary}</td>
          <td>${g.plusOne ? 'Yes (+1)' : 'Solo'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Vendor Directory & Contracts</h2>
  <table>
    <thead>
      <tr>
        <th>Vendor / Partner</th>
        <th>Service</th>
        <th>Est. Cost</th>
        <th>Actual Cost</th>
        <th>Contract Status</th>
        <th>Contact</th>
      </tr>
    </thead>
    <tbody>
      ${plan.vendorDirectory
        .map(
          (v) => `
        <tr>
          <td><strong>${v.name}</strong></td>
          <td>${v.service}</td>
          <td>${brief.currency} ${v.estimatedCost.toLocaleString()}</td>
          <td>${v.actualCost !== null ? `${brief.currency} ${v.actualCost.toLocaleString()}` : 'Pending Quote'}</td>
          <td>${v.status}</td>
          <td>${v.contact}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <span>Generated by CelebrationPilot AI • Architectural Event Intelligence</span>
    <span>Export Timestamp: ${new Date().toISOString()}</span>
  </div>
</body>
</html>
  `;
}

export function exportEventPlanToPrint(
  brief: EventBrief,
  plan: DetailedEventPlan,
  metrics: BudgetMetrics
) {
  if (typeof window === 'undefined') return;
  const html = formatEventPlanAsHtml(brief, plan, metrics);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }
}

export function exportEventPlanAsJson(
  brief: EventBrief,
  plan: DetailedEventPlan,
  metrics: BudgetMetrics
) {
  if (typeof window === 'undefined') return;
  const exportPayload = {
    generator: 'CelebrationPilot AI',
    exportedAt: new Date().toISOString(),
    eventBrief: brief,
    selectedPlan: plan,
    budgetMetrics: metrics,
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${brief.eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dossier.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
