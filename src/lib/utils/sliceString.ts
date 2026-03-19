export const sliceString = (str: string, maxLength: number) => {
	return str.slice(0, maxLength) + (str.length > maxLength ? '...' : '')
}
