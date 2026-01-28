/**
 * Design Tokens - Constants for consistent design across the app
 *
 * Centralized values for colors, spacing, animations, and other design decisions.
 * Import these instead of hardcoding values.
 */

// ============================================================================
// COLORS (Hex values not in Tailwind theme)
// ============================================================================

export const COLORS = {
  /** Manifestation button - #3a5a8f */
  MANIFESTATION_BUTTON: '#3a5a8f',
  /** Anonymous/Success state - #10b981 (also available as --color-progress in CSS) */
  SUCCESS_GREEN: '#10b981',
  /** Identified user state - #3b82f6 (also available as --color-type-sugestao in CSS) */
  IDENTIFIED_BLUE: '#3b82f6',
  /** Mobile header bar - #28477D (also available as .bg-primary-light in CSS) */
  MOBILE_HEADER: '#28477D',
} as const

// ============================================================================
// SPACING & SIZE (Arbitrary values)
// ============================================================================

export const SPACING = {
  /** Channel list maximum height */
  CHANNEL_LIST_MAX_HEIGHT: '400px',
  /** Font level display minimum width */
  FONT_DISPLAY_MIN_WIDTH: '3rem',
  /** Drawer maximum width on mobile */
  DRAWER_MAX_WIDTH_MOBILE: '85vw',
  /** Modal width on mobile */
  MODAL_WIDTH_MOBILE: '90%',
  /** Tab bar sticky position from top */
  TAB_BAR_STICKY_TOP: '72px',
  /** Textarea minimum height */
  TEXTAREA_MIN_HEIGHT: '300px',
  /** Center FAB button offset (negative margin to pull up) */
  CENTER_BUTTON_OFFSET: '-34px',
} as const

// ============================================================================
// TRANSITION DURATIONS (milliseconds)
// ============================================================================

export const DURATION = {
  /** Fast transition - 150ms */
  FAST: 150,
  /** Normal transition - 200ms */
  NORMAL: 200,
  /** Slow transition - 300ms */
  SLOW: 300,
  /** Popover close delay - 100ms */
  POPOVER_CLOSE: 100,
  /** Font level display duration - 1500ms */
  FONT_LEVEL_DISPLAY: 1500,
  /** Search input debounce delay - 300ms */
  SEARCH_DEBOUNCE: 300,
  /** Timer interval - 1000ms */
  TIMER_INTERVAL: 1000,
  /** Copy to clipboard feedback duration - 2000ms */
  COPY_FEEDBACK: 2000,
} as const

// ============================================================================
// FONT SIZE LEVELS
// ============================================================================

export const FONT_LEVELS = {
  /** Number of available font size levels */
  COUNT: 4,
  /** Minimum font level index */
  MIN: 0,
  /** Maximum font level index */
  MAX: 3,
} as const

// ============================================================================
// MANIFESTATION STEPS
// ============================================================================

export const STEPS = {
  TYPE: 1,
  SUBJECT: 2,
  CONTENT: 3,
  REVIEW: 4,
  /** Total number of steps */
  TOTAL: 4,
} as const

/** Completed steps count for each step */
export const COMPLETED_STEPS = {
  AT_TYPE: 0,
  AT_SUBJECT: 1,
  AT_CONTENT: 2,
  AT_REVIEW: 3,
} as const

// ============================================================================
// CONTENT LIMITS
// ============================================================================

export const LIMITS = {
  /** Minimum text characters */
  MIN_TEXT_CHARS: 20,
  /** Maximum text characters */
  MAX_TEXT_CHARS: 12000,
  /** Maximum audio duration in seconds (5 minutes) */
  MAX_AUDIO_DURATION_SECONDS: 300,
  /** Maximum audio count */
  MAX_AUDIO_COUNT: 5,
  /** Maximum file upload count */
  MAX_FILE_COUNT: 5,
} as const

// ============================================================================
// TOGGLE/SWITCH VALUES
// ============================================================================

export const TOGGLE = {
  /** Translate value when toggle is ON */
  TRANSITION_ON: 'translate-x-6',
  /** Translate value when toggle is OFF */
  TRANSITION_OFF: 'translate-x-0.5',
} as const

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const Z_INDEX = {
  /** Tab bar */
  TABS: 20,
  /** Page header / Desktop sidebar */
  HEADER: 30,
  /** Dropdown menus */
  DROPDOWN: 40,
  /** Modal overlays */
  MODAL: 50,
  /** Drawer / Popover / FAB buttons */
  DRAWER: 50,
  FAB: 50,
  POPOVER: 50,
} as const

// ============================================================================
// ICON SIZES (Tailwind classes)
// ============================================================================

export const ICON_SIZE = {
  /** Small icon container */
  SMALL: 'w-10 h-10',
  /** Medium icon container */
  MEDIUM: 'w-12 h-12',
  /** Large icon container */
  LARGE: 'w-20 h-20',
} as const

// ============================================================================
// POSITION VALUES (Tailwind classes)
// ============================================================================

export const POSITION = {
  /** FAB button position on desktop */
  FAB_DESKTOP: 'bottom-8 right-8',
  /** Chat button position (above nav) */
  CHAT_BUTTON: 'bottom-20 right-4',
  /** Accessibility panel position on desktop */
  PANEL_DESKTOP: 'bottom-8 right-8',
  /** Desktop sidebar position */
  SIDEBAR_DESKTOP: 'left-8 top-32 bottom-8',
} as const

// ============================================================================
// BORDER RADIUS (Tailwind classes)
// ============================================================================

export const RADIUS = {
  /** Extra small radius - 0.25rem */
  XS: 'rounded-sm',
  /** Small radius - 0.375rem */
  SM: 'rounded',
  /** Medium radius - 0.5rem */
  MD: 'rounded-lg',
  /** Large radius - 0.75rem */
  LG: 'rounded-xl',
  /** Extra large radius - 1rem */
  XL: 'rounded-2xl',
  /** Full radius (circle) */
  FULL: 'rounded-full',
} as const

// ============================================================================
// TRANSITION EASING
// ============================================================================

export const EASING = {
  /** Default easing for most transitions */
  DEFAULT: 'ease-out',
  /** Easing for drawer slide animations */
  DRAWER: 'ease-in-out',
} as const

// ============================================================================
// SCALE VALUES (Hover effects)
// ============================================================================

export const SCALE = {
  /** Scale on hover */
  HOVER: 'scale-105',
  /** Scale on active/press */
  ACTIVE: 'scale-95',
} as const
