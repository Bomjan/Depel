export function Icon({ children, size = 44, className = '', title }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Search'}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.4 16.4 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function XCircleIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Error'}>
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function XIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Close'}>
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function UsersIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'People'}>
      <path
        d="M16.5 21v-1.3c0-1.4-1.2-2.6-2.6-2.6H8.1c-1.4 0-2.6 1.2-2.6 2.6V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 13.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M18.6 21v-1.1c0-1.1-.7-2.1-1.8-2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.8 6.3a3 3 0 0 1 0 5.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function GearIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Settings'}>
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 12a7.5 7.5 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3h-6l-.2 2.9a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1L9 21h6l.2-2.9a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function VideoIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Video'}>
      <path
        d="M4.5 7.8c0-1.2 1-2.3 2.3-2.3h6.9c1.2 0 2.3 1 2.3 2.3v8.4c0 1.2-1 2.3-2.3 2.3H6.8c-1.2 0-2.3-1-2.3-2.3V7.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.2 10.2 20 8.2v7.6l-3.8-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function PinIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Location'}>
      <path
        d="M12 22s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </Icon>
  )
}

export function PhoneIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Phone'}>
      <path
        d="M7.2 3.8h2.1c.8 0 1.4.6 1.5 1.3l.3 2c.1.7-.3 1.5-1 1.8l-1.2.6c.9 1.9 2.4 3.4 4.3 4.3l.6-1.2c.3-.7 1.1-1.1 1.8-1l2 .3c.7.1 1.3.7 1.3 1.5v2.1c0 .9-.7 1.6-1.6 1.6C10 19.1 4.9 14 4.9 7c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function MailIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Email'}>
      <path
        d="M5.2 7.2h13.6c.9 0 1.6.7 1.6 1.6v8.4c0 .9-.7 1.6-1.6 1.6H5.2c-.9 0-1.6-.7-1.6-1.6V8.8c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.2 8.4 12 13.2l7.8-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function ClockIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Time'}>
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 6.5v6l4 2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function HomeIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Home'}>
      <path
        d="M4 10.9 12 4l8 6.9v8.2c0 1-.8 1.8-1.8 1.8h-3.6v-6.1H9.4v6.1H5.8c-1 0-1.8-.8-1.8-1.8v-8.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function GridIcon(props) {
  return (
    <Icon {...props} title={props.title ?? 'Catalog'}>
      <path
        d="M5.5 5.5h5.8v5.8H5.5V5.5Zm7.2 0h5.8v5.8h-5.8V5.5ZM5.5 12.7h5.8v5.8H5.5v-5.8Zm7.2 0h5.8v5.8h-5.8v-5.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

