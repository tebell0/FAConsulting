<template>

  <AppCursor v-model="isHovering" :auto-hover="false" />
  <AppNav variant="admin" active-page="dash" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />


  <!-- Dashboard Content -->
  <div class="dash-layout">

    <!-- ── Upcoming Appointment Carousel ── -->
    <div class="upcoming-hero" v-if="upcomingAppointments.length">
      <button class="upcoming-arrow" @click="changeAppt(-1)" aria-label="Previous appointment"
        @mouseenter="isHovering=true" @mouseleave="isHovering=false">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>

      <div class="upcoming-card-clip">
        <div class="upcoming-card fade-up visible" ref="carouselCard">
          <div class="upcoming-card-header">
            <div class="upcoming-eyebrow">Nearest Upcoming Appointment</div>
            <span class="upcoming-badge">{{ currentAppt.badge }}</span>
          </div>
          <div class="upcoming-divider"></div>
          <div class="upcoming-grid">
            <div class="upcoming-field">
              <div class="upcoming-label">Client Name</div>
              <div class="upcoming-value">{{ currentAppt.name }}</div>
            </div>
            <div class="upcoming-field">
              <div class="upcoming-label">Date</div>
              <div class="upcoming-value">{{ fmtDate(currentAppt.isoDate) }}</div>
            </div>
            <div class="upcoming-field">
              <div class="upcoming-label">Time</div>
              <div class="upcoming-value">{{ currentAppt.time }}</div>
            </div>
            <div class="upcoming-field">
              <div class="upcoming-label">Session Type</div>
              <div class="upcoming-value">{{ currentAppt.package }} · {{ pkgDuration(currentAppt.package) }}</div>
            </div>
            <div class="upcoming-field upcoming-field--full">
              <div class="upcoming-label">Location</div>
              <div class="upcoming-value">{{ currentAppt.location }}</div>
            </div>
          </div>
          <div class="upcoming-actions">
            <button class="btn-next" @click="openApptDetail" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              View Details
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </button>
            <button class="btn-back" @click="openReachOut" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Reach Out</button>
            <span class="appt-counter">{{ apptIndex + 1 }} / {{ upcomingAppointments.length }}</span>
          </div>
        </div>
      </div>

      <button class="upcoming-arrow" @click="changeAppt(1)" aria-label="Next appointment"
        @mouseenter="isHovering=true" @mouseleave="isHovering=false">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1l6 6-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
    </div>

    <!-- ── Dashboard Blocks Row ── -->
    <div class="dash-blocks">

      <!-- Appointments Block -->
      <div class="dash-block fade-up visible">
        <div class="dash-block-header">
          <div class="section-label">Manage</div>
          <h2 class="dash-block-title">Appointments</h2>
        </div>
        <!-- Mini Calendar -->
        <div class="dash-cal">
          <div class="dash-cal-header">
            <button class="dash-cal-nav" @click="dashChangeMonth(-1)" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <span class="dash-cal-month">{{ dashCalMonthLabel }}</span>
            <button class="dash-cal-nav" @click="dashChangeMonth(1)" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M5 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="dash-cal-grid">
            <div v-for="d in DAYS" :key="'dn-'+d" class="dash-cal-day-name">{{ d }}</div>
            <div v-for="_ in dashCalFirstDay" :key="'empty-'+_" class="dash-cal-cell"></div>
            <div
              v-for="day in dashCalDays"
              :key="'day-'+day.d"
              class="dash-cal-cell"
              :class="{ 'dash-cal-today': day.isToday }"
            >
              <span>{{ day.d }}</span>
              <div v-if="day.hasAppt"    class="dash-cal-dot"></div>
              <div v-if="day.isBlocked"  class="dash-cal-dot" style="background:rgba(180,0,0,0.6)"></div>
            </div>
          </div>
        </div>
        <p class="dash-block-sub">{{ upcomingThisMonthLabel }}</p>
        <button class="avail-btn" @click="openAvail" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M1 5h12M5 2V1M9 2V1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M4 8h2M8 8h2M4 10.5h2M8 10.5h2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
          Set Availability
        </button>
      </div>

      <!-- Payments Block -->
      <div class="dash-block fade-up visible">
        <div class="dash-block-header">
          <div class="section-label">Financials</div>
          <h2 class="dash-block-title">Payments</h2>
        </div>
        <div class="dash-stat-row">
          <div class="dash-stat">
            <div class="dash-stat-num">${{ paymentStats.monthTotal.toLocaleString() }}</div>
            <div class="dash-stat-label">This Month</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-num">{{ paymentStats.invoices }}</div>
            <div class="dash-stat-label">Invoices</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-num">${{ paymentStats.pendingAmt.toLocaleString() }}</div>
            <div class="dash-stat-label">Outstanding</div>
          </div>
        </div>
        <p class="dash-empty" style="margin-top:1.5rem;">No payment records found.</p>
      </div>

      <!-- Messages Block -->
      <div class="dash-block fade-up visible">
        <div class="dash-block-header">
          <div class="section-label">Inbox</div>
          <h2 class="dash-block-title">Messages</h2>
        </div>
        <ul class="msg-list">
          <li
            v-for="(m, i) in messages"
            :key="m.id"
            class="msg-row"
            :class="{ 'msg-row--unread': !readSet.has(m.id) }"
            @click="openMsg(i)"
            @mouseenter="isHovering=true"
            @mouseleave="isHovering=false"
          >
            <div class="msg-avatar">{{ m.initials }}</div>
            <div class="msg-body">
              <div class="msg-top">
                <span class="msg-name">{{ m.name }}</span>
                <span class="msg-tag" :class="m.tagClass">{{ m.tag }}</span>
              </div>
              <p class="msg-preview">{{ m.body.length > 80 ? m.body.slice(0, 80) + '…' : m.body }}</p>
            </div>
            <span v-if="!readSet.has(m.id)" class="msg-unread"></span>
          </li>
        </ul>
        <p class="dash-block-sub">{{ unreadLabel }}</p>
      </div>

    </div>

    <!-- Shared pie chart tooltip -->
    <div class="pie-tooltip" ref="pieTooltipEl" :class="{ visible: pieTooltipVisible }" v-html="pieTooltipHtml"></div>

    <!-- ── Analytics Row ── -->
    <div class="analytics-row fade-up visible">

      <div class="analytics-card">
        <div class="analytics-header">
          <div class="section-label">Breakdown</div>
          <h2 class="dash-block-title">Session Types</h2>
        </div>
        <div class="chart-wrap">
          <canvas ref="canvasTypes" width="160" height="160"></canvas>
          <div class="chart-center-label">
            <span class="chart-center-num">{{ typesTotal }}</span>
            <span class="chart-center-sub">sessions</span>
          </div>
        </div>
        <ul class="chart-legend">
          <li v-for="s in typesSlices" :key="s.label">
            <span class="legend-dot" :style="{ background: s.color }"></span>
            <span class="legend-label">{{ s.label }}</span>
            <span class="legend-val">{{ Math.round((s.value / typesTotal) * 100) }}%</span>
          </li>
        </ul>
      </div>

      <div class="analytics-card">
        <div class="analytics-header">
          <div class="section-label">Financials</div>
          <h2 class="dash-block-title">Payment Status</h2>
        </div>
        <div class="chart-wrap">
          <canvas ref="canvasPayments" width="160" height="160"></canvas>
          <div class="chart-center-label">
            <span class="chart-center-num">${{ paymentStats.collected.toLocaleString() }}</span>
            <span class="chart-center-sub">collected</span>
          </div>
        </div>
        <ul class="chart-legend">
          <li v-for="s in paymentSlices" :key="s.label">
            <span class="legend-dot" :style="{ background: s.color }"></span>
            <span class="legend-label">{{ s.label }}</span>
            <span class="legend-val">{{ Math.round((s.value / paymentSlicesTotal) * 100) }}%</span>
          </li>
        </ul>
      </div>

      <div class="analytics-card">
        <div class="analytics-header">
          <div class="section-label">Inbox</div>
          <h2 class="dash-block-title">Inquiry Types</h2>
        </div>
        <div class="chart-wrap">
          <canvas ref="canvasInquiries" width="160" height="160"></canvas>
          <div class="chart-center-label">
            <span class="chart-center-num">{{ messages.length }}</span>
            <span class="chart-center-sub">inquiries</span>
          </div>
        </div>
        <ul class="chart-legend">
          <li v-for="s in inquirySlices" :key="s.label">
            <span class="legend-dot" :style="{ background: s.color }"></span>
            <span class="legend-label">{{ s.label }}</span>
            <span class="legend-val">{{ Math.round((s.value / messages.length) * 100) }}%</span>
          </li>
        </ul>
      </div>

    </div>

    <!-- ── Deliver Package CTA ── -->
    <div class="deliver-cta fade-up visible">
      <div class="deliver-cta-inner">
        <div class="deliver-cta-text">
          <div class="section-label">Final Step</div>
          <h2 class="deliver-cta-title">Ready to deliver?</h2>
          <p class="deliver-cta-sub">Upload edited photos &amp; videos, generate a secure client link, and send the finished package — all in one place.</p>
        </div>
        <RouterLink to="/deliverables" class="deliver-cta-btn" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
          Build &amp; Send Package
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </RouterLink>
      </div>
    </div>

    <!-- ── Appointment History ── -->
    <div class="appt-history fade-up visible">
      <div class="appt-history-header">
        <div>
          <div class="section-label">Archive</div>
          <h2 class="dash-block-title" style="font-size:1.6rem;">Appointment History</h2>
          <p class="appt-history-sub">Past sessions &amp; clients with a delivered package link.</p>
        </div>
        <div class="appt-history-filters">
          <button
            v-for="f in historyFilters"
            :key="f.value"
            class="appt-filter-btn"
            :class="{ active: activeHistoryFilter === f.value }"
            @click="activeHistoryFilter = f.value"
            @mouseenter="isHovering=true"
            @mouseleave="isHovering=false"
          >{{ f.label }}</button>
        </div>
      </div>

      <div class="appt-history-table-wrap" v-if="filteredHistory.length">
        <table class="appt-history-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Package</th>
              <th>Date &amp; Time</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(r, idx) in filteredHistory" :key="r.id">
              <tr
                class="appt-history-row"
                :class="{ 'appt-expandable': hasDetails(r), 'appt-row-open': expandedRows.has(idx) }"
                :data-status="r.status"
                @click="hasDetails(r) && toggleExpand(idx)"
                @mouseenter="isHovering=true"
                @mouseleave="isHovering=false"
              >
                <td>
                  <div class="appt-client-cell">
                    <div class="appt-avatar">{{ r.initials }}</div>
                    <div>
                      <span class="appt-client-name">{{ r.name }}</span>
                      <div v-if="hasDetails(r)" class="appt-expand-hint">tap for details</div>
                    </div>
                  </div>
                </td>
                <td><span class="appt-pkg-badge">{{ r.package }}</span></td>
                <td>
                  <div class="appt-date-cell">
                    <span class="appt-date">{{ fmtDate(r.isoDate) }}</span>
                    <span class="appt-time">{{ r.time }}</span>
                  </div>
                </td>
                <td><span class="appt-location">{{ r.location }}</span></td>
                <td><span class="appt-status-badge" :class="STATUS_META[r.status]?.cls">{{ STATUS_META[r.status]?.label }}</span></td>
              </tr>
              <tr v-if="hasDetails(r) && expandedRows.has(idx)" class="appt-expand-row">
                <td colspan="5">
                  <div class="appt-expand-inner">
                    <div v-if="r.email" class="appt-detail-item">
                      <span class="appt-detail-key">Email</span>
                      <a :href="'mailto:' + r.email" class="appt-detail-val appt-detail-link">{{ r.email }}</a>
                    </div>
                    <div v-if="r.phone && r.phone !== '—'" class="appt-detail-item">
                      <span class="appt-detail-key">Phone</span>
                      <a :href="'tel:' + r.phone" class="appt-detail-val appt-detail-link">{{ r.phone }}</a>
                    </div>
                    <div v-if="r.sessionType" class="appt-detail-item">
                      <span class="appt-detail-key">Session Type</span>
                      <span class="appt-detail-val">{{ r.sessionType }}</span>
                    </div>
                    <div v-if="r.ref" class="appt-detail-item">
                      <span class="appt-detail-key">Ref #</span>
                      <span class="appt-detail-val">{{ r.ref }}</span>
                    </div>
                    <div v-if="r.notes && r.notes !== '—'" class="appt-detail-item appt-detail-notes">
                      <span class="appt-detail-key">Notes</span>
                      <span class="appt-detail-val">{{ r.notes }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="appt-history-empty" v-else>
        No records match this filter.
      </div>
    </div>

  </div><!-- /.dash-layout -->

  <!-- ══════════════════════════════════════════
       Availability Manager Modal
  ══════════════════════════════════════════ -->
  <Teleport to="body">
    <div
      class="avail-backdrop"
      :class="{ open: availOpen }"
      @click.self="closeAvail"
    >
      <div class="avail-modal" role="dialog" aria-modal="true">
        <button class="avail-modal-close" @click="closeAvail" aria-label="Close"
          @mouseenter="isHovering=true" @mouseleave="isHovering=false">&times;</button>

        <h2 class="avail-modal-title">Availability Manager</h2>
        <p class="avail-modal-sub">Select dates to block entirely or disable individual time slots. Changes are reflected immediately on the booking page.</p>

        <div class="avail-cal-header">
          <button class="avail-cal-nav" @click="availChangeMonth(-1)" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <span class="avail-cal-month-label">{{ availCalLabel }}</span>
          <button class="avail-cal-nav" @click="availChangeMonth(1)" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M5 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- Avail mini calendar -->
        <div class="avail-cal-grid">
          <div v-for="d in DAYS" :key="'avd-'+d" class="avail-cal-dname">{{ d }}</div>
          <div v-for="_ in availCalFirstDay" :key="'ae-'+_" class="avail-cal-cell empty"></div>
          <div
            v-for="day in availCalDays"
            :key="'ac-'+day.iso"
            class="avail-cal-cell"
            :class="{
              past:          day.isPast,
              today:         day.isToday,
              'blocked-full': day.isBlockedFull,
              'has-slots':   day.hasSlots,
              'selected-avail': availSelectedIso === day.iso
            }"
            @click="!day.isPast && availSelectDate(day.iso, day.d)"
            @mouseenter="isHovering=true"
            @mouseleave="isHovering=false"
          >
            {{ day.d }}
            <div v-if="day.isBlockedFull || day.hasSlots" class="avail-cal-badge"></div>
          </div>
        </div>

        <div class="avail-legend-row">
          <div class="avail-legend-item"><div class="avail-legend-dot" style="background:rgba(180,0,0,0.6)"></div>Fully blocked</div>
          <div class="avail-legend-item"><div class="avail-legend-dot" style="background:var(--warm)"></div>Partial slots blocked</div>
          <div class="avail-legend-item"><div class="avail-legend-dot" style="background:rgba(245,240,235,0.2)"></div>Available</div>
        </div>

        <div class="avail-divider"></div>

        <!-- Per-date config panel -->
        <div class="avail-date-panel" :class="{ visible: availSelectedIso !== null }">
          <div class="avail-date-label">Configure — {{ availDateLabel }}</div>

          <div class="avail-block-row">
            <label @mouseenter="isHovering=true" @mouseleave="isHovering=false">
              <input type="checkbox" class="avail-toggle" v-model="availBlockFull" />
              Block entire day (clients cannot book this date)
            </label>
          </div>

          <div class="avail-slots-section" :style="{ opacity: availBlockFull ? '0.35' : '1', pointerEvents: availBlockFull ? 'none' : '' }">
            <div class="avail-slots-label">Or block individual time slots — click to toggle:</div>
            <div class="avail-slots-grid">
              <button
                v-for="slot in AVAIL_SLOTS"
                :key="slot"
                class="avail-slot-chip"
                :class="{ 'blocked-slot': blockedSlotsForSelected.includes(slot), 'clicked': clickedAvailSlots.includes(slot) }"
                type="button"
                @click="toggleSlot(slot)"
                @mouseenter="isHovering=true"
                @mouseleave="isHovering=false"
              >{{ slot }}</button>
            </div>
            <p class="avail-hint">Blocked slots appear greyed-out and unselectable on the booking page. Toggling "Block entire day" overrides individual slots.</p>
          </div>

          <div class="avail-actions">
            <button class="avail-save-btn" @click="saveAvailability" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Save Changes</button>
            <button class="avail-clear-btn" @click="clearDateConfig" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Clear This Date</button>
            <span class="avail-saved-msg" :class="{ show: availSavedVisible }">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              Saved
            </span>
          </div>
        </div>

        <div v-if="availSelectedIso === null" style="font-size:0.78rem;color:rgba(245,240,235,0.3);text-align:center;padding:1.2rem 0;">
          ← Select a date above to configure its availability
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══════════════════════════════════════════
       Message Modal
  ══════════════════════════════════════════ -->
  <Teleport to="body">
    <div
      class="msg-modal-backdrop"
      :class="{ open: msgModalOpen }"
      @click.self="closeMsgModal"
    >
      <div class="msg-modal" role="dialog" aria-modal="true">
        <button class="msg-modal-close" @click="closeMsgModal" aria-label="Close"
          @mouseenter="isHovering=true" @mouseleave="isHovering=false">&times;</button>
        <div class="msg-modal-header">
          <div class="msg-modal-avatar">{{ activeMsg?.initials }}</div>
          <div>
            <div class="msg-modal-name">{{ activeMsg?.name }}</div>
            <div class="msg-modal-meta" v-html="activeMsg?.meta"></div>
          </div>
          <span class="msg-modal-tag" :class="activeMsg?.tagClass">{{ activeMsg?.tag }}</span>
        </div>
        <div class="msg-modal-divider"></div>
        <p class="msg-modal-body">{{ activeMsg?.body }}</p>
        <div class="msg-modal-actions">
          <button class="btn-next" @click="emailClient" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
            Email Client
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-back" @click="callClient" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Call / Text</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══════════════════════════════════════════
       Appointment Detail Modal
  ══════════════════════════════════════════ -->
  <Teleport to="body">
    <div
      class="appt-detail-backdrop"
      :class="{ open: apptDetailOpen }"
      @click.self="closeApptDetail"
    >
      <div class="appt-detail-modal" role="dialog" aria-modal="true">
        <button class="avail-modal-close" @click="closeApptDetail" aria-label="Close"
          @mouseenter="isHovering=true" @mouseleave="isHovering=false">&times;</button>

        <div class="appt-detail-eyebrow">Appointment Details</div>
        <h2 class="appt-detail-title">{{ apptDetailData?.name }}</h2>
        <div class="appt-detail-badge-row">
          <span class="upcoming-badge">{{ apptDetailData?.badge }}</span>
          <span class="appt-detail-ref" v-if="apptDetailData?.ref">{{ apptDetailData.ref }}</span>
        </div>

        <div class="appt-detail-divider"></div>

        <div class="appt-detail-grid">
          <div class="appt-detail-field">
            <div class="appt-detail-label">Package</div>
            <div class="appt-detail-val">{{ apptDetailData?.package }}</div>
          </div>
          <div class="appt-detail-field">
            <div class="appt-detail-label">Duration</div>
            <div class="appt-detail-val">{{ pkgDuration(apptDetailData?.package) }}</div>
          </div>
          <div class="appt-detail-field">
            <div class="appt-detail-label">Date</div>
            <div class="appt-detail-val">{{ apptDetailData?.isoDate ? fmtDate(apptDetailData.isoDate) : '—' }}</div>
          </div>
          <div class="appt-detail-field">
            <div class="appt-detail-label">Time</div>
            <div class="appt-detail-val">{{ apptDetailData?.time || '—' }}</div>
          </div>
          <div class="appt-detail-field appt-detail-field--full">
            <div class="appt-detail-label">Location</div>
            <div class="appt-detail-val">{{ apptDetailData?.location || '—' }}</div>
          </div>
          <div class="appt-detail-field" v-if="apptDetailData?.sessionType">
            <div class="appt-detail-label">Session Type</div>
            <div class="appt-detail-val">{{ apptDetailData.sessionType }}</div>
          </div>
          <div class="appt-detail-field" v-if="apptDetailData?.email">
            <div class="appt-detail-label">Email</div>
            <div class="appt-detail-val">
              <a :href="'mailto:' + apptDetailData.email" class="appt-detail-link" @mouseenter="isHovering=true" @mouseleave="isHovering=false">{{ apptDetailData.email }}</a>
            </div>
          </div>
          <div class="appt-detail-field" v-if="apptDetailData?.phone && apptDetailData.phone !== '—'">
            <div class="appt-detail-label">Phone</div>
            <div class="appt-detail-val">
              <a :href="'tel:' + apptDetailData.phone.replace(/\D/g,'')" class="appt-detail-link" @mouseenter="isHovering=true" @mouseleave="isHovering=false">{{ apptDetailData.phone }}</a>
            </div>
          </div>
          <div class="appt-detail-field appt-detail-field--full" v-if="apptDetailData?.notes && apptDetailData.notes !== '—'">
            <div class="appt-detail-label">Special Notes</div>
            <div class="appt-detail-val appt-detail-notes">{{ apptDetailData.notes }}</div>
          </div>
          <div class="appt-detail-field appt-detail-field--full" v-else>
            <div class="appt-detail-label">Special Notes</div>
            <div class="appt-detail-val" style="color:rgba(245,240,235,0.25);font-style:italic;">No special notes provided.</div>
          </div>
        </div>

        <div class="appt-detail-actions">
          <button class="btn-next" @click="() => { closeApptDetail(); openReachOut() }" @mouseenter="isHovering=true" @mouseleave="isHovering=false">
            Reach Out
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-back" @click="closeApptDetail" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Close</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ══════════════════════════════════════════
       Reach Out Modal
  ══════════════════════════════════════════ -->
  <Teleport to="body">
    <div
      class="appt-detail-backdrop"
      :class="{ open: reachOutOpen }"
      @click.self="closeReachOut"
    >
      <div class="appt-detail-modal reach-out-modal" role="dialog" aria-modal="true">
        <button class="avail-modal-close" @click="closeReachOut" aria-label="Close"
          @mouseenter="isHovering=true" @mouseleave="isHovering=false">&times;</button>

        <div class="appt-detail-eyebrow">Client Communication</div>
        <h2 class="appt-detail-title">Reach Out</h2>
        <p class="reach-out-sub">Get in touch with <strong>{{ reachOutData?.name }}</strong> regarding their upcoming session on {{ reachOutData?.isoDate ? fmtDate(reachOutData.isoDate) : '—' }}.</p>

        <div class="appt-detail-divider"></div>

        <div class="reach-out-options">
          <button
            class="reach-out-card"
            :class="{ disabled: !reachOutData?.email }"
            @click="reachOutEmail"
            @mouseenter="isHovering=true"
            @mouseleave="isHovering=false"
          >
            <div class="reach-out-card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 6.5l8 5.5 8-5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
            <div class="reach-out-card-label">Send Email</div>
            <div class="reach-out-card-val">{{ reachOutData?.email || 'No email on file' }}</div>
          </button>
          <button
            class="reach-out-card"
            :class="{ disabled: !reachOutData?.phone || reachOutData?.phone === '—' }"
            @click="reachOutPhone"
            @mouseenter="isHovering=true"
            @mouseleave="isHovering=false"
          >
            <div class="reach-out-card-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3h3.5l1.5 4-2 1.2c.9 1.8 2.3 3.2 4 4l1.2-2 4 1.5v3.5c0 .8-.7 1.5-1.5 1.5C7.8 16.7 3.3 12.2 3 6c0-.8.7-1.5 1.5-1.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
            </div>
            <div class="reach-out-card-label">Call / Text</div>
            <div class="reach-out-card-val">{{ (reachOutData?.phone && reachOutData.phone !== '—') ? reachOutData.phone : 'No phone on file' }}</div>
          </button>
        </div>

        <div class="appt-detail-actions" style="margin-top:2rem;">
          <button class="btn-back" @click="closeReachOut" @mouseenter="isHovering=true" @mouseleave="isHovering=false">Close</button>
        </div>
      </div>
    </div>
  </Teleport>

  <AppFooter variant="admin" @hover-enter="isHovering=true" @hover-leave="isHovering=false" />

