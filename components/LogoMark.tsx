const LogoMark = ({ size = 34 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <rect width="96" height="96" rx="24" fill="#221D15" />
        <g fill="#E8A33D">
            <rect x="22" y="40" width="7" height="16" rx="3.5" />
            <rect x="35" y="30" width="7" height="36" rx="3.5" />
            <rect x="48" y="22" width="7" height="52" rx="3.5" fill="#FFC96B" />
            <rect x="61" y="32" width="7" height="32" rx="3.5" />
            <rect x="74" y="42" width="7" height="12" rx="3.5" opacity="0.85" />
        </g>
    </svg>
)

export default LogoMark
