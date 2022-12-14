const iconStyle = {
	width: `1em`,
	height: `1em`,
	verticalAlign: `-0.125em`,
	fill: `currentColor`,
};

function Icon({ children }: React.PropsWithChildren) {
	return (
		<svg xmlns={`http://www.w3.org/2000/svg`} fill={`currentColor`} viewBox={`0 0 12 12`} style={iconStyle} focusable={false}>
			{children}
		</svg>
	);
}

export function LoadingIcon() {
	return (
		<Icon>
			<path
				fill={`currentColor`}
				fillRule={`evenodd`}
				clipRule={`evenodd`}
				d={`M11 6H12C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6H1C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z`}>
				<animateTransform attributeName={`transform`} begin={`0s`} dur={`0.75s`} type={`rotate`} from={`0 6 6`} to={`360 6 6`} repeatCount={`indefinite`} />
			</path>
		</Icon>
	);
}

export function PlusIcon() {
	return (
		<Icon>
			<path stroke={`currentColor`} strokeLinecap={`round`} strokeWidth={2} d={`M6 2v8m4-4H2`} />
		</Icon>
	);
}

export function XIcon() {
	return (
		<Icon>
			<path stroke={`currentColor`} strokeLinecap={`round`} strokeWidth={2} d={`M3.5 8.5l5-5m0 5l-5-5`} />
		</Icon>
	);
}

export function ErrorIcon() {
	return (
		<Icon>
			<g fill={`none`} stroke={`currentColor`}>
				<circle cx={`5.5`} cy={`6.5`} r={`5`} />
				<path strokeLinecap={`round`} d={`M5.5 3.5v3`} />
			</g>
			<circle cx={`5.5`} cy={`9`} r={`1`} fill={`currentColor`} />
		</Icon>
	);
}