</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppCursor from '../components/AppCursor.vue'
import AppNav    from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { useFonts } from '../composables/useFonts.js'
useFonts()

// ── Cursor state ──────────────────────────────────────────
const isHovering = ref(false)
const router = useRouter()

// ── Constants ─────────────────────────────────────────────
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const AVAIL_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
const PKG_COLORS  = { 'The Signature':'#c8a97e', 'The Elite':'#7ec8c8', 'The Essentials':'#b89ec8', 'The Wedding':'#7ec89e' }
const PKG_DURATION = { 'The Essentials':'30 min', 'The Signature':'1 hr', 'The Elite':'2 hr', 'The Wedding':'5 hr' }
const PRICES = { 'The Essentials': 295, 'The Signature': 345, 'The Elite': 427, 'The Wedding': 1500 }
const STATUS_META = {
  upcoming:  { label: 'Pending',   cls: 'status--pending'   },
  completed: { label: 'Completed', cls: 'status--completed' },
  delivered: { label: 'Delivered', cls: 'status--delivered' },
  cancelled: { label: 'Cancelled', cls: 'status--cancelled' },
}

// ── Seed data ─────────────────────────────────────────────
const SEED_APPOINTMENTS = [
  { id:'jxc-001', name:'Aaliya Montgomery', initials:'AM', package:'The Signature',  isoDate:'2026-04-10', time:'2:00 PM',  location:'Hermann Park, Houston, TX',       badge:'Confirmed', status:'upcoming'  },
  { id:'jxc-002', name:'Marcus Thompson',   initials:'MT', package:'The Elite',      isoDate:'2026-04-17', time:'11:00 AM', location:'Downtown Houston, TX',             badge:'Confirmed', status:'upcoming'  },
  { id:'jxc-003', name:'Brianna Sanders',   initials:'BS', package:'The Essentials', isoDate:'2026-04-24', time:'4:30 PM',  location:'Memorial Park, Houston, TX',       badge:'Pending',   status:'upcoming'  },
  { id:'jxc-h01', name:'Monique Ellis',     initials:'ME', package:'The Elite',      isoDate:'2026-03-28', time:'1:00 PM',  location:'Hermann Park, Houston, TX',        badge:'Confirmed', status:'completed', link:null  },
  { id:'jxc-h02', name:'Darius Webb',       initials:'DW', package:'The Signature',  isoDate:'2026-03-21', time:'11:00 AM', location:'Downtown Houston, TX',             badge:'Confirmed', status:'delivered', link:'https://jayxcreatez.com/gallery/darius-webb-2026'    },
  { id:'jxc-h03', name:'Simone Carter',     initials:'SC', package:'The Essentials', isoDate:'2026-03-14', time:'3:00 PM',  location:'Memorial Park, Houston, TX',       badge:'Confirmed', status:'delivered', link:'https://jayxcreatez.com/gallery/simone-carter-2026'  },
  { id:'jxc-h04', name:'Andre Nolan',       initials:'AN', package:'The Wedding',    isoDate:'2026-03-07', time:'10:00 AM', location:'The Corinthian, Houston, TX',      badge:'Confirmed', status:'delivered', link:'https://jayxcreatez.com/gallery/nolan-wedding-2026'  },
  { id:'jxc-h05', name:'Jasmine Forde',     initials:'JF', package:'The Signature',  isoDate:'2026-02-22', time:'2:00 PM',  location:'Studio · Houston, TX',             badge:'Cancelled', status:'cancelled', link:null  },
  { id:'jxc-h06', name:'Tyler Graves',      initials:'TG', package:'The Essentials', isoDate:'2026-02-14', time:'12:00 PM', location:'Outdoor — Client Choice',          badge:'Confirmed', status:'completed', link:null  },
  { id:'jxc-h07', name:'Keisha Morrow',     initials:'KM', package:'The Elite',      isoDate:'2026-01-30', time:'4:00 PM',  location:'Buffalo Bayou Park, Houston, TX',  badge:'Confirmed', status:'delivered', link:'https://jayxcreatez.com/gallery/keisha-morrow-2026'  },
]

