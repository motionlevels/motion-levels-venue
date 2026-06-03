export function LogoIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 5 58 19.5 32 34 6 19.5Z" fill="currentColor" />
      <path d="M6 20 32 34v25L6 45Z" fill="currentColor" opacity=".56" />
      <path d="M58 20 32 34v25l26-14Z" fill="currentColor" opacity=".36" />
      <path d="M32 16 42 21.5 32 27 22 21.5Z" fill="#031017" opacity=".82" />
    </svg>
  );
}

export function GameIcon({ name }: { name: "mole" | "loop" | "lava" | "duel" }) {
  if (name === "mole") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="55" rx="25" ry="5" fill="currentColor" opacity=".22" />
        <path d="M21 52V37c0-8 5-14 14-14s14 6 14 14v15" fill="currentColor" />
        <path d="M14 52c0-6 4-10 10-10 5 0 9 4 10 10" fill="currentColor" opacity=".35" />
        <circle cx="31" cy="37" r="2.7" fill="#06101a" />
        <circle cx="40" cy="37" r="2.7" fill="#06101a" />
        <ellipse cx="35.5" cy="43.5" rx="3" ry="2.4" fill="#06101a" />
      </svg>
    );
  }
  if (name === "lava") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M34 6c2 10-7 12-3 20 1-4 6-6 7-12 6 5 9 12 9 18 0 8-7 13-15 13s-15-5-15-13c0-8 7-13 17-26Z" fill="currentColor" />
        <path d="M6 50c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3 4 3 6 3v6H6Z" fill="currentColor" opacity=".45" />
      </svg>
    );
  }
  if (name === "duel") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M15 11l25 25M49 11 24 36" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M40 36l10 10M24 36 14 46" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" opacity=".5" />
        <circle cx="32" cy="29" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 22h23a11 11 0 0 1 0 22H23" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="m22 13-9 9 9 9" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="25" cy="23" r="9" fill="currentColor" />
      <path d="M9 55c0-11 7-18 16-18s16 7 16 18" fill="currentColor" />
      <circle cx="45" cy="25" r="7" fill="currentColor" opacity=".65" />
    </svg>
  );
}

export function CategoryIcon({ id }: { id: string }) {
  if (id === "team") return <UsersIcon />;
  if (id === "versus") {
    return (
      <svg width="15" height="15" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 12l16 40M50 12 34 52" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <path d="M20 34h24" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "attract") {
    return (
      <svg width="15" height="15" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 22h23a11 11 0 0 1 0 22H23" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <path d="m22 13-9 9 9 9" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 8l8 17 18 3-13 13 3 18-16-9-16 9 3-18L6 28l18-3Z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
      <path d="m14 33 13 13 23-27" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M24 22v20M40 22v20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 18l28 28M46 18 18 46" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