const SEED_MESSAGES = [
  { id:'msg-0', initials:'ND', name:'Nia Davis',      tag:'Reschedule',     tagClass:'msg-tag--reschedule', meta:'Reschedule &nbsp;·&nbsp; April 8, 2026 &nbsp;·&nbsp; 9:14 AM',  body:"Hey Jalen! Something came up on our end and we may need to push the shoot back by about a week. We were originally booked for April 10th at 2:00 PM at Hermann Park. Would April 17th or 18th work for you? We're flexible on time. Sorry for the short notice — really appreciate your understanding!", email:'nia.davis@email.com',       phone:'8325550141' },
  { id:'msg-1', initials:'JR', name:'Jordan Reid',    tag:'Billing',        tagClass:'msg-tag--billing',    meta:'Billing &nbsp;·&nbsp; April 9, 2026 &nbsp;·&nbsp; 1:47 PM',      body:"Hi Jalen, I just wanted to follow up on the deposit I sent over last Thursday via Zelle. The amount was $150 for the Signature package. I haven't seen a confirmation come through yet and wanted to make sure it went to the right account. Please let me know if you need me to resend or try a different method. Thanks!", email:'jordan.reid@email.com',    phone:'7135550289' },
  { id:'msg-2', initials:'CM', name:'Camille Monroe', tag:'Additional Info', tagClass:'msg-tag--info',       meta:'Additional Info &nbsp;·&nbsp; April 9, 2026 &nbsp;·&nbsp; 4:05 PM', body:"Hey! Super excited for our session next week. Quick question — roughly how long does it take to receive the edited gallery after the shoot? I have a birthday post I'd love to use some of the photos for and I'm trying to plan around the timeline. Also, do you send a sneak peek before the full delivery? Thank you so much!", email:'camille.monroe@email.com', phone:'2815550374' },
]

// ── localStorage helpers ──────────────────────────────────
function loadAppointments() {
  try { return JSON.parse(localStorage.getItem('appointments') || 'null') } catch { return null }
}
function saveAppointments(arr) { localStorage.setItem('appointments', JSON.stringify(arr)) }
function getBlockedDates() { try { return JSON.parse(localStorage.getItem('blockedDates') || '[]') } catch { return [] } }
function getBlockedTimes() { try { return JSON.parse(localStorage.getItem('blockedTimes') || '{}') } catch { return {} } }
function saveBlockedDates(arr) { localStorage.setItem('blockedDates', JSON.stringify(arr)) }
function saveBlockedTimes(obj) { localStorage.setItem('blockedTimes', JSON.stringify(obj)) }
function getPrice(pkg) {
  return parseInt(localStorage.getItem('price-' + pkg.replace('The ', '').toLowerCase())) || PRICES[pkg] || 0
}

function autoPromote(arr) {
  const today = new Date(); today.setHours(0,0,0,0)
  let changed = false
  arr.forEach(a => {
    if (a.status === 'upcoming' && new Date(a.isoDate) < today) { a.status = 'completed'; changed = true }
  })
  if (changed) saveAppointments(arr)
  return arr
}

// ── Boot appointment store ────────────────────────────────
let allAppointments = loadAppointments()
if (!allAppointments) {
  allAppointments = SEED_APPOINTMENTS.map(a => ({ ...a }))
  saveAppointments(allAppointments)
} else {
  const existingIds = new Set(allAppointments.map(a => a.id))
  SEED_APPOINTMENTS.forEach(s => { if (!existingIds.has(s.id)) allAppointments.push({ ...s }) })
  saveAppointments(allAppointments)
}
allAppointments = autoPromote(allAppointments)

// ── Derived views (non-reactive — stable after mount) ─────
const upcomingAppointments = allAppointments
  .filter(a => a.status === 'upcoming')
  .sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate))

const historyRecords = allAppointments.slice().sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))

// ── Helpers ───────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
}
function pkgDuration(pkg) { return PKG_DURATION[pkg] || '' }
function toIso(y, m, d) { return y + '-' + String(m + 1).padStart(2,'0') + '-' + String(d).padStart(2,'0') }

// ── Carousel ──────────────────────────────────────────────
const apptIndex   = ref(0)
const carouselCard = ref(null)
const currentAppt = computed(() => upcomingAppointments[apptIndex.value] || {})

function changeAppt(dir) {
  if (!upcomingAppointments.length) return
  const card = carouselCard.value
  if (card) {
    card.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
    card.style.opacity    = '0'
    card.style.transform  = dir > 0 ? 'translateX(-40px)' : 'translateX(40px)'
  }
  setTimeout(() => {
    apptIndex.value = (apptIndex.value + dir + upcomingAppointments.length) % upcomingAppointments.length
    if (card) {
      card.style.transition = 'none'
      card.style.transform  = dir > 0 ? 'translateX(40px)' : 'translateX(-40px)'
      void card.offsetWidth
      card.style.transition = 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)'
      card.style.opacity    = '1'
      card.style.transform  = 'translateX(0)'
    }
  }, 210)
}

// ── Dashboard Mini Calendar ───────────────────────────────
const today = new Date()
const dashYear  = ref(today.getFullYear())
const dashMonth = ref(today.getMonth())

const dashCalMonthLabel = computed(() => MONTH_NAMES[dashMonth.value] + ' ' + dashYear.value)
const dashCalFirstDay   = computed(() => new Array(new Date(dashYear.value, dashMonth.value, 1).getDay()).fill(0))
const dashCalDays = computed(() => {
  const daysInMonth  = new Date(dashYear.value, dashMonth.value + 1, 0).getDate()
  const apptDays     = allAppointments
    .filter(a => { if (a.status === 'cancelled') return false; const d = new Date(a.isoDate); return d.getFullYear() === dashYear.value && d.getMonth() === dashMonth.value })
    .map(a => new Date(a.isoDate).getDate())
  const blockedDays  = getBlockedDates()
    .filter(iso => { const d = new Date(iso + 'T00:00:00'); return d.getFullYear() === dashYear.value && d.getMonth() === dashMonth.value })
    .map(iso => new Date(iso + 'T00:00:00').getDate())
  const result = []
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({
      d,
      isToday:   today.getFullYear() === dashYear.value && today.getMonth() === dashMonth.value && today.getDate() === d,
      hasAppt:   apptDays.includes(d),
      isBlocked: blockedDays.includes(d),
    })
  }
  return result
})

const upcomingThisMonthLabel = computed(() => {
  const n = upcomingAppointments.filter(a => {
    const d = new Date(a.isoDate + 'T00:00:00')
    return d.getFullYear() === dashYear.value && d.getMonth() === dashMonth.value
  }).length
  return n === 1 ? '1 upcoming this month' : `${n} upcoming this month`
})

function dashChangeMonth(dir) {
  dashMonth.value += dir
  if (dashMonth.value > 11) { dashMonth.value = 0; dashYear.value++ }
  if (dashMonth.value < 0)  { dashMonth.value = 11; dashYear.value-- }
}

// ── Payment stats (computed) ──────────────────────────────
const paymentStats = computed(() => {
  const now = new Date()
  const monthTotal = allAppointments
    .filter(a => a.status !== 'cancelled' && a.status !== 'upcoming')
    .filter(a => { const d = new Date(a.isoDate + 'T00:00:00'); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() })
    .reduce((s, a) => s + getPrice(a.package), 0)
  const invoices   = allAppointments.filter(a => a.status !== 'cancelled').length
  const pendingAmt = allAppointments.filter(a => a.status === 'upcoming').reduce((s, a) => s + getPrice(a.package), 0)
  const collected  = allAppointments.filter(a => a.status === 'delivered' || a.status === 'completed').reduce((s, a) => s + getPrice(a.package), 0)
  return { monthTotal, invoices, pendingAmt, collected }
})

// ── Messages ──────────────────────────────────────────────
function loadAllMessages() {
  try {
    const submitted = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    const seedIds   = new Set(SEED_MESSAGES.map(m => m.id))
    return [...submitted.filter(m => !seedIds.has(m.id)), ...SEED_MESSAGES]
  } catch { return [...SEED_MESSAGES] }
}

const messages = ref(loadAllMessages())
const readSet  = ref(new Set((() => { try { return JSON.parse(localStorage.getItem('readMsgs') || '[]') } catch { return [] } })()))

function saveReadSet() { localStorage.setItem('readMsgs', JSON.stringify([...readSet.value])) }

const unreadLabel = computed(() => {
  const n = messages.value.filter(m => !readSet.value.has(m.id)).length
  return n === 0 ? 'All messages read' : n === 1 ? '1 unread message' : `${n} unread messages`
})

// ── Message Modal ─────────────────────────────────────────
const msgModalOpen = ref(false)
const activeMsg    = ref(null)

function openMsg(i) {
  activeMsg.value = messages.value[i]
  readSet.value   = new Set([...readSet.value, activeMsg.value.id])
  saveReadSet()
  msgModalOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeMsgModal() {
  msgModalOpen.value = false
  document.body.style.overflow = ''
}
function emailClient() { if (activeMsg.value) window.location.href = 'mailto:' + activeMsg.value.email }
function callClient()  { if (activeMsg.value) window.location.href = 'tel:'    + activeMsg.value.phone }

// ── Appointment History ───────────────────────────────────
const historyFilters = [
  { value:'all',       label:'All'       },
  { value:'upcoming',  label:'Pending'   },
  { value:'delivered', label:'Delivered' },
  { value:'completed', label:'Completed' },
  { value:'cancelled', label:'Cancelled' },
]
const activeHistoryFilter = ref('all')
const expandedRows = reactive(new Set())

const filteredHistory = computed(() =>
  activeHistoryFilter.value === 'all'
    ? historyRecords
    : historyRecords.filter(r => r.status === activeHistoryFilter.value)
)

function hasDetails(r) { return !!(r.email || r.phone || r.sessionType || r.notes) }
function toggleExpand(idx) {
  if (expandedRows.has(idx)) expandedRows.delete(idx)
  else expandedRows.add(idx)
}

// ── Pie Charts ────────────────────────────────────────────
const canvasTypes     = ref(null)
const canvasPayments  = ref(null)
const canvasInquiries = ref(null)
const pieTooltipEl      = ref(null)
const pieTooltipVisible = ref(false)
const pieTooltipHtml    = ref('')

const typesSlices = computed(() => {
  const counts = {}
  allAppointments.filter(a => a.status !== 'cancelled').forEach(a => { counts[a.package] = (counts[a.package] || 0) + 1 })
  return Object.entries(counts).map(([pkg, val]) => ({ label: pkg, value: val, color: PKG_COLORS[pkg] || '#c8a97e' }))
})
const typesTotal = computed(() => typesSlices.value.reduce((s, d) => s + d.value, 0) || 1)

const paymentSlices = computed(() => {
  const delivered = allAppointments.filter(a => a.status === 'delivered').length
  const upcoming  = allAppointments.filter(a => a.status === 'upcoming').length
  const completed = allAppointments.filter(a => a.status === 'completed').length
  const cancelled = allAppointments.filter(a => a.status === 'cancelled').length
  const slices = []
  if (delivered > 0) slices.push({ label:'Delivered', value:delivered, color:'#7ec8c8' })
  if (upcoming  > 0) slices.push({ label:'Upcoming',  value:upcoming,  color:'#c8a97e' })
  if (completed > 0) slices.push({ label:'Completed', value:completed, color:'#b89ec8' })
  if (cancelled > 0) slices.push({ label:'Cancelled', value:cancelled, color:'rgba(180,60,60,0.7)' })
  return slices.length ? slices : [{ label:'No data', value:1, color:'rgba(245,240,235,0.15)' }]
})
const paymentSlicesTotal = computed(() => paymentSlices.value.reduce((s, d) => s + d.value, 0) || 1)

const inquirySlices = computed(() => {
  const counts = {}
  const COLORS = { 'Reschedule':'#c8a97e', 'Billing':'#7ec8c8', 'Additional Info':'#b89ec8', 'Location Change':'#c8c87e', 'Delivery':'#7ec89e', 'Other':'rgba(245,240,235,0.45)' }
  messages.value.forEach(m => { counts[m.tag] = (counts[m.tag] || 0) + 1 })
  return Object.entries(counts).map(([tag, val]) => ({ label:tag, value:val, color: COLORS[tag] || '#c8a97e' }))
})

// Shared pie draw/redraw
function drawPie(canvas, slices, onHover) {
  if (!canvas) return
  const ctx    = canvas.getContext('2d')
  const cx = canvas.width / 2, cy = canvas.height / 2
  const outerR = 72, innerR = 46, gap = 0.03
  const total  = slices.reduce((s, d) => s + d.value, 0)

  function redraw(activeIdx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let angle = -Math.PI / 2
    slices.forEach((slice, i) => {
      const sweep = (slice.value / total) * Math.PI * 2 - gap
      const r     = i === activeIdx ? outerR + 8 : outerR
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, angle + gap / 2, angle + gap / 2 + sweep)
      ctx.arc(cx, cy, innerR, angle + gap / 2 + sweep, angle + gap / 2, true)
      ctx.closePath()
      ctx.fillStyle = i === activeIdx ? slice.color : slice.color + 'cc'
      ctx.fill()
      slice._start = angle + gap / 2
      slice._end   = angle + gap / 2 + sweep
      angle += sweep + gap
    })
  }

  redraw(-1)

  canvas.onmousemove = function(e) {
    const rect = canvas.getBoundingClientRect()
    const mx   = (e.clientX - rect.left) * (canvas.width  / rect.width)
    const my   = (e.clientY - rect.top)  * (canvas.height / rect.height)
    const dx   = mx - cx, dy = my - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < innerR || dist > outerR + 6) { redraw(-1); hidePieTooltip(); return }
    const a    = Math.atan2(dy, dx)
    const norm = a < -Math.PI / 2 ? a + Math.PI * 2 : a
    const hit  = slices.findIndex(s => {
      const start = s._start < -Math.PI / 2 ? s._start + Math.PI * 2 : s._start
      const end   = s._end   < -Math.PI / 2 ? s._end   + Math.PI * 2 : s._end
      return norm >= start && norm <= end
    })
    redraw(hit)
    if (hit !== -1) { showPieTooltip(e, onHover(slices[hit])) } else { hidePieTooltip() }
  }
  canvas.onmouseleave = () => { redraw(-1); hidePieTooltip() }
}

function showPieTooltip(e, html) {
  if (!html) return
  pieTooltipHtml.value    = html
  pieTooltipVisible.value = true
  movePieTooltip(e)
}
function movePieTooltip(e) {
  const el = pieTooltipEl.value; if (!el) return
  const tw = el.offsetWidth, th = el.offsetHeight
  let left = e.clientX + 14
  if (left + tw > window.innerWidth - 12) left = e.clientX - tw - 14
  el.style.left = left + 'px'
  el.style.top  = (e.clientY - th / 2) + 'px'
}
function hidePieTooltip() { pieTooltipVisible.value = false }

// Tooltip content builders
function typesHoverHtml(slice) {
  const todayM = new Date(); todayM.setHours(0,0,0,0)
  const next   = allAppointments
    .filter(a => a.package === slice.label && a.status === 'upcoming' && new Date(a.isoDate + 'T00:00:00') >= todayM)
    .sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate))[0]
  const count  = allAppointments.filter(a => a.package === slice.label && a.status !== 'cancelled').length
  return next
    ? `<div class="pie-tt-pkg" style="color:${slice.color}">${slice.label}</div>
       <div class="pie-tt-row"><span class="pie-tt-label">Next up</span><span class="pie-tt-val">${next.name}</span></div>
       <div class="pie-tt-row"><span class="pie-tt-label">Date</span><span class="pie-tt-val">${fmtDate(next.isoDate)}</span></div>
       <div class="pie-tt-row"><span class="pie-tt-label">Time</span><span class="pie-tt-val">${next.time}</span></div>
       <div class="pie-tt-divider"></div>
       <div class="pie-tt-row"><span class="pie-tt-label">Total booked</span><span class="pie-tt-val">${count}</span></div>`
    : `<div class="pie-tt-pkg" style="color:${slice.color}">${slice.label}</div>
       <div class="pie-tt-row"><span class="pie-tt-label">No upcoming sessions</span></div>
       <div class="pie-tt-divider"></div>
       <div class="pie-tt-row"><span class="pie-tt-label">Total booked</span><span class="pie-tt-val">${count}</span></div>`
}

const STATUS_LABEL_MAP = { Delivered:['delivered'], Upcoming:['upcoming'], Completed:['completed'], Cancelled:['cancelled'] }
const MONEY_LABEL = { Delivered:'Received', Upcoming:'Outstanding', Completed:'Received', Cancelled:'Forfeited' }

function paymentsHoverHtml(slice) {
  const statuses = STATUS_LABEL_MAP[slice.label] || []
  const matching = allAppointments.filter(a => statuses.includes(a.status))
  const moneyTotal = matching.reduce((s, a) => s + getPrice(a.package), 0)
  const todayM = new Date(); todayM.setHours(0,0,0,0)
  const featured = slice.label === 'Upcoming'
    ? matching.filter(a => new Date(a.isoDate + 'T00:00:00') >= todayM).sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate))[0]
    : matching.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))[0]
  const featuredLabel = slice.label === 'Upcoming' ? 'Next up' : 'Most recent'
  return `<div class="pie-tt-pkg" style="color:${slice.color}">${slice.label}</div>
          <div class="pie-tt-row"><span class="pie-tt-label">Sessions</span><span class="pie-tt-val">${matching.length}</span></div>
          <div class="pie-tt-row"><span class="pie-tt-label">${MONEY_LABEL[slice.label]||'Total'}</span><span class="pie-tt-val">$${moneyTotal.toLocaleString()}</span></div>
          ${featured ? `<div class="pie-tt-divider"></div>
          <div class="pie-tt-row"><span class="pie-tt-label">${featuredLabel}</span><span class="pie-tt-val">${featured.name}</span></div>
          <div class="pie-tt-row"><span class="pie-tt-label">Date</span><span class="pie-tt-val">${fmtDate(featured.isoDate)}</span></div>` : ''}`
}

function inquiriesHoverHtml(slice) {
  const matching = messages.value.filter(m => m.tag === slice.label)
  return `<div class="pie-tt-pkg" style="color:${slice.color}">${slice.label}</div>
          <div class="pie-tt-row"><span class="pie-tt-label">Messages</span><span class="pie-tt-val">${matching.length}</span></div>
          ${matching.length ? `<div class="pie-tt-divider"></div>${matching.map(m => `<div class="pie-tt-row"><span class="pie-tt-label">From</span><span class="pie-tt-val">${m.name}</span></div>`).join('')}` : ''}`
}

// ── Availability Modal ────────────────────────────────────
const availOpen        = ref(false)
const availYear        = ref(today.getFullYear())
const availMonth       = ref(today.getMonth())
const availSelectedIso = ref(null)
const availBlockFull   = ref(false)
const availSavedVisible = ref(false)
const clickedAvailSlots = ref([])
let availSavedTimer = null

const availCalLabel = computed(() => MONTH_NAMES[availMonth.value] + ' ' + availYear.value)
const availCalFirstDay = computed(() => new Array(new Date(availYear.value, availMonth.value, 1).getDay()).fill(0))

const availCalDays = computed(() => {
  const daysInMonth = new Date(availYear.value, availMonth.value + 1, 0).getDate()
  const blockedDates = getBlockedDates()
  const blockedTimes = getBlockedTimes()
  const result = []
  for (let d = 1; d <= daysInMonth; d++) {
    const iso          = toIso(availYear.value, availMonth.value, d)
    const dateObj      = new Date(availYear.value, availMonth.value, d)
    const todayStart   = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const isBlockedFull = blockedDates.includes(iso)
    result.push({
      d, iso,
      isPast:       dateObj < todayStart,
      isToday:      dateObj.getTime() === todayStart.getTime(),
      isBlockedFull,
      hasSlots:     !isBlockedFull && !!(blockedTimes[iso]?.length),
    })
  }
  return result
})

const availDateLabel = computed(() => {
  if (!availSelectedIso.value) return ''
  const [y, m, d] = availSelectedIso.value.split('-')
  return MONTH_NAMES[parseInt(m) - 1] + ' ' + parseInt(d) + ', ' + y
})

const blockedSlotsForSelected = computed(() => {
  if (!availSelectedIso.value) return []
  const bt = getBlockedTimes()
  return bt[availSelectedIso.value] || []
})

function openAvail() {
  availSelectedIso.value = null
  availOpen.value        = true
  document.body.style.overflow = 'hidden'
}
function closeAvail() {
  availOpen.value = false
  document.body.style.overflow = ''
}

function availChangeMonth(dir) {
  availMonth.value += dir
  if (availMonth.value > 11) { availMonth.value = 0; availYear.value++ }
  if (availMonth.value < 0)  { availMonth.value = 11; availYear.value-- }
  availSelectedIso.value = null
}

function availSelectDate(iso) {
  availSelectedIso.value = iso
  const blockedDates    = getBlockedDates()
  availBlockFull.value  = blockedDates.includes(iso)
}

function toggleSlot(slot) {
  if (!availSelectedIso.value) return
  // pulse animation
  if (!clickedAvailSlots.value.includes(slot)) clickedAvailSlots.value.push(slot)
  setTimeout(() => { clickedAvailSlots.value = clickedAvailSlots.value.filter(s => s !== slot) }, 450)
  // toggle blocked state
  const bt  = getBlockedTimes()
  const arr = bt[availSelectedIso.value] || []
  const idx = arr.indexOf(slot)
  if (idx === -1) arr.push(slot); else arr.splice(idx, 1)
  if (arr.length === 0) delete bt[availSelectedIso.value]
  else bt[availSelectedIso.value] = arr
  saveBlockedTimes(bt)
}

function saveAvailability() {
  if (!availSelectedIso.value) return
  const bd = getBlockedDates()
  const bt = getBlockedTimes()
  if (availBlockFull.value) {
    if (!bd.includes(availSelectedIso.value)) bd.push(availSelectedIso.value)
    delete bt[availSelectedIso.value]
    saveBlockedTimes(bt)
  } else {
    const idx = bd.indexOf(availSelectedIso.value)
    if (idx !== -1) bd.splice(idx, 1)
  }
  saveBlockedDates(bd)
  showAvailSaved()
}

function clearDateConfig() {
  if (!availSelectedIso.value) return
  const bd = getBlockedDates()
  const bt = getBlockedTimes()
  const idx = bd.indexOf(availSelectedIso.value)
  if (idx !== -1) bd.splice(idx, 1)
  delete bt[availSelectedIso.value]
  saveBlockedDates(bd)
  saveBlockedTimes(bt)
  availBlockFull.value = false
  showAvailSaved()
}

function showAvailSaved() {
  availSavedVisible.value = true
  clearTimeout(availSavedTimer)
  availSavedTimer = setTimeout(() => { availSavedVisible.value = false }, 2400)
}

// ── Appointment Detail Modal ──────────────────────────────
const apptDetailOpen = ref(false)
const apptDetailData = ref(null)

function openApptDetail() {
  apptDetailData.value = { ...currentAppt.value }
  apptDetailOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeApptDetail() {
  apptDetailOpen.value = false
  document.body.style.overflow = ''
}

// ── Reach Out Modal ───────────────────────────────────────
const reachOutOpen = ref(false)
const reachOutData = ref(null)

function openReachOut() {
  reachOutData.value = { ...currentAppt.value }
  reachOutOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeReachOut() {
  reachOutOpen.value = false
  document.body.style.overflow = ''
}
function reachOutEmail() {
  if (reachOutData.value?.email) window.location.href = 'mailto:' + reachOutData.value.email
}
function reachOutPhone() {
  if (reachOutData.value?.phone) window.location.href = 'tel:' + reachOutData.value.phone.replace(/\D/g, '')
}

// ── Keyboard handler ──────────────────────────────────────
function onKeyDown(e) {
  if (e.key === 'Escape') { closeAvail(); closeMsgModal(); closeApptDetail(); closeReachOut() }
}

// ── Lifecycle ─────────────────────────────────────────────
onMounted(() => {
  // Auth guard (router also guards this route, but belt-and-suspenders)
  if (sessionStorage.getItem('adminAuth') !== '1') {
    router.push('/adminsignin')
    return
  }

  document.addEventListener('keydown', onKeyDown)

  // Draw charts after DOM is ready
  const ts = typesSlices.value
  drawPie(canvasTypes.value, ts.length ? ts : [{ label:'No data', value:1, color:'rgba(245,240,235,0.15)' }], typesHoverHtml)
  drawPie(canvasPayments.value, paymentSlices.value, paymentsHoverHtml)
  drawPie(canvasInquiries.value, inquirySlices.value.length ? inquirySlices.value : [{ label:'No data', value:1, color:'rgba(245,240,235,0.15)' }], inquiriesHoverHtml)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  clearTimeout(availSavedTimer)
})
</script>

<style>
:root {
  --black:        #0a0a0a;
  --deep:         #0d0c0a;
  --off-white:    #f5f0eb;
  --cream:        #f2ede6;
  --warm:         #c8a97e;
  --warm-light:   #dbbf94;
  --warm-dim:     rgba(200,169,126,0.18);
  --glass:        rgba(245,240,235,0.06);
  --glass-border: rgba(200,169,126,0.2);
  --success:      #7ec89e;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--black); color: var(--off-white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; cursor: none; }

/* ── Shared ── */
.section-label { font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.4rem; }
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }
.btn-next { display: inline-flex; align-items: center; gap: 0.6rem; background: var(--warm); color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; border: none; padding: 0.7rem 1.4rem; cursor: none; transition: background 0.3s, transform 0.2s; }
.btn-next:hover { background: var(--warm-light); transform: translateY(-1px); }
.btn-back { display: inline-flex; align-items: center; background: none; border: 1px solid var(--glass-border); color: rgba(245,240,235,0.6); font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.7rem 1.2rem; cursor: none; transition: border-color 0.3s, color 0.3s; }
.btn-back:hover { border-color: var(--warm); color: var(--warm); }
.dash-empty { font-size: 0.85rem; color: rgba(245,240,235,0.3); font-style: italic; }

/* ── Dashboard Layout ── */
.dash-layout { padding-top: 80px; }

/* ── Upcoming Card ── */
.upcoming-hero { display: flex; align-items: center; justify-content: center; gap: 2rem; padding: 4rem 4rem 0; }
.upcoming-card-clip { overflow: hidden; flex: 1; max-width: 620px; display: flex; align-items: stretch; }
.upcoming-arrow { flex-shrink: 0; width: 44px; height: 44px; border: 1px solid var(--glass-border); background: none; color: rgba(245,240,235,0.45); display: flex; align-items: center; justify-content: center; cursor: none; border-radius: 50%; transition: border-color 0.3s, color 0.3s, background 0.3s; }
.upcoming-arrow:hover { border-color: var(--warm); color: var(--warm); background: rgba(200,169,126,0.06); }
.upcoming-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 2.5rem 3rem; width: 100%; box-shadow: 0 8px 48px rgba(0,0,0,0.4); position: relative; transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1); will-change: transform, opacity; }
.upcoming-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--warm), transparent); }
.upcoming-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
.upcoming-eyebrow { font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--warm); display: flex; align-items: center; gap: 0.8rem; }
.upcoming-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--warm); }
.upcoming-badge { font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--success); border: 1px solid var(--success); padding: 0.25rem 0.7rem; }
.upcoming-divider { height: 1px; background: var(--glass-border); margin-bottom: 1.8rem; }
.upcoming-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem 2rem; margin-bottom: 2rem; }
.upcoming-field--full { grid-column: span 2; }
.upcoming-label { font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,240,235,0.35); margin-bottom: 0.35rem; }
.upcoming-value { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 300; color: var(--off-white); }
.upcoming-actions { display: flex; align-items: center; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); }
.appt-counter { margin-left: auto; font-size: 0.65rem; letter-spacing: 0.2em; color: rgba(245,240,235,0.3); }

/* ── Dash Blocks ── */
.dash-blocks { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 2rem; padding: 3rem 4rem 5rem; }
.dash-block { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 2px; padding: 2rem 2rem 1.8rem; box-shadow: 0 4px 40px rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.06) inset; position: relative; }
.dash-block::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--warm), transparent); }
.dash-block-header { margin-bottom: 1.5rem; }
.dash-block-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 300; line-height: 1.2; margin-top: 0.3rem; }
.dash-block-sub { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,235,0.3); margin-top: 1rem; }

/* Payments stats */
.dash-stat-row { display: flex; gap: 1.2rem; padding: 1.2rem 0; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); }
.dash-stat { flex: 1; text-align: center; }
.dash-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 300; color: var(--warm); line-height: 1; }
.dash-stat-label { font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,240,235,0.35); margin-top: 0.3rem; }

/* Mini Calendar */
.dash-cal { margin-bottom: 0.5rem; }
.dash-cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.dash-cal-month { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 300; color: var(--off-white); }
.dash-cal-nav { width: 26px; height: 26px; border: 1px solid var(--glass-border); background: none; color: rgba(245,240,235,0.5); display: flex; align-items: center; justify-content: center; cursor: none; border-radius: 50%; transition: border-color 0.3s, color 0.3s; }
.dash-cal-nav:hover { border-color: var(--warm); color: var(--warm); }
.dash-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
.dash-cal-day-name { text-align: center; font-size: 0.52rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,235,0.25); padding: 0.3rem 0; }
.dash-cal-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.3rem 0; font-size: 0.72rem; color: rgba(245,240,235,0.55); min-height: 28px; position: relative; }
.dash-cal-today span { color: var(--warm); font-weight: 500; }
.dash-cal-dot { width: 4px; height: 4px; background: var(--warm); border-radius: 50%; margin-top: 2px; }

/* Avail button */
.avail-btn { display: flex; align-items: center; gap: 0.55rem; margin-top: 1.2rem; padding: 0.6rem 1.2rem; background: none; border: 1px solid rgba(200,169,126,0.3); border-radius: 2px; color: var(--warm); font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: none; transition: background 0.2s, border-color 0.2s; width: 100%; justify-content: center; }
.avail-btn:hover { background: rgba(200,169,126,0.08); border-color: var(--warm); color: var(--warm-light); }

/* ── Messages List ── */
.msg-list { list-style: none; display: flex; flex-direction: column; gap: 0; }
.msg-row { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.9rem 0.3rem; border-bottom: 1px solid rgba(200,169,126,0.07); cursor: none; transition: background 0.2s; border-radius: 6px; position: relative; }
.msg-row:last-child { border-bottom: none; }
.msg-row:hover { background: rgba(200,169,126,0.04); }
.msg-avatar { flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: rgba(200,169,126,0.12); border: 1px solid rgba(200,169,126,0.25); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; letter-spacing: 0.06em; color: var(--warm); font-weight: 500; }
.msg-body { flex: 1; min-width: 0; }
.msg-top  { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem; }
.msg-name { font-size: 0.82rem; color: var(--cream); font-weight: 500; letter-spacing: 0.02em; }
.msg-preview { font-size: 0.75rem; color: rgba(245,240,235,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; line-height: 1.4; }
.msg-tag { font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.2rem 0.55rem; border-radius: 20px; border: 1px solid; white-space: nowrap; flex-shrink: 0; }
.msg-tag--reschedule { color: #c8a97e; border-color: rgba(200,169,126,0.35); background: rgba(200,169,126,0.07); }
.msg-tag--billing    { color: #7ec8c8; border-color: rgba(126,200,200,0.35); background: rgba(126,200,200,0.07); }
.msg-tag--info       { color: #b89ec8; border-color: rgba(184,158,200,0.35); background: rgba(184,158,200,0.07); }
.msg-tag--location   { color: #c8c87e; border-color: rgba(200,200,126,0.35); background: rgba(200,200,126,0.07); }
.msg-tag--delivery   { color: #7ec89e; border-color: rgba(126,200,158,0.35); background: rgba(126,200,158,0.07); }
.msg-tag--other      { color: rgba(245,240,235,0.45); border-color: rgba(245,240,235,0.15); background: transparent; }
.msg-row--unread .msg-name    { color: var(--off-white); }
.msg-row--unread .msg-preview { color: rgba(245,240,235,0.65); }
.msg-unread { position: absolute; top: 1.1rem; right: 0.5rem; width: 7px; height: 7px; border-radius: 50%; background: var(--warm); }

/* ── Analytics Row ── */
.analytics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; padding: 0 4rem 5rem; }
.analytics-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 2px; padding: 2rem 2rem 1.8rem; box-shadow: 0 4px 40px rgba(255,255,255,0.04), 0 1px 0 rgba(255,255,255,0.06) inset; position: relative; display: flex; flex-direction: column; align-items: center; }
.analytics-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--warm), transparent); }
.analytics-header { width: 100%; margin-bottom: 1.8rem; }
.chart-wrap { position: relative; width: 160px; height: 160px; flex-shrink: 0; margin-bottom: 1.6rem; }
.chart-wrap canvas { display: block; cursor: crosshair; }
.chart-center-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.chart-center-num { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 300; color: var(--off-white); line-height: 1; }
.chart-center-sub { font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,240,235,0.3); margin-top: 0.3rem; }
.chart-legend { list-style: none; margin: 0; padding: 0; width: 100%; display: flex; flex-direction: column; gap: 0.55rem; border-top: 1px solid var(--glass-border); padding-top: 1.2rem; }
.chart-legend li { display: flex; align-items: center; gap: 0.6rem; }
.legend-dot { flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; }
.legend-label { flex: 1; font-size: 0.75rem; color: rgba(245,240,235,0.55); letter-spacing: 0.02em; }
.legend-val { font-size: 0.72rem; color: var(--warm); letter-spacing: 0.06em; font-weight: 500; }

/* Pie tooltip */
.pie-tooltip { position: fixed; z-index: 9999; pointer-events: none; background: rgba(18,16,14,0.96); border: 1px solid rgba(200,169,126,0.2); border-radius: 3px; padding: 0.75rem 1rem; min-width: 190px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); opacity: 0; transform: translateY(4px); transition: opacity 0.15s, transform 0.15s; }
.pie-tooltip.visible { opacity: 1; transform: translateY(0); }
.pie-tt-pkg { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 600; letter-spacing: 0.03em; margin-bottom: 0.55rem; }
.pie-tt-row { display: flex; justify-content: space-between; align-items: baseline; gap: 0.75rem; margin-bottom: 0.25rem; }
.pie-tt-label { font-size: 0.65rem; letter-spacing: 0.07em; text-transform: uppercase; color: rgba(245,240,235,0.35); white-space: nowrap; }
.pie-tt-val { font-size: 0.78rem; color: rgba(245,240,235,0.85); text-align: right; }
.pie-tt-divider { border-top: 1px solid rgba(245,240,235,0.07); margin: 0.45rem 0; }

/* ── Deliver CTA ── */
.deliver-cta { padding: 0 4rem 6rem; }
.deliver-cta-inner { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 3rem; padding: 3.5rem 4rem; border: 1px solid rgba(200,169,126,0.22); background: linear-gradient(120deg, rgba(200,169,126,0.06) 0%, rgba(200,169,126,0.01) 100%); overflow: hidden; }
.deliver-cta-inner::before { content: ''; position: absolute; top: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(200,169,126,0.12) 0%, transparent 70%); pointer-events: none; }
.deliver-cta-inner::after  { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--warm), transparent 60%); }
.deliver-cta-text { flex: 1; }
.deliver-cta-title { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 300; color: var(--off-white); line-height: 1.15; margin: 0.4rem 0 0.8rem; }
.deliver-cta-sub { font-size: 0.82rem; color: rgba(245,240,235,0.45); line-height: 1.7; max-width: 420px; margin: 0; }
.deliver-cta-btn { flex-shrink: 0; display: inline-flex; align-items: center; gap: 1rem; background: var(--warm); color: var(--black); font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 1.2rem 2.8rem; cursor: none; transition: background 0.3s, transform 0.25s, box-shadow 0.3s; box-shadow: 0 4px 24px rgba(200,169,126,0.25); white-space: nowrap; }
.deliver-cta-btn:hover { background: #dbbf94; transform: translateY(-3px); box-shadow: 0 10px 40px rgba(200,169,126,0.35); }
.deliver-cta-btn svg { transition: transform 0.25s; }
.deliver-cta-btn:hover svg { transform: translateX(4px); }

/* ── Appointment History ── */
.appt-history { padding: 0 4rem 8rem; }
.appt-history-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
.appt-history-sub { font-size: 0.78rem; color: rgba(245,240,235,0.35); margin: 0.35rem 0 0; letter-spacing: 0.02em; }
.appt-history-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.appt-filter-btn { padding: 0.45rem 1.1rem; background: none; border: 1px solid rgba(245,240,235,0.1); border-radius: 20px; color: rgba(245,240,235,0.4); font-family: 'DM Sans', sans-serif; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: none; transition: border-color 0.2s, color 0.2s, background 0.2s; }
.appt-filter-btn:hover { border-color: rgba(200,169,126,0.35); color: var(--warm); }
.appt-filter-btn.active { background: rgba(200,169,126,0.1); border-color: rgba(200,169,126,0.45); color: var(--warm); }
.appt-history-table-wrap { overflow-x: auto; border: 1px solid rgba(200,169,126,0.1); border-radius: 4px; background: rgba(255,255,255,0.015); }
.appt-history-table { width: 100%; border-collapse: collapse; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; }
.appt-history-table thead tr { border-bottom: 1px solid rgba(200,169,126,0.12); }
.appt-history-table thead th { padding: 1rem 1.4rem; text-align: left; font-size: 0.62rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(245,240,235,0.3); white-space: nowrap; }
.appt-history-row { border-bottom: 1px solid rgba(245,240,235,0.04); transition: background 0.18s; }
.appt-history-row:last-child { border-bottom: none; }
.appt-history-row:hover { background: rgba(200,169,126,0.04); }
.appt-history-row.appt-expandable { cursor: pointer; }
.appt-history-row.appt-row-open { background: rgba(200,169,126,0.05); }
.appt-history-row td { padding: 1.1rem 1.4rem; vertical-align: middle; color: rgba(245,240,235,0.7); }
.appt-expand-hint { font-size: 0.6rem; letter-spacing: 0.06em; color: rgba(200,169,126,0.45); text-transform: uppercase; margin-top: 0.18rem; }
.appt-expand-row td { padding: 0 !important; border-bottom: 1px solid rgba(245,240,235,0.04); }
.appt-expand-inner { display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; padding: 0.85rem 1.4rem 1.1rem 3.2rem; background: rgba(200,169,126,0.03); border-top: 1px solid rgba(200,169,126,0.07); }
.appt-detail-item { display: flex; flex-direction: column; gap: 0.15rem; min-width: 140px; }
.appt-detail-item.appt-detail-notes { flex-basis: 100%; }
.appt-detail-key { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(245,240,235,0.3); }
.appt-detail-val { font-size: 0.8rem; color: rgba(245,240,235,0.75); }
a.appt-detail-link { color: var(--warm); text-decoration: none; transition: opacity 0.15s; }
a.appt-detail-link:hover { opacity: 0.75; }
.appt-client-cell { display: flex; align-items: center; gap: 0.75rem; }
.appt-client-cell > div { display: flex; flex-direction: column; }
.appt-avatar { flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%; background: rgba(200,169,126,0.1); border: 1px solid rgba(200,169,126,0.25); display: flex; align-items: center; justify-content: center; font-size: 0.62rem; letter-spacing: 0.05em; color: var(--warm); font-weight: 500; }
.appt-client-name { font-weight: 500; color: var(--off-white); white-space: nowrap; }
.appt-pkg-badge { font-size: 0.68rem; letter-spacing: 0.06em; color: rgba(245,240,235,0.55); background: rgba(245,240,235,0.04); border: 1px solid rgba(245,240,235,0.08); border-radius: 2px; padding: 0.2rem 0.6rem; white-space: nowrap; }
.appt-date-cell { display: flex; flex-direction: column; gap: 0.15rem; }
.appt-date { color: rgba(245,240,235,0.75); white-space: nowrap; }
.appt-time { font-size: 0.7rem; color: rgba(245,240,235,0.35); }
.appt-location { font-size: 0.75rem; color: rgba(245,240,235,0.45); }
.appt-status-badge { display: inline-block; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 20px; border: 1px solid; white-space: nowrap; }
.status--pending   { color: rgba(200,169,126,0.9); border-color: rgba(200,169,126,0.3); background: rgba(200,169,126,0.08); }
.status--completed { color: rgba(200,169,126,0.9); border-color: rgba(200,169,126,0.3); background: rgba(200,169,126,0.08); }
.status--delivered { color: #7ec89e; border-color: rgba(126,200,158,0.3); background: rgba(126,200,158,0.08); }
.status--cancelled { color: rgba(245,240,235,0.3); border-color: rgba(245,240,235,0.1); background: rgba(245,240,235,0.03); }
.appt-history-empty { text-align: center; padding: 3rem 1rem; font-size: 0.8rem; color: rgba(245,240,235,0.25); letter-spacing: 0.04em; border: 1px solid rgba(245,240,235,0.05); border-top: none; }
.appt-link-btn { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.68rem; letter-spacing: 0.07em; text-transform: uppercase; color: var(--warm); text-decoration: none; border-bottom: 1px solid rgba(200,169,126,0.25); padding-bottom: 1px; transition: border-color 0.2s, color 0.2s, gap 0.2s; white-space: nowrap; }
.appt-link-btn:hover { color: var(--warm-light); border-color: var(--warm); gap: 0.7rem; }
.appt-link-btn svg { transition: transform 0.2s; }
.appt-link-btn:hover svg { transform: translateX(2px); }
.appt-no-link { color: rgba(245,240,235,0.2); }

/* ── Availability Modal ── */
.avail-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 950; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
.avail-backdrop.open { opacity: 1; pointer-events: all; }
.avail-modal { background: #131313; border: 1px solid rgba(200,169,126,0.14); box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,169,126,0.04); border-radius: 12px; padding: 2.4rem 2.4rem 2rem; width: min(680px, 94vw); max-height: 88vh; overflow-y: auto; position: relative; transform: translateY(16px); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); scrollbar-width: thin; scrollbar-color: rgba(200,169,126,0.2) transparent; }
.avail-backdrop.open .avail-modal { transform: translateY(0); }
.avail-modal-close { position: absolute; top: 1rem; right: 1.2rem; background: none; border: none; color: rgba(245,240,235,0.35); font-size: 1.4rem; line-height: 1; cursor: none; transition: color 0.2s; padding: 0.2rem 0.4rem; }
.avail-modal-close:hover { color: var(--warm); }
.avail-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 300; color: var(--off-white); margin: 0 0 0.25rem; letter-spacing: 0.01em; }
.avail-modal-sub { font-size: 0.75rem; color: rgba(245,240,235,0.4); margin: 0 0 1.8rem; letter-spacing: 0.03em; }
.avail-divider { height: 1px; background: rgba(200,169,126,0.1); margin: 1.6rem 0; }
.avail-cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
.avail-cal-month-label { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--warm); }
.avail-cal-nav { background: none; border: none; color: rgba(245,240,235,0.45); cursor: none; padding: 0.2rem 0.5rem; transition: color 0.2s; line-height: 1; }
.avail-cal-nav:hover { color: var(--warm); }
.avail-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 0.8rem; }
.avail-cal-dname { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(245,240,235,0.3); text-align: center; padding-bottom: 4px; }
.avail-cal-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.72rem; color: rgba(245,240,235,0.65); border-radius: 4px; cursor: none; position: relative; transition: background 0.15s, color 0.15s; border: 1px solid transparent; user-select: none; }
.avail-cal-cell:not(.empty):not(.past):hover { background: rgba(200,169,126,0.08); color: var(--warm); }
.avail-cal-cell.past  { color: rgba(245,240,235,0.2); pointer-events: none; }
.avail-cal-cell.empty { pointer-events: none; }
.avail-cal-cell.today { border-color: rgba(200,169,126,0.3); color: var(--warm); }
.avail-cal-cell.blocked-full { background: rgba(180,0,0,0.18); border-color: rgba(180,0,0,0.4); color: rgba(245,240,235,0.35); }
.avail-cal-cell.has-slots { background: rgba(200,169,126,0.1); border-color: rgba(200,169,126,0.28); color: var(--warm); }
.avail-cal-cell.selected-avail { background: rgba(200,169,126,0.18); border-color: var(--warm); color: var(--off-white); font-weight: 500; }
.avail-cal-badge { position: absolute; bottom: 2px; width: 4px; height: 4px; border-radius: 50%; background: var(--warm); }
.avail-cal-cell.blocked-full .avail-cal-badge { background: rgba(220,60,60,0.9); }
.avail-date-panel { display: none; }
.avail-date-panel.visible { display: block; }
.avail-date-label { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--warm); margin-bottom: 1rem; }
.avail-block-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
.avail-block-row label { font-size: 0.8rem; color: rgba(245,240,235,0.7); cursor: none; display: flex; align-items: center; gap: 0.55rem; }
.avail-toggle { appearance: none; -webkit-appearance: none; width: 36px; height: 20px; border-radius: 10px; background: rgba(245,240,235,0.08); border: 1px solid rgba(245,240,235,0.15); position: relative; cursor: none; transition: background 0.25s, border-color 0.25s; flex-shrink: 0; }
.avail-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%; background: rgba(245,240,235,0.4); transition: transform 0.25s, background 0.25s; }
.avail-toggle:checked { background: rgba(200,169,126,0.22); border-color: var(--warm); }
.avail-toggle:checked::after { transform: translateX(16px); background: var(--warm); }
.avail-slots-section { margin-top: 1rem; transition: opacity 0.2s; }
.avail-slots-label { font-size: 0.7rem; color: rgba(245,240,235,0.4); letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.avail-slots-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; }
.avail-slot-chip { padding: 0.45rem 0; text-align: center; font-family: 'DM Sans', sans-serif; font-size: 0.65rem; letter-spacing: 0.02em; border-radius: 3px; border: 1px solid rgba(245,240,235,0.1); color: rgba(245,240,235,0.55); background: rgba(245,240,235,0.03); cursor: none; transition: background 0.15s, border-color 0.15s, color 0.15s; }
.avail-slot-chip:hover { border-color: rgba(200,169,126,0.4); color: var(--warm); background: rgba(200,169,126,0.06); }
.avail-slot-chip.blocked-slot { background: rgba(180,0,0,0.18); border-color: rgba(180,0,0,0.4); color: rgba(245,240,235,0.4); }
.avail-slot-chip.blocked-slot:hover { background: rgba(180,0,0,0.28); border-color: rgba(180,0,0,0.6); color: rgba(245,240,235,0.6); }
.avail-slot-chip.clicked { animation: chipPulse 0.4s ease forwards; }
@keyframes chipPulse {
  0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(200,169,126,0.5); }
  35%  { transform: scale(1.12); box-shadow: 0 0 0 7px rgba(200,169,126,0); }
  65%  { transform: scale(0.96); }
  100% { transform: scale(1); }
}
.avail-hint { font-size: 0.67rem; color: rgba(245,240,235,0.25); margin-top: 0.65rem; line-height: 1.65; }
.avail-actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.8rem; flex-wrap: wrap; }
.avail-save-btn { padding: 0.65rem 1.6rem; background: var(--warm); border: none; border-radius: 2px; color: #0a0a0a; font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; cursor: none; transition: opacity 0.2s; }
.avail-save-btn:hover { opacity: 0.82; }
.avail-clear-btn { padding: 0.65rem 1.2rem; background: none; border: 1px solid rgba(245,240,235,0.12); border-radius: 2px; color: rgba(245,240,235,0.4); font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; cursor: none; transition: border-color 0.2s, color 0.2s; }
.avail-clear-btn:hover { border-color: rgba(245,240,235,0.3); color: rgba(245,240,235,0.7); }
.avail-saved-msg { font-size: 0.72rem; color: #7ec89e; opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; gap: 0.4rem; margin-left: auto; }
.avail-saved-msg.show { opacity: 1; }
.avail-legend-row { display: flex; gap: 1.2rem; flex-wrap: wrap; margin-top: 0.6rem; }
.avail-legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.64rem; color: rgba(245,240,235,0.38); letter-spacing: 0.04em; }
.avail-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ── Message Modal ── */
.msg-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 900; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
.msg-modal-backdrop.open { opacity: 1; pointer-events: all; }
.msg-modal { background: #131313; border: 1px solid rgba(200,169,126,0.14); box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,169,126,0.04); border-radius: 12px; padding: 2.4rem 2.4rem 2rem; width: min(520px, 90vw); position: relative; transform: translateY(12px); transition: transform 0.28s cubic-bezier(0.16,1,0.3,1); }
.msg-modal-backdrop.open .msg-modal { transform: translateY(0); }
.msg-modal-close { position: absolute; top: 1rem; right: 1.2rem; background: none; border: none; color: rgba(245,240,235,0.35); font-size: 1.4rem; line-height: 1; cursor: none; transition: color 0.2s; padding: 0.2rem 0.4rem; }
.msg-modal-close:hover { color: var(--warm); }
.msg-modal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
.msg-modal-avatar { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; background: rgba(200,169,126,0.12); border: 1px solid rgba(200,169,126,0.3); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; letter-spacing: 0.06em; color: var(--warm); font-weight: 500; }
.msg-modal-name { font-size: 0.95rem; color: var(--cream); font-weight: 500; letter-spacing: 0.02em; margin-bottom: 0.2rem; }
.msg-modal-meta { font-size: 0.72rem; color: rgba(245,240,235,0.35); letter-spacing: 0.04em; }
.msg-modal-tag { margin-left: auto; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 20px; border: 1px solid; flex-shrink: 0; }
.msg-modal-divider { height: 1px; background: rgba(200,169,126,0.1); margin-bottom: 1.4rem; }
.msg-modal-body { font-size: 0.85rem; color: rgba(245,240,235,0.65); line-height: 1.75; margin: 0 0 2rem; }
.msg-modal-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.msg-modal-actions .btn-next, .msg-modal-actions .btn-back { font-size: 0.72rem; padding: 0.6rem 1.3rem; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .upcoming-hero { padding: 2.5rem 1rem 0; gap: 0.75rem; }
  .dash-blocks { grid-template-columns: 1fr; padding: 2rem; }
  .analytics-row { grid-template-columns: 1fr; padding: 0 2rem 4rem; }
  .analytics-card { align-items: flex-start; flex-direction: row; flex-wrap: wrap; gap: 1.5rem; }
  .analytics-header { margin-bottom: 0; width: 100%; }
  .chart-wrap { margin-bottom: 0; }
  .chart-legend { border-top: none; padding-top: 0; justify-content: center; }
  .deliver-cta { padding: 0 2rem 5rem; }
  .deliver-cta-inner { flex-direction: column; align-items: flex-start; padding: 2.5rem 2rem; gap: 2rem; }
  .deliver-cta-btn { width: 100%; justify-content: center; }
  .appt-history { padding: 0 2rem 6rem; }
  .appt-history-header { flex-direction: column; align-items: flex-start; gap: 1.2rem; }
}

/* ── Appointment Detail Modal ── */
.appt-detail-backdrop { position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.78); backdrop-filter: blur(7px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
.appt-detail-backdrop.open { opacity: 1; pointer-events: all; }
.appt-detail-modal { position: relative; background: #0f0e0c; border: 1px solid rgba(200,169,126,0.25); padding: 2.8rem 3rem; max-width: 560px; width: 92%; max-height: 88vh; overflow-y: auto; transform: translateY(16px); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
.appt-detail-backdrop.open .appt-detail-modal { transform: translateY(0); }
.appt-detail-eyebrow { font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--warm); margin-bottom: 0.6rem; }
.appt-detail-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: var(--off-white); margin-bottom: 0.8rem; line-height: 1.2; }
.appt-detail-badge-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.5rem; }
.appt-detail-ref { font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(245,240,235,0.3); }
.appt-detail-divider { height: 1px; background: rgba(200,169,126,0.15); margin: 1.4rem 0; }
.appt-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem 2rem; }
.appt-detail-field--full { grid-column: 1 / -1; }
.appt-detail-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(200,169,126,0.7); margin-bottom: 0.35rem; }
.appt-detail-val { font-size: 0.9rem; color: var(--off-white); line-height: 1.5; }
.appt-detail-link { color: var(--warm); text-decoration: none; transition: color 0.2s; }
.appt-detail-link:hover { color: var(--warm-light); }
.appt-detail-notes { background: rgba(245,240,235,0.03); border: 1px solid rgba(200,169,126,0.12); padding: 0.9rem 1rem; font-size: 0.85rem; color: rgba(245,240,235,0.7); line-height: 1.7; border-left: 2px solid rgba(200,169,126,0.35); }
.appt-detail-actions { display: flex; align-items: center; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(200,169,126,0.1); }

/* ── Reach Out Modal ── */
.reach-out-modal { max-width: 480px; }
.reach-out-sub { font-size: 0.85rem; color: rgba(245,240,235,0.5); line-height: 1.7; margin-top: 0.4rem; }
.reach-out-sub strong { color: var(--off-white); }
.reach-out-options { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; }
.reach-out-card { display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem; padding: 1.4rem 1.4rem; background: rgba(245,240,235,0.03); border: 1px solid rgba(200,169,126,0.18); cursor: none; transition: background 0.2s, border-color 0.2s; text-align: left; }
.reach-out-card:hover:not(.disabled) { background: rgba(200,169,126,0.08); border-color: rgba(200,169,126,0.45); }
.reach-out-card.disabled { opacity: 0.35; pointer-events: none; }
.reach-out-card-icon { color: var(--warm); margin-bottom: 0.3rem; }
.reach-out-card-label { font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--warm); font-weight: 500; }
.reach-out-card-val { font-size: 0.8rem; color: rgba(245,240,235,0.55); word-break: break-all; }
@media (max-width: 600px) {
  .appt-history-table thead th:nth-child(4),
  .appt-history-row td:nth-child(4) { display: none; }
}
</style>
